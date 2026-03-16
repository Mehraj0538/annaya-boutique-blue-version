import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import Order from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(id);
    } catch {
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }
    const orders = await Order.find({ userId: userObjectId }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching user orders", error: msg }, { status: 500 });
  }
}
