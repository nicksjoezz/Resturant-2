'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/LanguageProvider';

const WORD = 'Foddo';
const DURATION = 1700; // ms to count to 100

/**
 * Branded intro: the wordmark assembles letter-by-letter over a % counter,
 * then a curtain wipes up to reveal the site. Shows once per browser session.
 */
export default function Preloader() {
  const { t } = useI18n();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Only the first visit of a session sees the intro.
    if (sessionStorage.getItem('foddo_intro') === '1') return;
    setActive(true);
    document.documentElement.classList.add('lenis-stopped');

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // ease-out for a satisfying deceleration toward 100
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem('foddo_intro', '1');
        setTimeout(() => {
          setActive(false);
          document.documentElement.classList.remove('lenis-stopped');
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
        >
          <div className="flex overflow-hidden">
            {WORD.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-6xl font-extrabold tracking-tight text-cream md:text-8xl"
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              className="ml-1 mt-2 inline-block h-3 w-3 self-end rounded-full bg-butter md:mb-3 md:h-4 md:w-4"
            />
          </div>

          {/* progress bar + counter */}
          <div className="mt-8 flex w-56 items-center gap-3 md:w-72">
            <div className="h-px flex-1 overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-butter"
                initial={{ width: '0%' }}
                animate={{ width: `${count}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>
            <span className="w-10 text-right font-display text-sm font-bold tabular-nums text-cream/70">
              {count}
            </span>
          </div>
          <span className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/30">
            {t.loading}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
