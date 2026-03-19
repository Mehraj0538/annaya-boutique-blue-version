import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { queryProductsJSON } from "@/lib/jsonDb";

// Cache individual product responses for 1 hour at the edge
export const revalidate = 3600;

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      const product = await queryProductsJSON({ slug });
      if (!product) return NextResponse.json({ message: `Product not found: ${slug}` }, { status: 404 });
      return NextResponse.json(product, { headers: CACHE_HEADERS });
    }
    const product = await Product.findOne({ slug });
    if (!product) return NextResponse.json({ message: `Product not found: ${slug}` }, { status: 404 });
    return NextResponse.json(product, { headers: CACHE_HEADERS });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching product", error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // slug here is actually the MongoDB _id when called from admin
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const updateData = await req.json();
    const updated = await Product.findByIdAndUpdate(slug, { $set: updateData }, { new: true });
    if (!updated) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error updating product", error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(slug);
    if (!deleted) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error deleting product", error: msg }, { status: 500 });
  }
}
