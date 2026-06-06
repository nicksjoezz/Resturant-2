import 'server-only';
import { prisma } from '@/lib/prisma';
import { parseTags } from '@/lib/utils';
import type { MenuItemDTO, CategoryDTO } from '@/lib/types';

function toDTO(item: {
  id: string;
  name: string;
  description: string;
  nameFr: string;
  descriptionFr: string;
  price: number;
  image: string;
  tags: string;
  cuisine: string;
  spicy: number;
  featured: boolean;
  available: boolean;
  prepMinutes: number;
  calories: number;
  categoryId: string;
  category?: { name: string; slug: string } | null;
}): MenuItemDTO {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    nameFr: item.nameFr,
    descriptionFr: item.descriptionFr,
    price: item.price,
    image: item.image,
    tags: parseTags(item.tags),
    cuisine: item.cuisine,
    spicy: item.spicy,
    featured: item.featured,
    available: item.available,
    prepMinutes: item.prepMinutes,
    calories: item.calories,
    categoryId: item.categoryId,
    categoryName: item.category?.name,
    categorySlug: item.category?.slug,
  };
}

export async function getMenuItems(opts?: { onlyAvailable?: boolean }): Promise<MenuItemDTO[]> {
  const items = await prisma.menuItem.findMany({
    where: opts?.onlyAvailable ? { available: true } : undefined,
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
  });
  return items.map(toDTO);
}

export async function getFeaturedItems(limit = 6): Promise<MenuItemDTO[]> {
  const items = await prisma.menuItem.findMany({
    where: { featured: true, available: true },
    include: { category: true },
    take: limit,
  });
  return items.map(toDTO);
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const cats = await prisma.category.findMany({ orderBy: { order: 'asc' } });
  return cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug, order: c.order }));
}
