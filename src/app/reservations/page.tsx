'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck,
  Users,
  Clock,
  PartyPopper,
  Loader2,
  CheckCircle2,
  PenLine,
  MessageCircle,
  CalendarClock,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { haptic } from '@/lib/haptics';
import { integrations, whatsappLink } from '@/lib/config';
import { useI18n } from '@/i18n/LanguageProvider';
import type { Dict } from '@/i18n/dictionaries';

const TIMES = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

type BookingMethod = 'form' | 'whatsapp' | 'calendly';

export default function ReservationsPage() {
  const { t } = useI18n();
  const OCCASIONS = t.reservations.occasions;
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState<BookingMethod>('form');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    partySize: 2,
    date: '',
    time: '19:00',
    occasion: OCCASIONS[0],
    notes: '',
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    if (!form.name || !form.email || !form.date || !form.time) {
      toast.error(t.reservations.errFields);
      haptic('error');
      return;
    }
    setLoading(true);
    haptic('medium');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t.reservations.errBook);
        haptic('error');
      } else {
        haptic('success');
        setDone(true);
      }
    } catch {
      toast.error(t.reservations.errGeneric);
      haptic('error');
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-page">
      <Navbar />

      <section className="relative px-4 pt-32 pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Left: copy + image */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-butter">
              {t.reservations.tag}
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
              {t.reservations.title1} <br />
              <span className="text-fg/50">{t.reservations.title2}</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-fg/60">{t.reservations.body}</p>

            <div className="mt-8 overflow-hidden rounded-[2rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                alt="Elegant restaurant interior"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>

          {/* Right: booking */}
          <div className="relative">
            {!done && (
              <div className="mb-4 flex gap-2 rounded-full bg-black/[0.04] p-1.5">
                {(
                  [
                    { id: 'form', label: t.reservations.tabForm, icon: PenLine },
                    { id: 'whatsapp', label: t.reservations.tabWhatsapp, icon: MessageCircle },
                    { id: 'calendly', label: t.reservations.tabCalendly, icon: CalendarClock },
                  ] as { id: BookingMethod; label: string; icon: typeof PenLine }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      haptic('select');
                      setMethod(tab.id);
                    }}
                    className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                      method === tab.id ? 'text-ink' : 'text-fg/60 hover:text-fg'
                    }`}
                  >
                    {method === tab.id && (
                      <motion.span
                        layoutId="booking-tab"
                        className="absolute inset-0 rounded-full bg-butter"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      <tab.icon className="h-4 w-4" /> {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass flex flex-col items-center rounded-[2rem] p-10 text-center"
                >
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-butter/15">
                    <CheckCircle2 className="h-11 w-11 text-butter" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-extrabold">
                    {t.reservations.tableRequested}
                  </h2>
                  <p className="mt-3 text-fg/60">
                    {t.reservations.thanksLead} {form.name.split(' ')[0]}.{' '}
                    {t.reservations.thanksBody
                      .replace('{email}', form.email)
                      .replace('{size}', String(form.partySize))
                      .replace('{date}', form.date)
                      .replace('{time}', form.time)}
                  </p>
                  <button
                    onClick={() => {
                      setDone(false);
                      setForm((f) => ({ ...f, notes: '' }));
                    }}
                    className="btn-ghost mt-8"
                  >
                    {t.reservations.makeAnother}
                  </button>
                </motion.div>
              ) : method === 'whatsapp' ? (
                <WhatsAppBooking key="whatsapp" form={form} update={update} />
              ) : method === 'calendly' ? (
                <CalendlyBooking key="calendly" />
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-[2rem] p-6 md:p-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t.reservations.fullName} required>
                      <input className="res-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={t.reservations.namePlaceholder} />
                    </Field>
                    <Field label={t.reservations.email} required>
                      <input className="res-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder={t.reservations.emailPlaceholder} />
                    </Field>
                    <Field label={t.reservations.phone}>
                      <input className="res-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder={t.reservations.phonePlaceholder} />
                    </Field>
                    <Field label={t.reservations.partySize} icon={<Users className="h-4 w-4" />}>
                      <select className="res-input" value={form.partySize} onChange={(e) => update('partySize', Number(e.target.value))}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? t.reservations.guest : t.reservations.guests}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t.reservations.date} required icon={<CalendarCheck className="h-4 w-4" />}>
                      <input className="res-input" type="date" min={today} value={form.date} onChange={(e) => update('date', e.target.value)} />
                    </Field>
                    <Field label={t.reservations.time} required icon={<Clock className="h-4 w-4" />}>
                      <select className="res-input" value={form.time} onChange={(e) => update('time', e.target.value)}>
                        {TIMES.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4">
                    <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-fg/70">
                      <PartyPopper className="h-4 w-4" /> {t.reservations.occasion}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {OCCASIONS.map((o) => (
                        <button
                          key={o}
                          onClick={() => {
                            haptic('select');
                            update('occasion', o);
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            form.occasion === o
                              ? 'bg-butter text-ink'
                              : 'bg-black/[0.04] text-fg/70 hover:bg-black/[0.06]'
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Field label={t.reservations.specialRequests}>
                      <textarea className="res-input min-h-[80px] resize-none" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder={t.reservations.requestsPlaceholder} />
                    </Field>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={submit}
                    disabled={loading}
                    className="btn-primary mt-6 w-full disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> {t.reservations.booking}
                      </>
                    ) : (
                      t.reservations.requestTable
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .res-input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(26, 22, 17, 0.12);
          background: rgba(26, 22, 17, 0.03);
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          color: #1a1611;
          outline: none;
          transition: border-color 0.2s;
        }
        .res-input:focus {
          border-color: rgba(245, 213, 71, 0.5);
        }
        .res-input option {
          background: #ffffff;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-fg/70">
        {icon}
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {children}
    </label>
  );
}

type ResForm = {
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  occasion: string;
  notes: string;
};

function WhatsAppBooking({
  form,
  update,
}: {
  form: ResForm;
  update: <K extends keyof ResForm>(k: K, v: ResForm[K]) => void;
}) {
  const { t } = useI18n();
  const r = t.reservations;
  const today = new Date().toISOString().slice(0, 10);
  const message = `${r.wa.message}
${r.fullName}: ${form.name || '—'}
${r.partySize}: ${form.partySize}
${r.date}: ${form.date || '—'} · ${form.time}
${r.occasion}: ${form.occasion}`;
  const link = whatsappLink(message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2rem] p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-[#1Fa855]">
        <MessageCircle className="h-5 w-5" />
        <h2 className="font-display text-lg font-bold text-fg">{r.wa.title}</h2>
      </div>
      <p className="mt-2 text-sm text-fg/60">{r.wa.body}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={r.fullName}>
          <input className="res-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={r.namePlaceholder} />
        </Field>
        <Field label={r.partySize} icon={<Users className="h-4 w-4" />}>
          <select className="res-input" value={form.partySize} onChange={(e) => update('partySize', Number(e.target.value))}>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? r.guest : r.guests}
              </option>
            ))}
          </select>
        </Field>
        <Field label={r.date} icon={<CalendarCheck className="h-4 w-4" />}>
          <input className="res-input" type="date" min={today} value={form.date} onChange={(e) => update('date', e.target.value)} />
        </Field>
        <Field label={r.time} icon={<Clock className="h-4 w-4" />}>
          <select className="res-input" value={form.time} onChange={(e) => update('time', e.target.value)}>
            {TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={() => haptic('success')}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle className="h-4 w-4" /> {r.wa.open} <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : (
        <p className="mt-6 rounded-xl bg-black/[0.04] p-3 text-sm text-fg/50">{r.wa.notConfigured}</p>
      )}
    </motion.div>
  );
}

function CalendlyBooking() {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass overflow-hidden rounded-[2rem] p-2"
    >
      {integrations.calendly ? (
        <iframe
          title="Calendly"
          src={integrations.calendly}
          className="h-[640px] w-full rounded-[1.6rem]"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <CalendarClock className="h-10 w-10 text-grape" />
          <h2 className="font-display text-xl font-bold">{t.reservations.calendly.title}</h2>
          <p className="max-w-sm text-sm text-fg/60">{t.reservations.calendly.body}</p>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost mt-2 text-sm"
          >
            {t.reservations.calendly.get} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </motion.div>
  );
}
