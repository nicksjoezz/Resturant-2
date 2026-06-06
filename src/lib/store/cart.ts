'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DELIVERY_FEE, TAX_RATE } from '@/lib/utils';
import type { OrderType } from '@/lib/types';

export type CartLine = {
  id: string; // menu item id
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  orderType: OrderType;
  // actions
  add: (item: Omit<CartLine, 'quantity'>, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOrderType: (t: OrderType) => void;
  // derived
  count: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  tax: () => number;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      orderType: 'DELIVERY',

      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.id === item.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === item.id ? { ...l, quantity: l.quantity + qty } : l
              ),
            };
          }
          return { lines: [...state.lines, { ...item, quantity: qty }] };
        }),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      setQuantity: (id, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.id !== id)
              : s.lines.map((l) => (l.id === id ? { ...l, quantity: qty } : l)),
        })),

      increment: (id) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.id === id ? { ...l, quantity: l.quantity + 1 } : l
          ),
        })),

      decrement: (id) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.id === id ? { ...l, quantity: l.quantity - 1 } : l))
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setOrderType: (t) => set({ orderType: t }),

      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () => get().lines.reduce((s, l) => s + l.price * l.quantity, 0),
      deliveryFee: () => (get().orderType === 'DELIVERY' ? DELIVERY_FEE : 0),
      tax: () => +(get().subtotal() * TAX_RATE).toFixed(2),
      total: () => {
        const s = get();
        return +(s.subtotal() + s.deliveryFee() + s.tax()).toFixed(2);
      },
    }),
    { name: 'foddo-cart', partialize: (s) => ({ lines: s.lines, orderType: s.orderType }) }
  )
);
