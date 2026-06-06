import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

// List orders (newest first) with their line items — powers the live order board.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ orders });
}
