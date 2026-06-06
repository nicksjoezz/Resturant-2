'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, defaultLocale, type Locale } from './config';
import { dictionaries, type Dict } from './dictionaries';

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** The active dictionary — use as t.namespace.key */
  t: Dict;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      // Persist for both client (this state) and server (cookie → re-render).
      document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
      try {
        localStorage.setItem(LOCALE_COOKIE, l);
      } catch {
        /* ignore */
      }
      document.documentElement.lang = l;
      setLocaleState(l);
      // Re-render server components (pages that read the cookie) with the new locale.
      router.refresh();
    },
    [locale, router]
  );

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, t: dictionaries[locale] ?? dictionaries[defaultLocale] }),
    [locale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Client-side translations hook: const { t, locale, setLocale } = useI18n(); */
export function useI18n(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within <LanguageProvider>');
  return ctx;
}
