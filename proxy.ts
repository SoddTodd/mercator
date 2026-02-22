import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedRequest } from './lib/admin-auth';

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';
  const isMapsApi = pathname === '/api/maps';

  const needsApiAuth =
    isMapsApi && (req.method === 'POST' || searchParams.get('full') === '1');

  if (!isAdminPage && !needsApiAuth) {
    return NextResponse.next();
  }

  if (isAdminLoginPage) {
    return NextResponse.next();
  }

  if (isAuthorizedRequest(req)) {
    return NextResponse.next();
  }

  if (isMapsApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/maps'],
};
