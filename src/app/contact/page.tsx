import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Star, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';
import Faq from '@/components/contact/Faq';
import Reveal from '@/components/ui/Reveal';
import { siteConfig, integrations } from '@/lib/config';
import { getT } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = getT();
  return {
    title: t.contact.metaTitle,
    description:
      'Get in touch with Foddo. Find our address, opening hours, phone and a map. Questions about menus, delivery, dietary needs or private events? Message us.',
    alternates: { canonical: '/contact' },
  };
}

const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteConfig.address
)}`;

export default function ContactPage() {
  const t = getT();
  const DETAILS = [
    { icon: MapPin, label: t.contact.visitUs, value: siteConfig.address },
    { icon: Phone, label: t.contact.call, value: siteConfig.phone },
    { icon: Mail, label: t.contact.email, value: siteConfig.email },
    { icon: Clock, label: t.contact.open, value: t.contact.openValue },
  ];
  return (
    <main className="min-h-screen bg-page">
      <Navbar />

      <section className="px-4 pt-32 pb-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
            {t.contact.tag}
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            {t.contact.title1} <br />
            <span className="text-fg/40">{t.contact.title2}</span>
          </h1>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: details + map */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {DETAILS.map((d, i) => (
                <Reveal key={d.label} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-black/10 bg-card p-5">
                    <d.icon className="h-5 w-5 text-butter" />
                    <div className="mt-3 text-xs uppercase tracking-wider text-fg/40">{d.label}</div>
                    <div className="mt-1 font-medium leading-snug">{d.value}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[2rem] border border-black/10">
                {integrations.mapsEmbed ? (
                  <iframe
                    title="Foddo location"
                    src={integrations.mapsEmbed}
                    className="h-[300px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="grid h-[300px] place-items-center bg-surface text-center text-fg/50">
                    <div className="px-6">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-butter" />
                      {t.contact.mapSetup}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            <div className="flex flex-wrap gap-3">
              <a href={mapsSearch} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
                <MapPin className="h-4 w-4" /> {t.contact.findUsMaps} <ArrowUpRight className="h-4 w-4" />
              </a>
              {integrations.reviewUrl && (
                <a
                  href={integrations.reviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-sm"
                >
                  <Star className="h-4 w-4 fill-butter text-butter" /> {t.contact.leaveReview}
                </a>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-extrabold tracking-tight md:text-5xl">
              {t.contact.faqTitle}
            </h2>
          </Reveal>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
