'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import { useI18n } from '@/i18n/LanguageProvider';

export default function About() {
  const { t } = useI18n();
  const STATS = [
    { value: '38', label: t.aboutSection.stats.years },
    { value: '120+', label: t.aboutSection.stats.plates },
    { value: '4.9', label: t.aboutSection.stats.rating },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section id="about" ref={ref} className="relative bg-page px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <motion.div style={{ y: imgY }} className="absolute inset-[-12%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80"
                alt="Chef plating a dish"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
          {/* floating rotating badge */}
          <motion.div
            style={{ rotate: badgeRotate }}
            className="absolute -bottom-8 -right-4 grid h-28 w-28 place-items-center rounded-full bg-ember text-center md:h-36 md:w-36"
          >
            <div>
              <div className="font-display text-2xl font-extrabold text-white md:text-3xl">1986</div>
              <div className="text-[10px] uppercase tracking-widest text-white/80">
                {t.aboutSection.serving}
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
              {t.aboutSection.tag}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {t.aboutSection.title1} <br />
              <span className="text-fg/50">{t.aboutSection.title2}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-fg/70">
              {t.aboutSection.body}
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.3 + i * 0.1}>
                <div>
                  <Counter
                    value={s.value}
                    className="font-display text-3xl font-extrabold text-butter md:text-4xl"
                  />
                  <div className="mt-1 text-sm text-fg/60">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
