'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';
import type { OrderType } from '@/lib/types';

export default function CartDrawer() {
  const { t } = useI18n();
  const ORDER_TYPES: { value: OrderType; label: string }[] = [
    { value: 'DELIVERY', label: t.cart.delivery },
    { value: 'PICKUP', label: t.cart.pickup },
    { value: 'DINE_IN', label: t.cart.dineIn },
  ];
  const router = useRouter();
  const {
    lines,
    isOpen,
    close,
    increment,
    decrement,
    remove,
    orderType,
    setOrderType,
    subtotal,
    deliveryFee,
    tax,
    total,
    count,
  } = useCart();

  // Avoid hydration mismatch from persisted localStorage state.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) document.documentElement.classList.add('lenis-stopped');
    else document.documentElement.classList.remove('lenis-stopped');
    return () => document.documentElement.classList.remove('lenis-stopped');
  }, [isOpen]);

  const items = mounted ? lines : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-butter" />
                <h2 className="font-display text-lg font-bold">{t.cart.yourOrder}</h2>
                <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-xs">{count()}</span>
              </div>
              <button
                onClick={() => {
                  haptic('light');
                  close();
                }}
                className="rounded-full p-2 transition hover:bg-black/[0.06]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Order type segmented control */}
            <div className="flex gap-2 px-6 py-4">
              {ORDER_TYPES.map((ot) => (
                <button
                  key={ot.value}
                  onClick={() => {
                    haptic('select');
                    setOrderType(ot.value);
                  }}
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                    orderType === ot.value
                      ? 'bg-butter text-ink'
                      : 'bg-black/[0.04] text-fg/70 hover:bg-black/[0.06]'
                  }`}
                >
                  {ot.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 no-scrollbar" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-fg/50">
                  <ShoppingBag className="mb-4 h-12 w-12 opacity-40" />
                  <p className="font-medium">{t.cart.empty}</p>
                  <p className="mt-1 text-sm">{t.cart.emptySub}</p>
                  <button
                    onClick={() => {
                      close();
                      router.push('/menu');
                    }}
                    className="btn-primary mt-6"
                  >
                    {t.cart.browseMenu}
                  </button>
                </div>
              ) : (
                <ul className="space-y-4 py-2">
                  <AnimatePresence initial={false}>
                    {items.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={line.image}
                          alt={line.name}
                          className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-tight">{line.name}</h3>
                            <button
                              onClick={() => {
                                haptic('medium');
                                remove(line.id);
                              }}
                              className="text-fg/40 transition hover:text-ember"
                              aria-label={`Remove ${line.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-sm text-butter">{formatPrice(line.price)}</span>
                          <div className="mt-auto flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-full bg-black/[0.04] p-1">
                              <button
                                onClick={() => {
                                  haptic('light');
                                  decrement(line.id);
                                }}
                                className="rounded-full p-1.5 transition hover:bg-black/[0.06]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-5 text-center text-sm font-medium">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  haptic('light');
                                  increment(line.id);
                                }}
                                className="rounded-full p-1.5 transition hover:bg-black/[0.06]"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="ml-auto text-sm font-semibold">
                              {formatPrice(line.price * line.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-black/10 px-6 py-5">
                <div className="space-y-1.5 text-sm">
                  <Row label={t.cart.subtotal} value={formatPrice(subtotal())} />
                  {orderType === 'DELIVERY' && (
                    <Row label={t.cart.deliveryFee} value={formatPrice(deliveryFee())} />
                  )}
                  <Row label={t.cart.tax} value={formatPrice(tax())} />
                  <div className="my-2 h-px bg-black/[0.06]" />
                  <Row label={t.cart.total} value={formatPrice(total())} bold />
                </div>
                <button
                  onClick={() => {
                    haptic('success');
                    close();
                    router.push('/checkout');
                  }}
                  className="btn-primary mt-4 w-full"
                >
                  {t.cart.checkout} · {formatPrice(total())}
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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
