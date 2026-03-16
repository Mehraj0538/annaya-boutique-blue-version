import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { queryProductsJSON } from "@/lib/jsonDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const minPrice = searchParams.get("minPrice") ?? undefined;
  const maxPrice = searchParams.get("maxPrice") ?? undefined;

  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      const products = await queryProductsJSON({
        category,
        sort,
        search,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      return NextResponse.json(products);
    }

    let query: Record<string, unknown> = {};

    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search && search.trim() !== "") {
      const s = search.trim();
      const conditions: unknown[] = [
        { name: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
        { category: { $regex: s, $options: "i" } },
      ];
      const priceMatch = s.match(/\d+/);
      if (priceMatch) conditions.push({ price: Number(priceMatch[0]) });

      if (query.category) {
        query = { $and: [{ category: query.category }, { $or: conditions }] };
      } else {
        query.$or = conditions;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.$gte = Number(minPrice);
      if (maxPrice !== undefined) priceFilter.$lte = Number(maxPrice);
      query.price = priceFilter;
    }

    let sortQuery: Record<string, number> = { createdAt: -1 };
    if (sort === "price-asc") sortQuery = { price: 1 };
    if (sort === "price-desc") sortQuery = { price: -1 };
    if (sort === "rating") sortQuery = { rating: -1 };

    const products = await Product.find(query).sort(sortQuery);
    return NextResponse.json(products);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching products", error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const productData = await req.json();

    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error creating product", error: msg }, { status: 500 });
  }
}
