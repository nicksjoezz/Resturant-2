import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';
import { ORDER_STATUSES } from '@/lib/types';

// Update an order's status (admin order board drag/select).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { status } = await req.json();
    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status, paid: status === 'PAID' ? true : undefined },
    });
    return NextResponse.json({ order });
  } catch (err) {
    console.error('[admin:orders:update]', err);
    return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });
  }
}
