import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    const isLoginPage = pathname === "/admin/login";

    let isValidSession = false;
    if (adminSession) {
      try {
        const decoded = JSON.parse(
          Buffer.from(adminSession, "base64").toString("utf-8")
        );
        if (decoded && decoded.exp && decoded.exp > Date.now()) {
          isValidSession = true;
        }
      } catch (e) {
        isValidSession = false;
      }
    }

    // If not logged in and trying to access any admin page other than login -> Redirect to /admin/login
    if (!isValidSession && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If already logged in and visiting /admin/login -> Redirect to /admin
    if (isValidSession && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
