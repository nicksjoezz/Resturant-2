'use client';

/**
 * Lightweight haptic feedback helper.
 * Uses the Web Vibration API where supported (Android/Chrome). On iOS Safari,
 * which doesn't expose navigator.vibrate, this is a no-op — so we pair it with
 * visual/audio micro-feedback elsewhere for a consistent premium feel.
 */
type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'select';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  medium: 16,
  heavy: 28,
  select: 6,
  success: [10, 40, 14],
  error: [30, 30, 30],
};

export function haptic(pattern: HapticPattern = 'light') {
  if (typeof window === 'undefined') return;
  const nav = window.navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  if (typeof nav.vibrate === 'function') {
    try {
      nav.vibrate(PATTERNS[pattern]);
    } catch {
      /* ignore — some browsers throw if not triggered by a user gesture */
    }
  }
}
