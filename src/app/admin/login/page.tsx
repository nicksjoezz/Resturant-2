'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/LanguageProvider';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const L = t.admin.login;
  const [email, setEmail] = useState('admin@foddo.dev');
  const [password, setPassword] = useState('foddo-admin');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || L.failed);
        setLoading(false);
        return;
      }
      toast.success(`${L.welcome} ${data.name}`);
      router.push('/admin');
      router.refresh();
    } catch {
      toast.error(L.error);
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-page px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-grape/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-ember/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative w-full max-w-md rounded-[2rem] p-8"
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-fg/50 transition hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> {L.backToSite}
        </Link>

        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-butter font-display text-lg font-extrabold text-ink">
            C
          </span>
          <span className="font-display text-2xl font-bold">{L.title}</span>
        </div>
        <p className="mt-2 text-sm text-fg/50">{L.subtitle}</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-fg/70">{L.email}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-black/[0.04] px-4 py-3 text-sm outline-none transition focus:border-butter/50"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-fg/70">{L.password}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-black/[0.04] px-4 py-3 text-sm outline-none transition focus:border-butter/50"
            />
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {L.signingIn}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> {L.signIn}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <LanguageSwitcher tone="dark" />
        </div>

        <p className="mt-4 rounded-xl bg-black/[0.04] p-3 text-center text-xs text-fg/40">
          {L.demoNote}
        </p>
      </motion.div>
    </main>
  );
}
