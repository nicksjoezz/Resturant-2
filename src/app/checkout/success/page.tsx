import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Receipt } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import ClearCartOnMount from '@/components/cart/ClearCartOnMount';
import Confetti from '@/components/ui/Confetti';
import WisePanel from '@/components/checkout/WisePanel';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { getT } from '@/i18n/server';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; method?: string };
}) {
  const t = getT();
  const s = t.success;
  const code = searchParams.order;
  const order = code
    ? await prisma.order.findUnique({ where: { code }, include: { items: true } })
    : null;

  const method = order?.paymentMethod ?? searchParams.method;
  const isWise = method === 'wise';
  const onDelivery = method === 'cash' || method === 'card-delivery';
  const heading = isWise ? s.almostThere : onDelivery ? s.placed : s.confirmed;
  const blurb = isWise
    ? s.blurbWise
    : method === 'cash'
      ? s.blurbCash
      : method === 'card-delivery'
        ? s.blurbCardDelivery
        : s.blurbConfirmed;

  return (
    <main className="min-h-screen bg-page">
      <Navbar />
      <ClearCartOnMount />
      <Confetti />

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-28 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-butter/15">
          <CheckCircle2 className="h-12 w-12 text-butter" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-md text-fg/60">
          {s.thankYou}
          {order ? `, ${order.customerName.split(' ')[0]}` : ''}! {blurb}
        </p>

        {order && isWise && (
          <WisePanel reference={order.code} amount={formatPrice(order.total)} />
        )}

        {order ? (
          <div className="glass mt-10 w-full rounded-[2rem] p-6 text-left">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-fg/60">
                <Receipt className="h-4 w-4" /> {s.orderCode}
              </span>
              <span className="font-display text-lg font-bold text-butter">{order.code}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-fg/60">
              <span className="flex items-center gap-2">
                {order.type === 'DELIVERY' ? (
                  <MapPin className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {order.type === 'DELIVERY' ? s.delivery : order.type === 'PICKUP' ? s.pickup : s.dineIn}
              </span>
              <span className="rounded-full bg-black/[0.06] px-3 py-1 text-xs font-medium">
                {order.status}
              </span>
            </div>

            <div className="my-5 h-px bg-black/[0.06]" />
            <ul className="space-y-3">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-fg/50">{s.qty} {it.quantity}</div>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="my-5 h-px bg-black/[0.06]" />
            <div className="flex items-center justify-between font-display text-lg font-bold">
              <span>{order.paid ? s.totalPaid : s.totalDue}</span>
              <span className="text-butter">{formatPrice(order.total)}</span>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-fg/50">{s.notFound}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/menu" className="btn-primary">
            {s.orderAgain}
          </Link>
          <Link href="/" className="btn-ghost">
            {s.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
