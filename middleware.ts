import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ponytail: single shared password in an httpOnly cookie, no session store.
// Upgrade to per-user auth (e.g. NextAuth) if more than one person needs access.
export const config = {
  matcher: [
    "/",
    "/copilot/:path*",
    "/build",
    "/api/leads",
    "/api/copilot",
    "/api/workflow",
    "/api/summarize",
    "/api/extract-state",
    "/api/transcribe",
    "/api/export-to-doc",
    "/api/push-to-crm",
    "/api/generate-pitchdeck",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // bare "/" with ?public is the booked-call link (same as /assessment, which
  // isn't in the matcher above so it bypasses this middleware entirely)
  if (pathname === "/" && searchParams.has("public")) return NextResponse.next();

  const auth = req.cookies.get("ds_auth")?.value;
  if (auth && auth === process.env.ADMIN_PASSWORD) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
