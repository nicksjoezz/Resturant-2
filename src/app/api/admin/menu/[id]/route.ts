import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const b = await req.json();
    const data: Record<string, unknown> = {};
    if (b.name != null) data.name = b.name;
    if (b.description != null) data.description = b.description;
    if (b.nameFr != null) data.nameFr = b.nameFr;
    if (b.descriptionFr != null) data.descriptionFr = b.descriptionFr;
    if (b.price != null) data.price = Number(b.price);
    if (b.image != null) data.image = b.image;
    if (b.tags != null) data.tags = Array.isArray(b.tags) ? b.tags.join(',') : b.tags;
    if (b.cuisine != null) data.cuisine = b.cuisine;
    if (b.spicy != null) data.spicy = Number(b.spicy);
    if (b.featured != null) data.featured = Boolean(b.featured);
    if (b.available != null) data.available = Boolean(b.available);
    if (b.prepMinutes != null) data.prepMinutes = Number(b.prepMinutes);
    if (b.calories != null) data.calories = Number(b.calories);
    if (b.categoryId != null) data.categoryId = b.categoryId;

    const item = await prisma.menuItem.update({ where: { id: params.id }, data });
    return NextResponse.json({ item });
  } catch (err) {
    console.error('[admin:menu:update]', err);
    return NextResponse.json({ error: 'Could not update item.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    await prisma.menuItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin:menu:delete]', err);
    return NextResponse.json({ error: 'Could not delete item.' }, { status: 500 });
  }
}
