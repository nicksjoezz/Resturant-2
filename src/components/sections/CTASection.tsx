'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';

export default function CTASection() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-page px-4 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-ember via-grape to-azure p-10 text-center md:p-20">
          {/* animated grain / glow */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-butter/40 blur-3xl"
          />
          <Reveal>
            <h2 className="relative font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              {t.cta.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">{t.cta.body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Link
                  href="/reservations"
                  onClick={() => haptic('medium')}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-cream transition hover:scale-105 active:scale-95"
                >
                  {t.cta.reserveTable} <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Link
                href="/menu"
                onClick={() => haptic('light')}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
              >
                {t.cta.orderOnline}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
