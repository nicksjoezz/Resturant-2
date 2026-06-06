import 'server-only';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from './config';
import { getDictionary } from './dictionaries';

/** Read the active locale from the cookie (server components). */
export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Convenience: the dictionary for the current server request. */
export function getT() {
  return getDictionary(getLocale());
}
