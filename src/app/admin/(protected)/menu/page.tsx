import MenuManager from '@/components/admin/MenuManager';
import { getCategories } from '@/lib/data';

export const metadata = { title: 'Menu — Foddo Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const categories = await getCategories();
  return <MenuManager categories={categories} />;
}
