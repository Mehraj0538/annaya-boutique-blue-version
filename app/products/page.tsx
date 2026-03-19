import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import ShellLayout from "@/components/ShellLayout";

export const revalidate = 1800;

const HARDCODED_FROCK_PRIORITY_PRODUCTS = [
  { _id: "69a35e8643e117e303520c39", name: "Red & Black Ombre Festive Gown", slug: "red-black-ombre-festive-gown", description: "Bold and elegant...", category: "Frock", images: ["https://res.cloudinary.com/douvhybil/image/upload/v1772314245/AWP%20Shopping-products/uwsey4hgzov8pdofqovc.jpg"], price: 500, originalPrice: 588, discountPercent: 15, sizes: ["XS","S","M","L","XL","XXL","3XL","4XL","5XL"], colors: [{ name: "Red", hex: "#DC2626", _id: "2d968895fc2ef03b4a6976ba" }], stock: 34, rating: 5, reviewCount: 1293, isFeatured: false, isNewArrival: false, createdAt: "2026-02-28T21:30:46.491Z" },
  { _id: "69a35ca343e117e303520c26", name: "Scarlet Red & Deep Teal Ombre Gown", slug: "scarlet-red-deep-teal-ombre-gown", description: "A stunning fusion of bold colors...", category: "Frock", images: ["https://res.cloudinary.com/douvhybil/image/upload/v1772313763/AWP%20Shopping-products/dmbw5wosjugeadwdddzu.jpg"], price: 500, originalPrice: 588, discountPercent: 15, sizes: ["XS","S","M","L","XL","XXL","3XL","4XL","5XL"], colors: [{ name: "Red", hex: "#DC2626", _id: "63b56bf8dd3e37f0c1d7a06a" }], stock: 32, rating: 4.9, reviewCount: 1236, isFeatured: false, isNewArrival: false, createdAt: "2026-02-28T21:22:43.944Z" },
];
const FROCK_PRIORITY_IDS = HARDCODED_FROCK_PRIORITY_PRODUCTS.map((p) => p._id);

export default async function ProductsPage(props: {
  params?: Promise<{ category?: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = props.params ? await props.params : undefined;
  const searchParams = props.searchParams ? await props.searchParams : undefined;

  let category = "All";
  if (params?.category) {
    category = decodeURIComponent(params.category).replace(/\+/g, " ");
  } else if (searchParams?.category) {
    category = searchParams.category as string;
  }

  const sort = (searchParams?.sort as string) || "default";
  const search = (searchParams?.search as string) || "";
  const minPrice = (searchParams?.minPrice as string) || "";
  const maxPrice = (searchParams?.maxPrice as string) || "";

  await connectDB();

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

  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    query.price = priceFilter;
  }

  let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === "price-asc") sortQuery = { price: 1 };
  if (sort === "price-desc") sortQuery = { price: -1 };
  if (sort === "rating") sortQuery = { rating: -1 };

  const fetchedDocs = await Product.find(query).sort(sortQuery).lean();
  let fetchedProducts = JSON.parse(JSON.stringify(fetchedDocs));

  if (["frock", "frocks"].includes(category.toLowerCase())) {
     const others = fetchedProducts.filter((p: any) => !FROCK_PRIORITY_IDS.includes(p._id));
     fetchedProducts = [...HARDCODED_FROCK_PRIORITY_PRODUCTS, ...others];
  }

  return (
    <Suspense fallback={<ShellLayout><div className="min-h-screen flex items-center justify-center text-royal font-bold">Loading collection...</div></ShellLayout>}>
      <ProductsClient 
        initialProducts={fetchedProducts}
        initialCategory={category}
        initialSort={sort}
        initialSearch={search}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
      />
    </Suspense>
  );
}
