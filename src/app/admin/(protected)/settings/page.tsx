import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import SettingsPanel from '@/components/admin/SettingsPanel';

export const metadata = { title: 'Settings — Foddo Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return <SettingsPanel session={session} />;
}
