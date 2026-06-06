'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import RevealWords from '@/components/ui/RevealWords';
import { useI18n } from '@/i18n/LanguageProvider';

const IMAGES = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', // market
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80', // fire
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80', // plating
];

export default function CraftStory() {
  const { t } = useI18n();
  const steps = t.craft.steps;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const fillScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    setActive(idx);
  });

  return (
    <section id="promise" ref={ref} className="relative bg-page" style={{ height: '300vh' }}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden px-4 py-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Left: text */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
              {t.craft.tag}
            </p>
            <RevealWords
              text={t.craft.title}
              className="block font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
            />
            <p className="mt-4 max-w-md text-fg/60">{t.craft.subtitle}</p>

            {/* progress + active step */}
            <div className="mt-10 flex gap-6">
              <div className="relative w-px flex-shrink-0 bg-black/10">
                <motion.div
                  style={{ scaleY: fillScaleY, originY: 0 }}
                  className="absolute inset-0 w-px bg-butter"
                />
              </div>
              <div className="relative min-h-[180px] flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="font-display text-5xl font-extrabold text-black/10">
                      {steps[active].no}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                      {steps[active].title}
                    </h3>
                    <p className="mt-3 max-w-md text-fg/70">{steps[active].body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* step dots */}
            <div className="mt-8 flex gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-8 bg-butter' : 'w-1.5 bg-black/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: crossfading images with a subtle camera push */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/10">
            {IMAGES.map((src, i) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                animate={{
                  opacity: i === active ? 1 : 0,
                  scale: i === active ? 1.04 : 1.12,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={steps[i]?.title ?? ''} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            ))}
            <div className="absolute bottom-5 left-5 rounded-full bg-white/85 px-4 py-2 font-display text-sm font-bold backdrop-blur">
              {steps[active].no} · {steps[active].title}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
