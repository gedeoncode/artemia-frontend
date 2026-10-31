import { NextResponse, type NextRequest } from "next/server";

// Prevents redirect loops
export function safeRedirect(req: NextRequest, target: string) {
  const current = req.nextUrl.pathname;
  if (current === target) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(target, req.url));
}
