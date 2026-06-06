'use client';

import { useState } from 'react';
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminSession } from '@/lib/auth';
import { useI18n } from '@/i18n/LanguageProvider';

export default function SettingsPanel({ session }: { session: AdminSession }) {
  const { t } = useI18n();
  const s = t.admin.settings;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      toast.error(s.tMismatch);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || s.tErr);
      } else {
        toast.success(s.tUpdated);
        setForm({ currentPassword: '', newPassword: '', confirm: '' });
      }
    } catch {
      toast.error(s.tErr);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{s.title}</h1>
      <p className="mt-1 text-sm text-fg/50">{s.subtitle}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-card p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-butter" />
            <h2 className="font-display text-lg font-bold">{s.account}</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg/50">{s.name}</dt>
              <dd className="font-medium">{session.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg/50">{s.email}</dt>
              <dd className="font-medium">{session.email}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-card p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-butter" />
            <h2 className="font-display text-lg font-bold">{s.changePassword}</h2>
          </div>
          <div className="mt-4 space-y-3">
            <input className="s-input" type="password" placeholder={s.current} value={form.currentPassword} onChange={(e) => update('currentPassword', e.target.value)} />
            <input className="s-input" type="password" placeholder={s.newPass} value={form.newPassword} onChange={(e) => update('newPassword', e.target.value)} />
            <input className="s-input" type="password" placeholder={s.confirm} value={form.confirm} onChange={(e) => update('confirm', e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-4 w-full disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {s.update}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .s-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(26, 22, 17, 0.12);
          background: rgba(26, 22, 17, 0.03);
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          color: #1a1611;
          outline: none;
        }
        .s-input:focus {
          border-color: rgba(245, 213, 71, 0.7);
        }
      `}</style>
    </div>
  );
}
