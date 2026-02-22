import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, isAdminConfigured, setAdminSessionCookie } from '../../../../lib/admin-auth';

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body?.password || '');

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response);
  return response;
}
