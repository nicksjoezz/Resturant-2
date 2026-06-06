'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CalendarDays,
  Flame,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePolling } from '@/lib/usePolling';
import { formatPrice } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageProvider';
import QrWidget from './QrWidget';

type Analytics = {
  kpis: {
    revenue: number;
    orders: number;
    paidOrders: number;
    avgOrder: number;
    reservations: number;
    menuCount: number;
    activeOrders: number;
  };
  revByDay: { date: string; revenue: number; orders: number }[];
  statusBreakdown: { name: string; value: number }[];
  typeBreakdown: { name: string; value: number }[];
  topDishes: { name: string; quantity: number; revenue: number }[];
};

const PIE_COLORS = ['#F5D547', '#E8622C', '#7C3AED', '#2D7FF9', '#4ade80', '#f87171'];

export default function Dashboard() {
  const { t } = useI18n();
  const d = t.admin.dashboard;
  const { data, loading } = usePolling<Analytics>('/api/admin/analytics', 5000);

  if (loading && !data) {
    return <div className="py-20 text-center text-fg/50">{d.loading}</div>;
  }
  if (!data) return null;

  const { kpis } = data;

  const cards = [
    { label: d.kRevenue, value: formatPrice(kpis.revenue), icon: DollarSign, color: 'text-butter' },
    { label: d.kOrders, value: kpis.orders, icon: ShoppingBag, color: 'text-azure' },
    { label: d.kAvg, value: formatPrice(kpis.avgOrder), icon: TrendingUp, color: 'text-grape' },
    { label: d.kActive, value: kpis.activeOrders, icon: Flame, color: 'text-ember' },
    { label: d.kReservations, value: kpis.reservations, icon: CalendarDays, color: 'text-fg' },
    { label: d.kMenu, value: kpis.menuCount, icon: UtensilsCrossed, color: 'text-fg' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{d.title}</h1>
          <p className="mt-1 text-sm text-fg/50">
            {d.live}
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-black/10 bg-card p-5"
          >
            <c.icon className={`h-5 w-5 ${c.color}`} />
            <div className="mt-3 font-display text-2xl font-extrabold">{c.value}</div>
            <div className="text-xs text-fg/50">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Revenue trend */}
        <div className="rounded-2xl border border-black/10 bg-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold">{d.revenue14d}</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revByDay} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5D547" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#F5D547" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(244,239,230,0.1)',
                    borderRadius: 12,
                    color: '#F4EFE6',
                  }}
                  formatter={(v: number) => formatPrice(v)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F5D547"
                  strokeWidth={2.5}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order status pie */}
        <div className="rounded-2xl border border-black/10 bg-card p-6">
          <h3 className="font-display text-lg font-bold">{d.byStatus}</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(244,239,230,0.1)',
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {data.statusBreakdown.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5 text-fg/60">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {t.admin.statuses[s.name as keyof typeof t.admin.statuses] ?? s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top dishes + QR widget */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-black/10 bg-card p-6 lg:col-span-2">
        <h3 className="font-display text-lg font-bold">{d.topDishes}</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topDishes} margin={{ left: -18, right: 8, top: 8 }}>
              <XAxis
                dataKey="name"
                stroke="#666"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={50}
              />
              <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  background: '#141414',
                  border: '1px solid rgba(244,239,230,0.1)',
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="quantity" radius={[8, 8, 0, 0]} fill="#E8622C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
        <QrWidget />
      </div>
    </div>
  );
}
