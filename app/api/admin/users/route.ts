import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const users = await User.find({}, "-addresses -wishlist").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching users", error: msg }, { status: 500 });
  }
}
