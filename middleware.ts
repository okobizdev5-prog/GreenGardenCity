import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Define what your admin subdomain will be
  // E.g., admin.greengardencity.com or admin.localhost:3000
  const isAdminSubdomain = hostname.startsWith('admin.');

  // If the user visits the admin subdomain, but the URL path doesn't start with /admin
  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    // Rewrite the request to the /admin path behind the scenes
    // So admin.domain.com/login becomes domain.com/admin/login internally
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // If someone tries to access /admin directly on the main domain (optional)
  // You can choose to redirect them to the subdomain, or just let both work.
  // We'll let both work by default.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, etc (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
