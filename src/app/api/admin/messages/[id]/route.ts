import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

// Mark read/unread.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const { read } = await req.json();
    const message = await prisma.message.update({
      where: { id: params.id },
      data: { read: Boolean(read) },
    });
    return NextResponse.json({ message });
  } catch (err) {
    console.error('[admin:messages:update]', err);
    return NextResponse.json({ error: 'Could not update message.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    await prisma.message.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin:messages:delete]', err);
    return NextResponse.json({ error: 'Could not delete message.' }, { status: 500 });
  }
}
