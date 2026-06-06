import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, stripeEnabled } from '@/lib/stripe';
import { computeTotals, makeOrderCode } from '@/lib/utils';
import type { OrderType } from '@/lib/types';

type IncomingLine = { id: string; quantity: number };
type PaymentMethod = 'stripe' | 'paypal' | 'wise' | 'cash' | 'card-delivery';
const OFFLINE: PaymentMethod[] = ['wise', 'cash', 'card-delivery'];

/**
 * Create an order from the cart. Prices are ALWAYS recomputed from the database.
 * Supports five payment methods:
 *  - stripe         → Stripe Checkout session (or simulated paid if no keys)
 *  - paypal         → client already captured; we record it as paid
 *  - wise           → offline bank transfer, saved unpaid (staff verify)
 *  - cash           → pay-on-delivery, saved unpaid, sent to kitchen
 *  - card-delivery  → pay card on delivery, saved unpaid, sent to kitchen
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      lines,
      customerName,
      customerEmail,
      customerPhone = '',
      address = '',
      type = 'DELIVERY',
      notes = '',
      paymentMethod = 'stripe',
      paypalOrderId = null,
    } = body as {
      lines: IncomingLine[];
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      address?: string;
      type?: OrderType;
      notes?: string;
      paymentMethod?: PaymentMethod;
      paypalOrderId?: string | null;
    };

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!customerName || !customerEmail) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (type === 'DELIVERY' && !address) {
      return NextResponse.json({ error: 'Delivery address is required.' }, { status: 400 });
    }

    // Resolve real items + prices from DB
    const ids = lines.map((l) => l.id);
    const dbItems = await prisma.menuItem.findMany({ where: { id: { in: ids }, available: true } });
    const byId = new Map(dbItems.map((i) => [i.id, i]));

    const resolved = lines
      .map((l) => {
        const item = byId.get(l.id);
        if (!item) return null;
        const quantity = Math.max(1, Math.min(50, Math.floor(l.quantity)));
        return { item, quantity };
      })
      .filter((x): x is { item: (typeof dbItems)[number]; quantity: number } => x !== null);

    if (resolved.length === 0) {
      return NextResponse.json({ error: 'No valid items in cart.' }, { status: 400 });
    }

    const subtotal = +resolved.reduce((s, r) => s + r.item.price * r.quantity, 0).toFixed(2);
    const { deliveryFee, tax, total } = computeTotals(subtotal, type);

    // Decide initial status/paid based on payment method.
    const paidNow = paymentMethod === 'paypal';
    const initialStatus =
      paymentMethod === 'paypal'
        ? 'PAID'
        : paymentMethod === 'cash' || paymentMethod === 'card-delivery'
          ? 'PREPARING' // accepted into the kitchen, paid on delivery
          : 'PENDING';

    const order = await prisma.order.create({
      data: {
        code: makeOrderCode(),
        customerName,
        customerEmail,
        customerPhone,
        address,
        type,
        notes,
        paymentMethod,
        paypalOrderId: paypalOrderId || undefined,
        status: initialStatus,
        paid: paidNow,
        subtotal,
        deliveryFee,
        tax,
        total,
        items: {
          create: resolved.map((r) => ({
            menuItemId: r.item.id,
            name: r.item.name,
            price: r.item.price,
            quantity: r.quantity,
            image: r.item.image,
          })),
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    // --- Offline / non-Stripe methods: nothing more to charge ---
    if (OFFLINE.includes(paymentMethod) || paymentMethod === 'paypal') {
      return NextResponse.json({
        ok: true,
        method: paymentMethod,
        code: order.code,
        redirectUrl: `/checkout/success?order=${order.code}&method=${paymentMethod}`,
      });
    }

    // --- Stripe simulated flow (no keys) ---
    if (!stripeEnabled || !stripe) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paid: true },
      });
      return NextResponse.json({
        simulated: true,
        method: 'stripe',
        code: order.code,
        redirectUrl: `/checkout/success?order=${order.code}&simulated=1`,
      });
    }

    // --- Stripe Checkout Session ---
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        ...resolved.map((r) => ({
          quantity: r.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(r.item.price * 100),
            product_data: {
              name: r.item.name,
              images: r.item.image.startsWith('http') ? [r.item.image] : undefined,
            },
          },
        })),
        ...(deliveryFee > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'usd',
                  unit_amount: Math.round(deliveryFee * 100),
                  product_data: { name: 'Delivery fee' },
                },
              },
            ]
          : []),
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(tax * 100),
            product_data: { name: 'Tax' },
          },
        },
      ],
      metadata: { orderId: order.id, orderCode: order.code },
      success_url: `${baseUrl}/checkout/success?order=${order.code}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=1`,
    });

    return NextResponse.json({
      simulated: false,
      method: 'stripe',
      code: order.code,
      redirectUrl: session.url,
    });
  } catch (err) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 });
  }
}
