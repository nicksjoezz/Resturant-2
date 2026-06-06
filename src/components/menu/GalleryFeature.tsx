'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryCanvas from '@/components/three/GalleryCanvas';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { formatPrice, localize } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';
import type { MenuItemDTO } from '@/lib/types';

/** A standalone immersive 3D carousel used at the top of the menu page. */
export default function GalleryFeature({ items }: { items: MenuItemDTO[] }) {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <section className="relative px-4 py-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-surface to-card p-4 md:p-8">
        <div className="relative h-[360px] w-full md:h-[460px]" data-cursor={t.cursor.drag}>
          <GalleryCanvas items={items} activeIndex={active} onActiveChange={setActive} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mx-auto -mt-4 flex max-w-2xl flex-col items-center gap-3 text-center"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-butter">
              {current.cuisine} · {t.menu.dragToExplore}
            </span>
            <h3 className="font-display text-3xl font-extrabold md:text-4xl">
              {localize(current.name, current.nameFr, locale)}
            </h3>
            <p className="max-w-md text-fg/60">
              {localize(current.description, current.descriptionFr, locale)}
            </p>
            <div className="mt-2 flex items-center gap-4">
              <span className="font-display text-2xl font-extrabold text-butter">
                {formatPrice(current.price)}
              </span>
              <AddToCartButton item={current} label={t.signature.addToOrder} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
