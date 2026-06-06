import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guard';

// List all menu items (including unavailable) for the admin.
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items });
}

// Create a new menu item.
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const b = await req.json();
    if (!b.name || !b.categoryId || b.price == null) {
      return NextResponse.json(
        { error: 'name, price and categoryId are required.' },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name: b.name,
        description: b.description ?? '',
        nameFr: b.nameFr ?? '',
        descriptionFr: b.descriptionFr ?? '',
        price: Number(b.price),
        image: b.image ?? '',
        tags: Array.isArray(b.tags) ? b.tags.join(',') : b.tags ?? '',
        cuisine: b.cuisine ?? 'Signature',
        spicy: Number(b.spicy) || 0,
        featured: Boolean(b.featured),
        available: b.available ?? true,
        prepMinutes: Number(b.prepMinutes) || 20,
        calories: Number(b.calories) || 0,
        categoryId: b.categoryId,
      },
    });
    return NextResponse.json({ item });
  } catch (err) {
    console.error('[admin:menu:create]', err);
    return NextResponse.json({ error: 'Could not create item.' }, { status: 500 });
  }
}
