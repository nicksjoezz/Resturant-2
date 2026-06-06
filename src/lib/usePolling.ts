'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tiny data-fetching hook with interval polling — gives the admin panels their
 * "real-time" feel without pulling in a data library.
 */
export function usePolling<T>(url: string, intervalMs = 5000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOnce = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = (await res.json()) as T;
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchOnce();
    timer.current = setInterval(fetchOnce, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [fetchOnce, intervalMs]);

  return { data, loading, error, refresh: fetchOnce };
}
