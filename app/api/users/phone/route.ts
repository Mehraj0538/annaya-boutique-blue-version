import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { auth0Id, phone } = await req.json();
    if (!auth0Id || !phone)
      return NextResponse.json({ message: "auth0Id and phone are required" }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $set: { phone } },
      { new: true }
    );
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error saving phone", error: msg }, { status: 500 });
  }
}
