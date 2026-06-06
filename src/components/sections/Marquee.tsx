'use client';

import { Star } from 'lucide-react';
import { useI18n } from '@/i18n/LanguageProvider';

export default function Marquee() {
  const { t } = useI18n();
  const WORDS = t.marquee;
  return (
    <div className="border-y border-black/10 bg-card py-5">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8">
          {[...WORDS, ...WORDS].map((w, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="whitespace-nowrap font-display text-2xl font-bold text-fg/70">
                {w}
              </span>
              <Star className="h-4 w-4 fill-butter text-butter" />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8" aria-hidden>
          {[...WORDS, ...WORDS].map((w, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="whitespace-nowrap font-display text-2xl font-bold text-fg/70">
                {w}
              </span>
              <Star className="h-4 w-4 fill-butter text-butter" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
