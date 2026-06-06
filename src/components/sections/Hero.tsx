'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroCanvas from '@/components/three/HeroCanvas';
import Magnetic from '@/components/ui/Magnetic';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';

export default function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '120%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden px-3 pt-3">
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.75rem]">
        {/* Background dining image with parallax */}
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80"
            alt="Friends sharing a warm dinner around a table"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink/80"
        />

        {/* 3D floating scene layered over the photo */}
        <div className="absolute inset-0 opacity-90 mix-blend-screen">
          <HeroCanvas />
        </div>

        {/* Headline */}
        <motion.div
          style={{ y: headlineY }}
          className="absolute left-6 top-24 z-10 max-w-2xl md:left-12 md:top-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur-md"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-butter" />
            {t.hero.badge}
          </motion.p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <Line delay={0.4}>{t.hero.grabTheBest}</Line>
            <Line delay={0.55}>
              {t.hero.fine}{' '}
              <span className="relative inline-block text-butter">
                {t.hero.dining}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <motion.path
                    d="M2 8 C50 2, 150 2, 198 8"
                    stroke="#F5D547"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                </svg>
              </span>.
            </Line>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link href="/menu" className="btn-primary" onClick={() => haptic('medium')}>
                {t.hero.discoverNow} <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Link
              href="/reservations"
              onClick={() => haptic('light')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
            >
              {t.hero.reserveTable}
            </Link>
          </motion.div>
        </motion.div>

        {/* Social icons */}
        <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {['TW', 'FB', 'YT'].map((s, i) => (
            <motion.a
              key={s}
              href="#"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-xs font-semibold text-white/80 transition hover:border-butter hover:text-butter"
            >
              {s}
            </motion.a>
          ))}
        </div>

        {/* Giant ghost wordmark */}
        <motion.div
          style={{ y: wordY, opacity: wordOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] select-none text-center"
        >
          <span className="hero-word font-display text-[20vw] font-extrabold leading-[0.8] tracking-tight">
            {t.hero.bigWord}
          </span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="h-1.5 w-1.5 rounded-full bg-cream"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
