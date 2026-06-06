import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Flame, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import { getT } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = getT();
  return {
    title: t.about.metaTitle,
    description:
      'Since 1986, Foddo has blended world cuisine with a modern, immersive dining experience. Meet our chefs and discover the philosophy behind every plate.',
    alternates: { canonical: '/about' },
  };
}

const VALUE_ICONS = [Leaf, Flame, HeartHandshake, Sparkles];
const TEAM_IMG = [
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583394293214-28a5b42f7a17?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=600&q=80',
];

const GALLERY = [
  'photo-1517248135467-4c7edcad34c4',
  'photo-1559339352-11d035aa65de',
  'photo-1414235077428-338989a2e8c0',
  'photo-1424847651672-bf20a4b0982b',
  'photo-1552566626-52f8b828add9',
  'photo-1466978913421-dad2ebd01d17',
];
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export default function AboutPage() {
  const t = getT();
  const STATS = t.about.stats;
  const VALUES = t.about.values.map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));
  const TEAM = t.about.team.map((member, i) => ({ ...member, img: TEAM_IMG[i] }));
  return (
    <main className="min-h-screen bg-page">
      <Navbar />

      {/* Heading */}
      <section className="px-4 pt-32 pb-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
            {t.about.tag}
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            {t.about.title1} <br />
            <span className="text-fg/40">{t.about.title2}</span>
          </h1>
        </div>
      </section>

      {/* Story + image */}
      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-[2.5rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img('photo-1559339352-11d035aa65de', 1200)}
                alt="Chefs at work in the Foddo kitchen"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="space-y-6">
            <Reveal>
              <p className="text-lg leading-relaxed text-fg/70">{t.about.story1}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-fg/70">{t.about.story2}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/menu" className="btn-primary">
                {t.about.exploreMenu} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 rounded-[2.5rem] bg-ink px-6 py-12 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center">
                <Counter
                  value={s.value}
                  className="font-display text-4xl font-extrabold text-butter md:text-5xl"
                />
                <div className="mt-2 text-sm text-cream/60">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {t.about.valuesTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-[1.75rem] border border-black/[0.06] bg-card p-7 shadow-sm shadow-black/[0.04]">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-butter/15">
                    <v.icon className="h-6 w-6 text-ember" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-fg/60">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {t.about.teamTitle}
            </h2>
            <p className="mt-3 max-w-md text-fg/60">{t.about.teamSubtitle}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <div className="group overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-card">
                  <div className="aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-butter">{member.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {t.about.galleryTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((id, i) => (
              <Reveal key={id} delay={(i % 3) * 0.08}>
                <div
                  className={`overflow-hidden rounded-[1.5rem] ${
                    i % 5 === 0 ? 'row-span-2' : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(id)}
                    alt="Foddo dining moments"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
