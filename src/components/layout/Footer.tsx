'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/i18n/LanguageProvider';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer id="contact" className="relative overflow-hidden bg-ink px-4 pb-10 pt-24">
      {/* giant ghost wordmark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center">
        <span className="text-stroke font-display text-[22vw] font-extrabold leading-none opacity-[0.06]">
          Foddo
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-butter font-display text-lg font-extrabold text-ink">
                C
              </span>
              <span className="font-display text-2xl font-bold">Foddo</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-cream/60">{t.footer.tagline}</p>
          </div>

          <FooterCol
            title={t.footer.explore}
            links={[
              { label: t.footer.menu, href: '/menu' },
              { label: t.footer.reservations, href: '/reservations' },
              { label: t.footer.ourPromise, href: '/#promise' },
              { label: t.footer.signatureDishes, href: '/#dishes' },
            ]}
          />
          <FooterCol
            title={t.footer.company}
            links={[
              { label: t.footer.about, href: '/about' },
              { label: t.footer.contactLink, href: '/contact' },
              { label: t.footer.qrCards, href: '/qr-menu' },
              { label: t.footer.admin, href: '/admin' },
            ]}
          />

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-cream/50">
              {t.footer.contact}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-butter" />
                250 Hawtown Road, New York
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-butter" />
                6666 9999 0000
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-butter" />
                hello@foddo.digital
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Foddo — {t.footer.rights}</p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'YouTube'].map((s) => (
              <a
                key={s}
                href="#"
                className="flex items-center gap-1 transition hover:text-cream"
              >
                {s} <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-widest text-cream/50">
        {title}
      </h4>
      <ul className="mt-4 space-y-3 text-sm text-cream/70">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition hover:text-butter">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
