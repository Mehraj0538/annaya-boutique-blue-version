export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(id),
    }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching user orders", error: msg },
      { status: 500 }
    );
  }
}
