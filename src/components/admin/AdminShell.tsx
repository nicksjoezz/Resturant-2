'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  CalendarDays,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import type { AdminSession } from '@/lib/auth';
import { useI18n } from '@/i18n/LanguageProvider';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function AdminShell({
  session,
  children,
}: {
  session: AdminSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const NAV = [
    { href: '/admin', label: t.admin.nav.dashboard, icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: t.admin.nav.orders, icon: ClipboardList },
    { href: '/admin/menu', label: t.admin.nav.menu, icon: UtensilsCrossed },
    { href: '/admin/reservations', label: t.admin.nav.reservations, icon: CalendarDays },
    { href: '/admin/messages', label: t.admin.nav.messages, icon: Mail },
    { href: '/admin/settings', label: t.admin.nav.settings, icon: Settings },
  ];

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-butter font-display text-lg font-extrabold text-ink">
          C
        </span>
        <div>
          <div className="font-display text-lg font-bold leading-none">Foddo</div>
          <div className="text-xs text-fg/40">{t.admin.console}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-butter text-ink'
                  : 'text-fg/70 hover:bg-black/[0.04] hover:text-fg'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-black/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg/70 transition hover:bg-black/[0.04]"
        >
          <ExternalLink className="h-4.5 w-4.5" /> {t.admin.nav.viewSite}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg/70 transition hover:bg-ember/10 hover:text-ember"
        >
          <LogOut className="h-4.5 w-4.5" /> {t.admin.nav.signOut}
        </button>
        <div className="flex items-center justify-between px-3 pt-3">
          <span className="text-xs text-fg/40">{session.email}</span>
          <LanguageSwitcher tone="dark" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-page text-fg">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-black/10 bg-card lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-butter font-display font-extrabold text-ink">
            C
          </span>
          <span className="font-display font-bold">Foddo Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-black/[0.06]">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-card">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1.5 hover:bg-black/[0.06]"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
