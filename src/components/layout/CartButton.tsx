'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store/cart';
import { haptic } from '@/lib/haptics';

/** `tone` controls the icon colour: 'light' over dark hero, 'dark' over light chrome. */
export default function CartButton({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const n = mounted ? count : 0;

  return (
    <button
      onClick={() => {
        haptic('light');
        open();
      }}
      className={`relative rounded-full p-2.5 transition hover:scale-105 active:scale-95 ${
        tone === 'light' ? 'text-white hover:bg-white/10' : 'text-fg hover:bg-black/[0.06]'
      }`}
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      <AnimatePresence>
        {n > 0 && (
          <motion.span
            key={n}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[11px] font-bold text-white"
          >
            {n}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
