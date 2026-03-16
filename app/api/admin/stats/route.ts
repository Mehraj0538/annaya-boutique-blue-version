import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const [userCount, productCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);
    const orders = await Order.find({}, "totalAmount");
    const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return NextResponse.json({ totalUsers: userCount, totalOrders: orderCount, productsCount: productCount, revenue });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching stats", error: msg }, { status: 500 });
  }
}
