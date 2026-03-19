import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ isNewArrival: true }).limit(8);
    return NextResponse.json(products, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching new arrivals", error: msg }, { status: 500 });
  }
}
