'use client';

import Link from 'next/link';
import { QrCode, Download, Printer } from 'lucide-react';
import { useI18n } from '@/i18n/LanguageProvider';

/** Admin dashboard widget: live menu QR with download + print actions. */
export default function QrWidget() {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-black/10 bg-card p-6">
      <div className="flex items-center gap-2">
        <QrCode className="h-5 w-5 text-grape" />
        <h3 className="font-display text-lg font-bold">{t.admin.dashboard.qrTitle}</h3>
      </div>
      <p className="mt-1 text-sm text-fg/50">{t.admin.dashboard.qrSubtitle}</p>

      <div className="mt-4 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/api/qr?format=svg"
          alt="Menu QR code"
          className="h-40 w-40 rounded-xl border border-black/10 bg-white p-2"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href="/api/qr?download=1"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black/[0.04] px-2 py-2 text-xs font-medium transition hover:bg-black/[0.08]"
        >
          <Download className="h-3.5 w-3.5" /> PNG
        </a>
        <a
          href="/api/qr?format=svg&download=1"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black/[0.04] px-2 py-2 text-xs font-medium transition hover:bg-black/[0.08]"
        >
          <Download className="h-3.5 w-3.5" /> SVG
        </a>
        <Link
          href="/qr-menu"
          target="_blank"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black/[0.04] px-2 py-2 text-xs font-medium transition hover:bg-black/[0.08]"
        >
          <Printer className="h-3.5 w-3.5" /> {t.admin.dashboard.cards}
        </Link>
      </div>
    </div>
  );
}
