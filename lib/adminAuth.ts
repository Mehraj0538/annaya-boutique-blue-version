import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight admin guard.
 * Checks the x-admin-key header against the ADMIN_SECRET_KEY env var.
 * No Auth0, no database lookup.
 *
 * Usage in route handlers:
 *   const { error } = requireAdmin(req);
 *   if (error) return error;
 */
export function requireAdmin(req: NextRequest): { error?: NextResponse } {
  const secret = process.env.ADMIN_SECRET_KEY;

  if (!secret) {
    console.error("ADMIN_SECRET_KEY is not configured.");
    return {
      error: NextResponse.json(
        { message: "Server misconfiguration." },
        { status: 500 }
      ),
    };
  }

  const provided =
    req.headers.get("x-admin-key") ??
    req.nextUrl.searchParams.get("adminKey") ??
    "";

  if (provided !== secret) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return {};
}
