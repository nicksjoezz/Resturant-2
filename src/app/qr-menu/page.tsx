import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { getT } from '@/i18n/server';
import PrintButton from '@/components/qr/PrintButton';

export const metadata: Metadata = {
  title: 'Table QR Cards — Foddo',
  robots: { index: false, follow: false },
};

// Four print-ready cards per A4 sheet. Cut, laminate, place on tables.
export default function QrMenuPage() {
  const t = getT();
  const cards = [0, 1, 2, 3];

  return (
    <main className="min-h-screen bg-page px-4 py-10">
      {/* Screen-only toolbar */}
      <div className="mx-auto mb-8 flex max-w-4xl flex-col items-center gap-3 text-center print:hidden">
        <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          {t.qr.title}
        </h1>
        <p className="max-w-md text-fg/60">{t.qr.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <PrintButton label={t.qr.print} />
          <a href="/api/qr?format=svg&download=1" className="btn-ghost text-sm">
            {t.qr.downloadSvg}
          </a>
          <a href="/api/qr?download=1" className="btn-ghost text-sm">
            {t.qr.downloadPng}
          </a>
        </div>
      </div>

      {/* Printable grid */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2 print:gap-4">
        {cards.map((i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-black/20 bg-white p-8 text-center"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-butter font-display text-lg font-extrabold text-ink">
                C
              </span>
              <span className="font-display text-2xl font-bold">Foddo</span>
            </div>
            <p className="mt-2 text-sm font-medium text-fg/60">{t.qr.scanToView}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/qr?format=svg"
              alt="Scan for the Foddo menu"
              className="my-5 h-44 w-44"
            />
            <p className="font-display text-lg font-bold">{t.qr.bonAppetit}</p>
            <p className="mt-1 text-xs text-fg/40">{siteConfig.address}</p>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          @page { margin: 12mm; }
          body { background: #fff !important; }
        }
      `}</style>
    </main>
  );
}
