'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Loader2,
  CreditCard,
  Banknote,
  Landmark,
  Wallet,
  HandCoins,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import PayPalButtons from '@/components/checkout/PayPalButtons';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { haptic } from '@/lib/haptics';
import { integrations } from '@/lib/config';
import { useI18n } from '@/i18n/LanguageProvider';
import type { OrderType } from '@/lib/types';

type Method = 'stripe' | 'paypal' | 'wise' | 'cash' | 'card-delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useI18n();
  const ORDER_TYPES: { value: OrderType; label: string; hint: string }[] = [
    { value: 'DELIVERY', label: t.checkout.delivery, hint: t.checkout.deliveryHint },
    { value: 'PICKUP', label: t.checkout.pickup, hint: t.checkout.pickupHint },
    { value: 'DINE_IN', label: t.checkout.dineIn, hint: t.checkout.dineInHint },
  ];
  const { lines, orderType, setOrderType, subtotal, deliveryFee, tax, total, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<Method>('stripe');
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    notes: '',
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && lines.length === 0 && !loading) {
      const t = setTimeout(() => router.replace('/menu'), 1200);
      return () => clearTimeout(t);
    }
  }, [mounted, lines.length, loading, router]);

  // Build the list of available payment methods (online ones depend on config).
  const m = t.checkout.methods;
  const methods: { id: Method; label: string; hint: string; icon: typeof CreditCard }[] = [
    { id: 'stripe', label: m.card, hint: m.cardHint, icon: CreditCard },
    ...(integrations.paypalClientId
      ? [{ id: 'paypal' as Method, label: m.paypal, hint: m.paypalHint, icon: Wallet }]
      : []),
    ...(integrations.wiseLink
      ? [{ id: 'wise' as Method, label: m.wise, hint: m.wiseHint, icon: Landmark }]
      : []),
    { id: 'cash', label: m.cash, hint: m.cashHint, icon: Banknote },
    { id: 'card-delivery', label: m.cardDelivery, hint: m.cardDeliveryHint, icon: HandCoins },
  ];

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    if (!form.customerName || !form.customerEmail) {
      toast.error(t.checkout.errName);
      haptic('error');
      return false;
    }
    if (orderType === 'DELIVERY' && !form.address) {
      toast.error(t.checkout.errAddress);
      haptic('error');
      return false;
    }
    return true;
  }

  async function placeOrder(paymentMethod: Method, paypalOrderId?: string) {
    if (!validate()) return;
    setLoading(true);
    haptic('medium');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: orderType,
          paymentMethod,
          paypalOrderId,
          lines: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Checkout failed.');
        haptic('error');
        setLoading(false);
        return;
      }
      haptic('success');
      // Stripe hosted checkout returns an absolute URL to redirect to.
      if (data.method === 'stripe' && !data.simulated && data.redirectUrl?.startsWith('http')) {
        window.location.href = data.redirectUrl;
        return;
      }
      clear();
      router.push(data.redirectUrl);
    } catch (err) {
      console.error(err);
      toast.error(t.checkout.errGeneric);
      haptic('error');
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <main className="min-h-screen bg-page">
        <Navbar />
        <div className="grid min-h-screen place-items-center px-4 text-center">
          <div>
            <p className="font-display text-2xl">{t.checkout.cartEmpty}</p>
            <p className="mt-2 text-fg/60">{t.checkout.redirecting}</p>
          </div>
        </div>
      </main>
    );
  }

  const onDeliveryLabel = t.checkout.placeOrderOnDelivery.replace('{total}', formatPrice(total()));
  const payLabel: Record<Method, string> = {
    stripe: `${t.checkout.pay} ${formatPrice(total())}`,
    paypal: '',
    wise: t.checkout.placeOrderWise,
    cash: onDeliveryLabel,
    'card-delivery': onDeliveryLabel,
  };

  return (
    <main className="min-h-screen bg-page">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
        <Link
          href="/menu"
          className="mb-8 inline-flex items-center gap-2 text-sm text-fg/60 transition hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> {t.checkout.backToMenu}
        </Link>

        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          {t.checkout.title}
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-8">
            {/* Order type */}
            <section>
              <h2 className="mb-4 font-display text-lg font-bold">{t.checkout.howWouldYouLike}</h2>
              <div className="grid grid-cols-3 gap-3">
                {ORDER_TYPES.map((ot) => (
                  <button
                    key={ot.value}
                    onClick={() => {
                      haptic('select');
                      setOrderType(ot.value);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      orderType === ot.value
                        ? 'border-butter bg-butter/10'
                        : 'border-black/10 bg-black/[0.03] hover:border-black/25'
                    }`}
                  >
                    <div className="font-semibold">{ot.label}</div>
                    <div className="text-xs text-fg/50">{ot.hint}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Details */}
            <section>
              <h2 className="mb-4 font-display text-lg font-bold">{t.checkout.yourDetails}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.checkout.fullName} required>
                  <input value={form.customerName} onChange={(e) => update('customerName', e.target.value)} className="input" placeholder="Olivia Hart" />
                </Field>
                <Field label={t.checkout.email} required>
                  <input type="email" value={form.customerEmail} onChange={(e) => update('customerEmail', e.target.value)} className="input" placeholder="olivia@email.com" />
                </Field>
                <Field label={t.checkout.phone}>
                  <input value={form.customerPhone} onChange={(e) => update('customerPhone', e.target.value)} className="input" placeholder="+1 555 0100" />
                </Field>
                {orderType === 'DELIVERY' && (
                  <Field label={t.checkout.deliveryAddress} required>
                    <input value={form.address} onChange={(e) => update('address', e.target.value)} className="input" placeholder="250 Hawtown Road, New York" />
                  </Field>
                )}
                <div className="sm:col-span-2">
                  <Field label={t.checkout.notes}>
                    <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="input min-h-[80px] resize-none" placeholder={t.checkout.notesPlaceholder} />
                  </Field>
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section>
              <h2 className="mb-4 font-display text-lg font-bold">{t.checkout.paymentMethod}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {methods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => {
                      haptic('select');
                      setMethod(pm.id);
                    }}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition ${
                      method === pm.id
                        ? 'border-butter bg-butter/10'
                        : 'border-black/10 bg-black/[0.03] hover:border-black/25'
                    }`}
                  >
                    <pm.icon className="h-5 w-5 text-fg/70" />
                    <div className="text-sm font-semibold leading-tight">{pm.label}</div>
                    <div className="text-xs text-fg/50">{pm.hint}</div>
                  </button>
                ))}
              </div>

              {method === 'wise' && (
                <p className="mt-4 rounded-xl bg-azure/10 p-3 text-sm text-fg/70">
                  {t.checkout.wiseNote}
                </p>
              )}
              {(method === 'cash' || method === 'card-delivery') && (
                <p className="mt-4 rounded-xl bg-black/[0.04] p-3 text-sm text-fg/70">
                  {method === 'cash' ? t.checkout.cashNote : t.checkout.cardDeliveryNote}
                </p>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="glass rounded-[2rem] p-6">
              <h2 className="font-display text-lg font-bold">{t.checkout.orderSummary}</h2>
              <ul className="mt-4 space-y-3">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.image} alt={l.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-tight">{l.name}</div>
                      <div className="text-xs text-fg/50">{t.checkout.qty} {l.quantity}</div>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(l.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="my-5 h-px bg-black/[0.08]" />
              <div className="space-y-2 text-sm">
                <Row label={t.checkout.subtotal} value={formatPrice(subtotal())} />
                {orderType === 'DELIVERY' && (
                  <Row label={t.checkout.deliveryFee} value={formatPrice(deliveryFee())} />
                )}
                <Row label={t.checkout.tax} value={formatPrice(tax())} />
                <div className="my-2 h-px bg-black/[0.08]" />
                <Row label={t.checkout.total} value={formatPrice(total())} bold />
              </div>

              {/* Action area — PayPal renders its own buttons */}
              {method === 'paypal' ? (
                <div className="mt-6">
                  <PayPalButtons
                    amount={total()}
                    onApproved={(id) => placeOrder('paypal', id)}
                    onError={(msg) => toast.error(msg)}
                  />
                  {loading && (
                    <p className="mt-2 flex items-center justify-center gap-2 text-sm text-fg/50">
                      <Loader2 className="h-4 w-4 animate-spin" /> {t.checkout.finalising}
                    </p>
                  )}
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => placeOrder(method)}
                  disabled={loading}
                  className="btn-primary mt-6 w-full disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t.checkout.processing}
                    </>
                  ) : (
                    <>
                      {method === 'stripe' && <Lock className="h-4 w-4" />}
                      {payLabel[method]}
                    </>
                  )}
                </motion.button>
              )}

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-fg/40">
                <Lock className="h-3 w-3" />
                {method === 'stripe' ? t.checkout.securedStripe : t.checkout.detailsPrivate}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(26, 22, 17, 0.12);
          background: rgba(26, 22, 17, 0.03);
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: #1a1611;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: rgba(245, 213, 71, 0.7);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg/70">
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-bold' : 'text-fg/70'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-butter' : ''}>{value}</span>
    </div>
  );
}
