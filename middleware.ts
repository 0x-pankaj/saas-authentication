import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Public routes
  if (request.nextUrl.pathname === "/" || 
      request.nextUrl.pathname === "/pricing" ||
      request.nextUrl.pathname.startsWith("/auth/verify") ||
      request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Auth pages (login, register, etc.)
  if (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/forgot-password")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Pro routes
  if (request.nextUrl.pathname.startsWith("/pro")) {
    if (!token.subscription || token.subscription.plan === "FREE") {
      return NextResponse.redirect(new URL("/pricing?upgrade=pro", request.url));
    }
  }

  // Enterprise routes
  if (request.nextUrl.pathname.startsWith("/enterprise")) {
    if (!token.subscription || token.subscription.plan !== "ENTERPRISE") {
      return NextResponse.redirect(new URL("/pricing?upgrade=enterprise", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/pro/:path*",
    "/enterprise/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/pricing",
  ],
};