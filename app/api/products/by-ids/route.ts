import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ message: "Invalid IDs" }, { status: 400 });
    }
    await connectDB();
    const products = await Product.find({ _id: { $in: ids } });
    return NextResponse.json(products);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching products by ids", error: msg }, { status: 500 });
  }
}
