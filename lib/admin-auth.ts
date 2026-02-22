import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'admin_session';

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword());
}

export function isAuthorizedRequest(req: NextRequest) {
  const expected = getAdminPassword();
  if (!expected) return false;
  const actual = req.cookies.get(ADMIN_COOKIE_NAME)?.value || '';
  return actual === expected;
}

export function setAdminSessionCookie(res: NextResponse) {
  const password = getAdminPassword();
  res.cookies.set(ADMIN_COOKIE_NAME, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
