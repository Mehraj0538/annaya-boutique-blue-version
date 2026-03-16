import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { auth0Id, address } = await req.json();
    if (!auth0Id || !address)
      return NextResponse.json({ message: "auth0Id and address required" }, { status: 400 });

    const user = await User.findOne({ auth0Id });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (address._id) {
      const idx = user.addresses.findIndex((a: { _id: { toString: () => string } }) => a._id.toString() === address._id);
      if (idx > -1) user.addresses[idx] = { ...user.addresses[idx], ...address };
    } else {
      user.addresses.push(address);
    }

    await user.save();
    return NextResponse.json(user.addresses);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error saving address", error: msg }, { status: 500 });
  }
}
