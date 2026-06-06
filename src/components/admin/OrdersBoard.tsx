'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Package, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { usePolling } from '@/lib/usePolling';
import { formatPrice, formatDate } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';
import { type OrderStatus } from '@/lib/types';

type OrderItem = { id: string; name: string; price: number; quantity: number; image: string };
type Order = {
  id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  address: string;
  type: string;
  status: OrderStatus;
  total: number;
  paid: boolean;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-black/[0.06] text-fg/70',
  PAID: 'bg-azure/20 text-azure',
  PREPARING: 'bg-butter/20 text-butter',
  READY: 'bg-green-500/20 text-green-400',
  COMPLETED: 'bg-green-700/20 text-green-300',
  CANCELLED: 'bg-ember/20 text-ember',
};

// The next logical status to advance an order to.
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PAID: 'PREPARING',
  PREPARING: 'READY',
  READY: 'COMPLETED',
};

const FILTERS = ['ALL', 'PAID', 'PREPARING', 'READY', 'COMPLETED'] as const;

export default function OrdersBoard() {
  const { t } = useI18n();
  const sl = (s: string) => t.admin.statuses[s as keyof typeof t.admin.statuses] ?? s;
  const tl = (s: string) => t.admin.types[s as keyof typeof t.admin.types] ?? s;
  const { data, loading, refresh } = usePolling<{ orders: Order[] }>('/api/admin/orders', 4000);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL');
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: OrderStatus) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${t.admin.orders.toastUpdated} ${sl(status)}`);
      await refresh();
    } catch {
      toast.error(t.admin.orders.toastError);
    } finally {
      setBusy(null);
    }
  }

  const orders = data?.orders ?? [];
  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {t.admin.orders.title}
          </h1>
          <p className="mt-1 text-sm text-fg/50">
            {t.admin.orders.live}
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                filter === f ? 'bg-butter text-ink' : 'bg-black/[0.04] text-fg/60 hover:bg-black/[0.06]'
              }`}
            >
              {f === 'ALL' ? t.admin.orders.all : sl(f)}
              {f !== 'ALL' && (
                <span className="ml-1.5 opacity-60">
                  {orders.filter((o) => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="py-20 text-center text-fg/50">{t.admin.orders.loading}</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-fg/50">
          <Package className="mx-auto mb-3 h-10 w-10 opacity-40" />
          {t.admin.orders.none}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((o) => (
              <motion.div
                key={o.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex flex-col rounded-2xl border border-black/10 bg-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-lg font-bold text-butter">{o.code}</div>
                    <div className="text-sm text-fg/70">{o.customerName}</div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_COLORS[o.status]
                    }`}
                  >
                    {sl(o.status)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg/50">
                  <span className="flex items-center gap-1">
                    {o.type === 'DELIVERY' ? (
                      <MapPin className="h-3.5 w-3.5" />
                    ) : (
                      <Package className="h-3.5 w-3.5" />
                    )}
                    {tl(o.type)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(o.createdAt)}
                  </span>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-black/10 pt-4 text-sm">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex justify-between text-fg/70">
                      <span>
                        <span className="text-fg/40">{it.quantity}×</span> {it.name}
                      </span>
                      <span>{formatPrice(it.price * it.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
                  <span className="font-display text-lg font-bold">{formatPrice(o.total)}</span>
                  <div className="flex gap-2">
                    {o.status !== 'CANCELLED' && o.status !== 'COMPLETED' && (
                      <button
                        onClick={() => setStatus(o.id, 'CANCELLED')}
                        disabled={busy === o.id}
                        className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-fg/60 transition hover:bg-ember/10 hover:text-ember disabled:opacity-50"
                      >
                        {t.admin.orders.cancel}
                      </button>
                    )}
                    {NEXT[o.status] && (
                      <button
                        onClick={() => setStatus(o.id, NEXT[o.status]!)}
                        disabled={busy === o.id}
                        className="inline-flex items-center gap-1 rounded-full bg-butter px-3 py-1.5 text-xs font-semibold text-ink transition hover:scale-105 disabled:opacity-50"
                      >
                        {sl(NEXT[o.status]!)} <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
