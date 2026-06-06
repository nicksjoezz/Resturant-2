import type { Metadata, Viewport } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { Toaster } from 'sonner';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppFab from '@/components/layout/WhatsAppFab';
import JsonLd from '@/components/seo/JsonLd';
import GrainOverlay from '@/components/ui/GrainOverlay';
import Preloader from '@/components/ui/Preloader';
import CustomCursor from '@/components/ui/CustomCursor';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { getLocale } from '@/i18n/server';

const display = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Foddo — Grab the Best Fine Dining',
    template: '%s · Foddo',
  },
  description:
    'An immersive 3D dining experience. Explore the menu, reserve a table and order in a few clicks. Premium food, premium feel.',
  keywords: [
    'restaurant',
    'fine dining',
    'reservations',
    'food delivery',
    'order online',
    'new york restaurant',
    '3d',
    'foddo',
  ],
  alternates: { canonical: '/' },
  authors: [{ name: 'Foddo' }],
  openGraph: {
    title: 'Foddo — Grab the Best Fine Dining',
    description: 'Immersive 3D dining experience with reservations and online ordering.',
    type: 'website',
    siteName: 'Foddo',
    url: baseUrl,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Foddo — immersive fine dining',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foddo — Grab the Best Fine Dining',
    description: 'Immersive 3D dining experience with reservations and online ordering.',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider initialLocale={locale}>
          <Preloader />
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
          <CartDrawer />
          <WhatsAppFab />
        </LanguageProvider>
        <GrainOverlay />
        <JsonLd />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(20,20,20,0.9)',
              border: '1px solid rgba(244,239,230,0.1)',
              color: '#F4EFE6',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </body>
    </html>
  );
}
