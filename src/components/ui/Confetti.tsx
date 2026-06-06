'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#F5D547', '#E8622C', '#7C3AED', '#2D7FF9', '#F4EFE6'];

/** Pure-CSS/Framer confetti burst — no extra deps. Fires once on mount. */
export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        // Deterministic-ish spread based on index so SSR/CSR match.
        left: (i * 37) % 100,
        delay: (i % 10) * 0.05,
        duration: 2.2 + ((i * 13) % 10) / 10,
        color: COLORS[i % COLORS.length],
        size: 6 + (i % 4) * 2,
        rotate: (i * 47) % 360,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
