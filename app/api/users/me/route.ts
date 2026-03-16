import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const auth0Id = req.nextUrl.searchParams.get("auth0Id");
  if (!auth0Id) return NextResponse.json({ message: "auth0Id is required" }, { status: 400 });

  try {
    await connectDB();
    const user = await User.findOne({ auth0Id });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching user", error: msg }, { status: 500 });
  }
}
