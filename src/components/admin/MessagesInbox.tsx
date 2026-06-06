'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { usePolling } from '@/lib/usePolling';
import { formatDate } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesInbox() {
  const { t } = useI18n();
  const mt = t.admin.messages;
  const { data, loading, refresh } = usePolling<{ messages: Message[]; unread: number }>(
    '/api/admin/messages',
    8000
  );
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleRead(m: Message) {
    setBusy(m.id);
    try {
      await fetch(`/api/admin/messages/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !m.read }),
      });
      await refresh();
    } catch {
      toast.error(mt.updateErr);
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm(mt.deleteConfirm)) return;
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      toast.success(mt.deleted);
      await refresh();
    } catch {
      toast.error(mt.deleteErr);
    }
  }

  const messages = data?.messages ?? [];

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{mt.title}</h1>
        {data && data.unread > 0 && (
          <span className="rounded-full bg-ember px-2.5 py-1 text-xs font-bold text-white">
            {data.unread} {mt.new}
          </span>
        )}
      </div>

      {loading && !data ? (
        <div className="py-20 text-center text-fg/50">{mt.loading}</div>
      ) : messages.length === 0 ? (
        <div className="py-20 text-center text-fg/50">
          <Inbox className="mx-auto mb-3 h-10 w-10 opacity-40" />
          {mt.none}
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              className={`rounded-2xl border p-5 transition ${
                m.read ? 'border-black/10 bg-card' : 'border-butter/40 bg-butter/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold">{m.name}</span>
                    {!m.read && <span className="h-2 w-2 rounded-full bg-ember" />}
                    <a href={`mailto:${m.email}`} className="text-sm text-fg/50 hover:text-fg">
                      {m.email}
                    </a>
                  </div>
                  {m.subject && <div className="mt-0.5 text-sm font-medium text-fg/70">{m.subject}</div>}
                  <p className="mt-2 text-sm text-fg/70">{m.message}</p>
                  <div className="mt-2 text-xs text-fg/40">{formatDate(m.createdAt)}</div>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    title={m.read ? mt.markUnread : mt.markRead}
                    onClick={() => toggleRead(m)}
                    disabled={busy === m.id}
                    className="rounded-lg p-2 text-fg/60 transition hover:bg-black/[0.06]"
                  >
                    {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </button>
                  <button
                    title="Delete"
                    onClick={() => remove(m.id)}
                    className="rounded-lg p-2 text-fg/50 transition hover:bg-ember/10 hover:text-ember"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
