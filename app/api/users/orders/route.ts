import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  const auth0Id = req.nextUrl.searchParams.get("auth0Id");
  if (!auth0Id) return NextResponse.json({ message: "auth0Id is required" }, { status: 400 });

  try {
    await connectDB();
    const user = await User.findOne({ auth0Id });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching orders", error: msg }, { status: 500 });
  }
}
