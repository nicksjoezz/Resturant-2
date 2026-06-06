import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MenuExplorer from '@/components/menu/MenuExplorer';
import GalleryFeature from '@/components/menu/GalleryFeature';
import { getMenuItems, getCategories } from '@/lib/data';
import { getT } from '@/i18n/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Menu — Foddo',
  description: 'Explore our full menu of signature dishes, world cuisines, desserts and drinks.',
};

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    getMenuItems({ onlyAvailable: true }),
    getCategories(),
  ]);

  const featured = items.filter((i) => i.featured).slice(0, 8);
  const t = getT();

  return (
    <main className="relative min-h-screen bg-page">
      <Navbar />

      {/* Header */}
      <section className="px-4 pt-32 pb-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
            {t.menu.tag}
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            {t.menu.title1} <br />
            <span className="text-fg/50">{t.menu.title2}</span>
          </h1>
        </div>
      </section>

      {/* Interactive 3D feature carousel */}
      {featured.length >= 4 && <GalleryFeature items={featured} />}

      {/* Full filterable menu */}
      <section className="px-4 pb-24">
        <MenuExplorer items={items} categories={categories} />
      </section>

      <Footer />
    </main>
  );
}
