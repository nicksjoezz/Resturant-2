'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * A bespoke blended cursor. On fine-pointer devices it replaces the native
 * cursor; it grows and shows a contextual label over elements that declare
 * `data-cursor="..."`, and gently enlarges over links/buttons.
 * Completely inert on touch devices.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        '[data-cursor], a, button'
      );
      if (!el) {
        setLabel('');
        setHovering(false);
        return;
      }
      const tag = el.getAttribute('data-cursor');
      setLabel(tag ?? '');
      setHovering(true);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  const big = hovering || !!label;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[150] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: label ? 76 : big ? 44 : 14,
        height: label ? 76 : big ? 44 : 14,
        backgroundColor: label ? '#F5D547' : '#F4EFE6',
        mixBlendMode: label ? 'normal' : 'difference',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {label && (
        <span className="font-display text-xs font-bold uppercase tracking-wide text-ink">
          {label}
        </span>
      )}
    </motion.div>
  );
}
