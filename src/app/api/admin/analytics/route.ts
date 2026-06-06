import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

export const dynamic = 'force-dynamic';

// Aggregate metrics for the real-time admin dashboard.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const [orders, reservations, menuCount, items] = await Promise.all([
    prisma.order.findMany({ include: { items: true } }),
    prisma.reservation.count(),
    prisma.menuItem.count(),
    prisma.orderItem.findMany(),
  ]);

  const paidOrders = orders.filter((o) => o.paid);
  const revenue = +paidOrders.reduce((s, o) => s + o.total, 0).toFixed(2);
  const avgOrder = paidOrders.length ? +(revenue / paidOrders.length).toFixed(2) : 0;

  const activeOrders = orders.filter((o) =>
    ['PAID', 'PREPARING', 'READY'].includes(o.status)
  ).length;

  // Revenue per day for the last 14 days
  const days = 14;
  const today = new Date();
  const revByDay: { date: string; revenue: number; orders: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = paidOrders.filter(
      (o) => o.createdAt.toISOString().slice(0, 10) === key
    );
    revByDay.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: +dayOrders.reduce((s, o) => s + o.total, 0).toFixed(2),
      orders: dayOrders.length,
    });
  }

  // Status + type breakdowns
  const statusBreakdown = countBy(orders, (o) => o.status);
  const typeBreakdown = countBy(orders, (o) => o.type);

  // Top dishes by quantity sold
  const dishMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const it of items) {
    const cur = dishMap.get(it.name) || { name: it.name, quantity: 0, revenue: 0 };
    cur.quantity += it.quantity;
    cur.revenue += it.price * it.quantity;
    dishMap.set(it.name, cur);
  }
  const topDishes = [...dishMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6)
    .map((d) => ({ ...d, revenue: +d.revenue.toFixed(2) }));

  return NextResponse.json({
    kpis: {
      revenue,
      orders: orders.length,
      paidOrders: paidOrders.length,
      avgOrder,
      reservations,
      menuCount,
      activeOrders,
    },
    revByDay,
    statusBreakdown,
    typeBreakdown,
    topDishes,
  });
}

function countBy<T>(arr: T[], key: (x: T) => string) {
  const m: Record<string, number> = {};
  for (const x of arr) {
    const k = key(x);
    m[k] = (m[k] || 0) + 1;
  }
  return Object.entries(m).map(([name, value]) => ({ name, value }));
}
