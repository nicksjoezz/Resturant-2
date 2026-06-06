import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public: submit a contact message.
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject = '', message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      );
    }
    const created = await prisma.message.create({
      data: { name, email, subject, message },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error('[contact:create]', err);
    return NextResponse.json({ error: 'Could not send message.' }, { status: 500 });
  }
}
