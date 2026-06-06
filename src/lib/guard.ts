import { NextResponse } from 'next/server';
import { getAdminSession, type AdminSession } from '@/lib/auth';

/**
 * Use inside admin API routes:
 *   const guard = await requireAdmin();
 *   if (!guard.ok) return guard.response;
 *   // guard.session is now available
 */
export async function requireAdmin(): Promise<
  { ok: true; session: AdminSession } | { ok: false; response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
