import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';
import { RESERVATION_STATUSES } from '@/lib/types';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { status } = await req.json();
    if (!RESERVATION_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ reservation });
  } catch (err) {
    console.error('[admin:reservations:update]', err);
    return NextResponse.json({ error: 'Could not update reservation.' }, { status: 500 });
  }
}
