import { NextRequest, NextResponse } from "next/server";
import connectDB from "./mongodb";
import User from "@/models/User";

export async function requireAdmin(req: NextRequest) {
  const auth0Id =
    req.headers.get("x-auth0-id") ||
    req.nextUrl.searchParams.get("auth0Id");

  if (!auth0Id) {
    return { error: NextResponse.json({ message: "Unauthorized – No Auth0 ID" }, { status: 401 }) };
  }

  await connectDB();
  const user = await User.findOne({ auth0Id });

  if (!user || user.role !== "admin") {
    return { error: NextResponse.json({ message: "Forbidden – Admin access required" }, { status: 403 }) };
  }

  return { user };
}
