'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { MapPin, Bike, Clock, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { useI18n } from '@/i18n/LanguageProvider';

export default function DeliverySection() {
  const { t } = useI18n();
  const STEP_META = [
    { icon: MapPin, color: 'bg-grape' },
    { icon: Bike, color: 'bg-ember' },
    { icon: Clock, color: 'bg-azure' },
  ];
  const STEPS = t.delivery.steps.map((s, i) => ({ ...s, ...STEP_META[i] }));
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-azure px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-white md:text-6xl">
                {t.delivery.title1} <br /> {t.delivery.title2}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-lg text-white/80">{t.delivery.body}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/menu"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-azure transition hover:scale-105 active:scale-95"
              >
                {t.delivery.orderNow} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
              <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
                  alt="Freshly prepared meal tray"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Step cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={0.1 * i}>
              <motion.div
                whileHover={{ y: -6 }}
                className={`${s.color} group relative overflow-hidden rounded-[2rem] p-8 text-white`}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-white/80">{s.body}</p>
                <span className="pointer-events-none absolute -right-6 -top-6 font-display text-8xl font-extrabold text-white/10">
                  {i + 1}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
