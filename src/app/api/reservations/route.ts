import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

// Public: create a reservation request.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone = '', partySize, date, time, occasion = '', notes = '' } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Name, email, date and time are required.' },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        partySize: Math.max(1, Math.min(30, Number(partySize) || 2)),
        date: new Date(date),
        time,
        occasion,
        notes,
        status: 'REQUESTED',
      },
    });

    return NextResponse.json({ ok: true, id: reservation.id });
  } catch (err) {
    console.error('[reservations:create]', err);
    return NextResponse.json({ error: 'Could not create reservation.' }, { status: 500 });
  }
}

// Admin: list reservations.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ reservations });
}
