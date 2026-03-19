import type { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ShellLayout from "@/components/ShellLayout";
import ProductDetailClient, { type SerializedProduct } from "./ProductDetailClient";

// ─── ISR: re-generate product pages at most once per hour ───────────────────
export const revalidate = 3600;

// ─── Pre-build ALL product pages at deploy time → served from CDN ────────────
export async function generateStaticParams() {
  try {
    await connectDB();
    const products = await Product.find({}, { slug: 1, _id: 0 }).lean();
    return (products as { slug: string }[]).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ─── Per-page SEO metadata ────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const product = (await Product.findOne(
      { slug },
      { name: 1, description: 1, images: 1 }
    ).lean()) as { name: string; description: string; images: string[] } | null;
    if (!product) return { title: "Product Not Found | Annaya Boutique" };
    return {
      title: `${product.name} | Annaya Boutique`,
      description: product.description?.slice(0, 155),
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 155),
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Annaya Boutique" };
  }
}

// ─── Page: fetch data server-side, pass as props to client component ──────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    await connectDB();

    const productDoc = (await Product.findOne({ slug }).lean()) as SerializedProduct | null;
    if (!productDoc) notFound();

    const relatedDocs = (await Product.find(
      { category: productDoc.category, slug: { $ne: slug } },
      null,
      { limit: 4, sort: { rating: -1 } }
    ).lean()) as SerializedProduct[];

    const product: SerializedProduct = JSON.parse(JSON.stringify(productDoc));
    const related: SerializedProduct[] = JSON.parse(JSON.stringify(relatedDocs));

    return (
      <ShellLayout>
        <ProductDetailClient product={product} related={related} />
      </ShellLayout>
    );
  } catch {
    notFound();
  }
}
