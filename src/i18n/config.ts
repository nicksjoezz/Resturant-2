export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Cookie that persists the chosen language (read on both server and client).
export const LOCALE_COOKIE = 'foddo_lang';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
