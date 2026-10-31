// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { safeRedirect, PUBLIC_ROUTES, isPublicRoute } from "@/lib/middleware";
import { REFRESH_TOKEN } from "./lib/auth/constants";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
    const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;

  /* ------------------------------------------------------------------ */
  /*                         Ignore static files                         */
  /* ------------------------------------------------------------------ */

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next();
  }

  /* ------------------------------------------------------------------ */
  /*                           Public routes                             */
  /* ------------------------------------------------------------------ */

  if (isPublicRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  /* ------------------------------------------------------------------ */
  /*                        Session presence check                       */
  /* ------------------------------------------------------------------ */

  /**
   * This middleware does NOT authenticate users.
   * It only checks for the presence of a valid session indicator.
   *
   * In our architecture, the refresh token (or session id)
   * is the single source of truth for session existence.
   */
  if (!refreshToken) {
    return safeRedirect(req, "/auth/login?reason=unauthenticated");
  }

  /* ------------------------------------------------------------------ */
  /*                          Allow request                              */
  /* ------------------------------------------------------------------ */

  return NextResponse.next();
}

/**
 * Apply middleware to all non-static, non-public routes
 */
export const config = {
  matcher: ["/((?!_next|.*\\..*|api/public|api).*)"],
};
