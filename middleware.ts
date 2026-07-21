import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ponytail: single shared password in an httpOnly cookie, no session store.
// Upgrade to per-user auth (e.g. NextAuth) if more than one person needs access.
export const config = {
  matcher: [
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
  const auth = req.cookies.get("ds_auth")?.value;
  if (auth && auth === process.env.ADMIN_PASSWORD) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
