'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import RevealWords from '@/components/ui/RevealWords';
import { useI18n } from '@/i18n/LanguageProvider';

const META = [
  { rating: 4.9, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { rating: 5.0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { rating: 4.8, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
];

export default function Testimonials() {
  const { t } = useI18n();
  const REVIEWS = t.testimonials.reviews.map((r, i) => ({ ...r, ...META[i] }));
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-24 text-ink md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <RevealWords
            text={t.testimonials.title}
            className="block text-center font-display text-4xl font-extrabold tracking-tight md:text-6xl"
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={0.1 * i}>
              <motion.div
                whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
                className="relative flex h-full flex-col rounded-[2rem] bg-white p-8 shadow-lg shadow-black/5"
              >
                <Quote className="h-10 w-10 fill-butter text-butter" />
                <p className="mt-4 flex-1 text-lg leading-relaxed text-ink/80">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-display font-bold">{r.name}</div>
                    <div className="text-sm text-ink/50">{r.role}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-butter">
                    {r.rating} <Star className="h-3.5 w-3.5 fill-butter" />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
