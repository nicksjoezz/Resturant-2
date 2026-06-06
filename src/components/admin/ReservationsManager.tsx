'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CalendarDays, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { usePolling } from '@/lib/usePolling';
import { useI18n } from '@/i18n/LanguageProvider';
import { RESERVATION_STATUSES, type ReservationStatus } from '@/lib/types';

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  occasion: string;
  notes: string;
  status: ReservationStatus;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: 'bg-butter/20 text-butter',
  CONFIRMED: 'bg-azure/20 text-azure',
  SEATED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-ember/20 text-ember',
};

export default function ReservationsManager() {
  const { t } = useI18n();
  const sl = (s: string) => t.admin.statuses[s as keyof typeof t.admin.statuses] ?? s;
  const { data, loading, refresh } = usePolling<{ reservations: Reservation[] }>(
    '/api/reservations',
    6000
  );
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: ReservationStatus) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${t.admin.reservations.toastUpdated} ${sl(status)}`);
      await refresh();
    } catch {
      toast.error(t.admin.reservations.toastError);
    } finally {
      setBusy(null);
    }
  }

  const reservations = data?.reservations ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        {t.admin.reservations.title}
      </h1>
      <p className="mt-1 text-sm text-fg/50">
        {reservations.length} {t.admin.reservations.total}
      </p>

      {loading && !data ? (
        <div className="py-20 text-center text-fg/50">{t.admin.reservations.loading}</div>
      ) : reservations.length === 0 ? (
        <div className="py-20 text-center text-fg/50">{t.admin.reservations.none}</div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reservations.map((r) => (
            <motion.div
              key={r.id}
              layout
              className="rounded-2xl border border-black/10 bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-bold">{r.name}</div>
                  {r.occasion && <div className="text-xs text-butter">{r.occasion}</div>}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[r.status]}`}
                >
                  {sl(r.status)}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-fg/60">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(r.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                  <Clock className="ml-2 h-4 w-4" /> {r.time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> {r.partySize} {t.admin.reservations.guests}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {r.email}
                </div>
                {r.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {r.phone}
                  </div>
                )}
              </div>

              {r.notes && (
                <p className="mt-3 rounded-lg bg-black/[0.04] p-2.5 text-xs text-fg/60">{r.notes}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-black/10 pt-4">
                {RESERVATION_STATUSES.filter((s) => s !== r.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(r.id, s)}
                    disabled={busy === r.id}
                    className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-fg/70 transition hover:bg-black/[0.06] disabled:opacity-50"
                  >
                    {sl(s)}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
