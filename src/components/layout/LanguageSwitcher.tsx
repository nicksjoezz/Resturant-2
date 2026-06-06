'use client';

import { Globe } from 'lucide-react';
import { locales, type Locale } from '@/i18n/config';
import { useI18n } from '@/i18n/LanguageProvider';
import { haptic } from '@/lib/haptics';

/** Compact EN / FR toggle. `tone` matches the surrounding nav (over hero vs light). */
export default function LanguageSwitcher({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const { locale, setLocale } = useI18n();

  const base =
    tone === 'light'
      ? 'border-white/30 text-white/90'
      : 'border-black/15 text-fg/70';

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border p-0.5 ${base}`}
      role="group"
      aria-label="Language"
    >
      <Globe className="ml-1.5 h-3.5 w-3.5 opacity-60" />
      {locales.map((l: Locale) => (
        <button
          key={l}
          onClick={() => {
            haptic('select');
            setLocale(l);
          }}
          aria-pressed={locale === l}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition ${
            locale === l
              ? 'bg-butter text-ink'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
