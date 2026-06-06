import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Pick the French text when the locale is French and a translation exists. */
export function localize(en: string, fr: string | undefined, locale: string) {
  return locale === 'fr' && fr ? fr : en;
}

/** Split the comma-separated tags column into an array. */
export function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Generate a short, human-friendly order code like "FD-7Q2K". */
export function makeOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) {
    // Math.random is fine here — codes are not security-sensitive (uniqueness is enforced by the DB).
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FD-${s}`;
}

export const DELIVERY_FEE = 4.5;
export const TAX_RATE = 0.08;

export function computeTotals(subtotal: number, type: 'DELIVERY' | 'PICKUP' | 'DINE_IN') {
  const deliveryFee = type === 'DELIVERY' ? DELIVERY_FEE : 0;
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + deliveryFee + tax).toFixed(2);
  return { deliveryFee, tax, total };
}
