import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import About from '@/components/sections/About';
import CraftStory from '@/components/sections/CraftStory';
import SignatureDishes from '@/components/sections/SignatureDishes';
import RecipeShowcase from '@/components/sections/RecipeShowcase';
import DeliverySection from '@/components/sections/DeliverySection';
import Testimonials from '@/components/sections/Testimonials';
import CTASection from '@/components/sections/CTASection';
import { getFeaturedItems, getMenuItems } from '@/lib/data';

// Always reflect the latest menu (admin edits show up immediately).
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, all] = await Promise.all([
    getFeaturedItems(8),
    getMenuItems({ onlyAvailable: true }),
  ]);

  // Fall back to all items if not enough are flagged featured.
  const gallery = (featured.length >= 4 ? featured : all).slice(0, 8);
  const recipes = all.filter((i) => i.tags.length >= 2).slice(0, 3);

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <CraftStory />
      <SignatureDishes items={gallery} />
      <RecipeShowcase items={recipes.length >= 3 ? recipes : all.slice(0, 3)} />
      <DeliverySection />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
