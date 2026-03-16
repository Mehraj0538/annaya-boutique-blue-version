import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { queryProductsJSON } from "@/lib/jsonDb";

export async function GET() {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      const products = (await queryProductsJSON({ isNewArrival: true })) as unknown[];
      return NextResponse.json((products as unknown[]).slice(0, 8));
    }
    const products = await Product.find({ isNewArrival: true }).limit(8);
    return NextResponse.json(products);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching new arrivals", error: msg }, { status: 500 });
  }
}
