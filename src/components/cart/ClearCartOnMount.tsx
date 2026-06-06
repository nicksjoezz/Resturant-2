'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';
import { haptic } from '@/lib/haptics';

/** Clears the cart once the order is confirmed (covers the Stripe redirect path). */
export default function ClearCartOnMount() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
    haptic('success');
  }, [clear]);
  return null;
}
