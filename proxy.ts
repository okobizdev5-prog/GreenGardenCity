import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";
    const isAdminSubdomain = hostname.startsWith("admin.");

    // If on the admin subdomain and the path doesn't already start with /admin, rewrite it
    if (isAdminSubdomain && !url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const url = req.nextUrl;
        const hostname = req.headers.get("host") || "";
        const isAdminSubdomain = hostname.startsWith("admin.");
        
        // Require auth if the path is in /admin OR they are on the admin subdomain
        if (url.pathname.startsWith("/admin") || isAdminSubdomain) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
