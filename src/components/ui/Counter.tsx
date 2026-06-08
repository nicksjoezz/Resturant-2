'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

  // Parse once per value. (Doing this inline made `match` a new object every
  // render, which — being in the effect deps — restarted the animation every
  // frame and froze the counter at ~3% of its target.)
  const { prefix, target, suffix, decimals, hasNumber } = useMemo(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
    if (!m) return { prefix: '', target: 0, suffix: '', decimals: 0, hasNumber: false };
    return {
      prefix: m[1] ?? '',
      target: parseFloat(m[2]),
      suffix: m[3] ?? '',
      decimals: m[2].includes('.') ? m[2].split('.')[1].length : 0,
      hasNumber: true,
    };
  }, [value]);

  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !hasNumber) return;
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
    // Only stable primitives here — never the RegExp match object.
  }, [inView, hasNumber, target, duration]);

  if (!hasNumber) {
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
