'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptics';
import { useI18n } from '@/i18n/LanguageProvider';

export default function ContactForm() {
  const { t } = useI18n();
  const f0 = t.contact.form;
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(f0.errFields);
      haptic('error');
      return;
    }
    setLoading(true);
    haptic('medium');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      haptic('success');
      setDone(true);
    } catch {
      toast.error(f0.errGeneric);
      haptic('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-[2rem] p-6 md:p-8">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-butter/15">
              <CheckCircle2 className="h-9 w-9 text-butter" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-extrabold">{f0.sent}</h3>
            <p className="mt-2 text-fg/60">{f0.thanks.replace('{name}', form.name.split(' ')[0])}</p>
            <button onClick={() => setDone(false)} className="btn-ghost mt-6">
              {f0.another}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="space-y-4"
          >
            <h2 className="font-display text-2xl font-extrabold">{f0.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="c-input" placeholder={f0.name} value={form.name} onChange={(e) => update('name', e.target.value)} />
              <input className="c-input" type="email" placeholder={f0.email} value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <input className="c-input" placeholder={f0.subject} value={form.subject} onChange={(e) => update('subject', e.target.value)} />
            <textarea className="c-input min-h-[140px] resize-none" placeholder={f0.message} value={form.message} onChange={(e) => update('message', e.target.value)} />
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? f0.sending : f0.send}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .c-input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(26, 22, 17, 0.12);
          background: rgba(26, 22, 17, 0.03);
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          color: #1a1611;
          outline: none;
          transition: border-color 0.2s;
        }
        .c-input:focus {
          border-color: rgba(245, 213, 71, 0.7);
        }
      `}</style>
    </div>
  );
}
