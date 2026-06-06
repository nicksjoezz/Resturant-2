import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

// Admin: list contact messages (newest first).
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  const unread = messages.filter((m) => !m.read).length;
  return NextResponse.json({ messages, unread });
}
