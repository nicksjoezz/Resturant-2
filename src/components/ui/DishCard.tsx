'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, Flame, Droplet } from 'lucide-react';
import { useRef } from 'react';
import AddToCartButton from './AddToCartButton';
import { formatPrice, localize } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';
import type { MenuItemDTO } from '@/lib/types';

const TAG_ICONS: Record<string, React.ReactNode> = {
  craft: <Clock className="h-3.5 w-3.5" />,
  oil: <Droplet className="h-3.5 w-3.5" />,
  cook: <Flame className="h-3.5 w-3.5" />,
};

function tagIcon(tag: string) {
  const lower = tag.toLowerCase();
  if (lower.includes('cook')) return TAG_ICONS.cook;
  if (lower.includes('oil')) return TAG_ICONS.oil;
  if (lower.includes('craft')) return TAG_ICONS.craft;
  return <span className="h-1.5 w-1.5 rounded-full bg-current" />;
}

/**
 * A premium dish card with a subtle 3D tilt that follows the pointer — the
 * card "lifts" toward you. Used across the landing recipe grid and the menu.
 */
export default function DishCard({ item, badge }: { item: MenuItemDTO; badge?: string }) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor={t.cursor.view}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-card p-3 shadow-sm shadow-black/[0.04] transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          style={{ transform: 'translateZ(40px)' }}
          className="h-full w-full scale-105 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-butter px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            {badge}
          </span>
        )}
        {item.spicy > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-ember/90 px-2 py-1 text-[11px] font-semibold text-white">
            {Array.from({ length: item.spicy }).map((_, i) => (
              <Flame key={i} className="h-3 w-3" />
            ))}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight">
            {localize(item.name, item.nameFr, locale)}
          </h3>
          <span className="font-display text-lg font-bold text-butter">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-fg/60">
          {localize(item.description, item.descriptionFr, locale)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg/50">
          {item.tags.slice(0, 3).map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              {tagIcon(t)}
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-fg/40">{item.cuisine}</span>
          <AddToCartButton item={item} />
        </div>
      </div>
    </motion.article>
  );
}
