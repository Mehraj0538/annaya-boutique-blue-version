import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();


    const priorityCategories = [
      { name: "Lehenga", static: "/Red Lehenga Image.png" },
      { name: "Saree", static: "/Purple Saree Image.png" },
      { name: "Kurti", static: "/Pink Kurti Image.png" },
      { name: "Suit", static: "/Pista Green Suit Image.png" },
      { name: "Frock", static: "/Peach Frock Image.png" },
      { name: "Co-ord Set", static: "/Red Co-ord Set Image.png" },
    ];

    const results = await Promise.all(
      priorityCategories.map(async (cat) => {
        const product = await Product.findOne({ category: cat.name }).sort({ createdAt: -1 });
        return { name: cat.name, img: product?.images?.[0] || cat.static };
      })
    );

    const otherCats = await Product.distinct("category", {
      category: { $nin: priorityCategories.map((c) => c.name) },
    });
    const otherResults = await Promise.all(
      otherCats.map(async (cat: string) => {
        const product = await Product.findOne({ category: cat }).sort({ createdAt: -1 });
        return { name: cat, img: product?.images?.[0] || "" };
      })
    );

    return NextResponse.json([...results, ...otherResults].filter((c) => c.name), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching categories", error: msg }, { status: 500 });
  }
}
