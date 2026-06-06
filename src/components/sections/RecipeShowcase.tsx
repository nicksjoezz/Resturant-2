'use client';

import DishCard from '@/components/ui/DishCard';
import Reveal from '@/components/ui/Reveal';
import { useI18n } from '@/i18n/LanguageProvider';
import type { MenuItemDTO } from '@/lib/types';

/** The "Delicious food recipe" grid from the reference, powered by real data. */
export default function RecipeShowcase({ items }: { items: MenuItemDTO[] }) {
  const { t } = useI18n();
  const picks = items.slice(0, 3);
  if (!picks.length) return null;

  return (
    <section id="recipes" className="bg-page px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t.recipe.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-lg text-lg text-fg/60">{t.recipe.subtitle}</p>
        </Reveal>

        <div className="perspective mt-14 grid gap-6 md:grid-cols-3">
          {picks.map((item, i) => (
            <Reveal key={item.id} delay={0.1 * i}>
              <DishCard item={item} badge={i === 0 ? t.recipe.newDish : undefined} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
