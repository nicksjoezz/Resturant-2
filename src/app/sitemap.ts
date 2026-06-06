import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const routes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/menu', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/reservations', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
