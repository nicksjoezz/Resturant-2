'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import CartButton from './CartButton';
import LanguageSwitcher from './LanguageSwitcher';
import Magnetic from '@/components/ui/Magnetic';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const LINKS = [
    { href: '/menu', label: t.nav.menu },
    { href: '/about', label: t.nav.about },
    { href: '/#promise', label: t.nav.ourPromise },
    { href: '/contact', label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Only the home page has a dark hero photo behind the (unscrolled) nav.
  const overHero = pathname === '/' && !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 px-4 pt-4"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            overHero ? 'bg-transparent' : 'glass shadow-lg'
          }`}
        >
          <Link href="/" className="flex items-center gap-2" onClick={() => haptic('light')}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-butter font-display text-lg font-extrabold text-ink">
              C
            </span>
            <span
              className={`font-display text-xl font-bold tracking-tight ${
                overHero ? 'text-white' : 'text-fg'
              }`}
            >
              Foddo
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  overHero
                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                    : 'text-fg/70 hover:bg-black/[0.05] hover:text-fg'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher tone={overHero ? 'light' : 'dark'} />
            </div>
            <CartButton tone={overHero ? 'light' : 'dark'} />
            <div className="hidden md:block">
              <Magnetic>
                <Link
                  href="/reservations"
                  className="btn-primary text-sm"
                  onClick={() => haptic('medium')}
                >
                  {t.nav.reserve} <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
            </div>
            <button
              className={`rounded-full p-2.5 transition md:hidden ${
                overHero ? 'text-white hover:bg-white/10' : 'text-fg hover:bg-black/[0.06]'
              }`}
              onClick={() => {
                haptic('light');
                setOpen(true);
              }}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu — a bold dark full-screen overlay (deliberate contrast) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/97 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-xl font-bold text-cream">Foddo</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-cream hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 px-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-3xl font-bold text-cream"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/reservations"
                onClick={() => setOpen(false)}
                className="btn-primary mt-6 w-full"
              >
                {t.nav.reserveTable} <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 flex justify-center">
                <LanguageSwitcher tone="light" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
