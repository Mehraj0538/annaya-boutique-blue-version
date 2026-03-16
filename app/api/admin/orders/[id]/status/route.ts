import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import Order from "@/models/Order";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const { status } = await req.json();
    const valid = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!valid.includes(status))
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });

    const order = await Order.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error updating status", error: msg }, { status: 500 });
  }
}
