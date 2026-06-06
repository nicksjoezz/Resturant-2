import en, { type Dict } from './en';
import fr from './fr';
import type { Locale } from './config';

export const dictionaries: Record<Locale, Dict> = { en, fr };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}

export type { Dict };
