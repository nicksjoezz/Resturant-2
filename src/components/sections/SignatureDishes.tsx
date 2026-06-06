'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Flame } from 'lucide-react';
import GalleryCanvas from '@/components/three/GalleryCanvas';
import AddToCartButton from '@/components/ui/AddToCartButton';
import Reveal from '@/components/ui/Reveal';
import { formatPrice, localize } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';
import type { MenuItemDTO } from '@/lib/types';

export default function SignatureDishes({ items }: { items: MenuItemDTO[] }) {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(0);
  const current = items[active];

  if (!items.length) return null;

  return (
    <section id="dishes" className="relative overflow-hidden bg-card px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
                {t.signature.tag}
              </p>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                {t.signature.title}
              </h2>
              <p className="mt-3 max-w-md text-fg/60">{t.signature.subtitle}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/menu" className="btn-ghost">
              {t.signature.fullMenu} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Interactive 3D coverflow */}
          <div className="relative h-[420px] w-full md:h-[520px]" data-cursor={t.cursor.drag}>
            <GalleryCanvas
              items={items}
              activeIndex={active}
              onActiveChange={setActive}
            />
            {/* dot navigation */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show dish ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-6 bg-butter' : 'w-1.5 bg-black/20 hover:bg-black/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active dish detail */}
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-[2rem] p-8"
              >
                <span className="text-sm font-medium uppercase tracking-widest text-butter">
                  {current.cuisine}
                </span>
                <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight">
                  {localize(current.name, current.nameFr, locale)}
                </h3>
                <p className="mt-3 text-fg/70">
                  {localize(current.description, current.descriptionFr, locale)}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-fg/60">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-butter" /> {current.prepMinutes} {t.signature.min}
                  </span>
                  {current.spicy > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-ember" /> {t.signature.heat} {current.spicy}/3
                    </span>
                  )}
                  {current.calories > 0 && (
                    <span>
                      {current.calories} {t.signature.kcal}
                    </span>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="font-display text-3xl font-extrabold text-butter">
                    {formatPrice(current.price)}
                  </span>
                  <AddToCartButton item={current} label={t.signature.addToOrder} className="px-5 py-2.5" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
