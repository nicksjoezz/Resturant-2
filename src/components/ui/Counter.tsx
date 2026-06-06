'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts the numeric part of a value up from zero when scrolled into view,
 * preserving any prefix/suffix (e.g. "120+", "4.9★", "$48").
 */
export default function Counter({
  value,
  className,
  duration = 1500,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? '';
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, match, target, duration]);

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }
  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}
