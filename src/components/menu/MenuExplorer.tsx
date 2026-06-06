'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import DishCard from '@/components/ui/DishCard';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';
import type { MenuItemDTO, CategoryDTO } from '@/lib/types';

export default function MenuExplorer({
  items,
  categories,
}: {
  items: MenuItemDTO[];
  categories: CategoryDTO[];
}) {
  const { t } = useI18n();
  const [active, setActive] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesCat = active === 'all' || i.categorySlug === active;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.nameFr.toLowerCase().includes(q) ||
        i.descriptionFr.toLowerCase().includes(q) ||
        i.cuisine.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [items, active, query]);

  const tabs = [{ id: 'all', name: t.menu.all, slug: 'all' }, ...categories];

  return (
    <div>
      {/* Search + filter bar */}
      <div className="sticky top-20 z-30 -mx-4 mb-10 bg-page/80 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full rounded-full border border-black/10 bg-black/[0.04] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-butter/50"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => {
                  haptic('select');
                  setActive(tab.slug);
                }}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  active === tab.slug ? 'text-ink' : 'text-fg/70 hover:text-fg'
                }`}
              >
                {active === tab.slug && (
                  <motion.span
                    layoutId="menu-tab"
                    className="absolute inset-0 rounded-full bg-butter"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-sm text-fg/50">
          {filtered.length} {filtered.length === 1 ? t.menu.dish : t.menu.dishes}
        </p>
        <motion.div layout className="perspective grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <DishCard item={item} badge={item.featured ? t.menu.signature : undefined} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-fg/50">
            <p className="font-display text-2xl">{t.menu.noDishes}</p>
            <p className="mt-2">{t.menu.noDishesSub}</p>
          </div>
        )}
      </div>
    </div>
  );
}
