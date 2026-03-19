"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Truck,
  RefreshCw,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatCurrency, getWhatsAppLink, cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProductCard } from "@/components/products/ProductCard";

type ProductColor = { name: string; hex: string; _id?: string };
export type SerializedProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
};

interface Props {
  product: SerializedProduct;
  related: SerializedProduct[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors[0] ?? null
  );
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const addToCart = useCartStore((s) => s.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { images, sizes, colors } = product;

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
      size: selectedSize,
      color: selectedColor?.name ?? "",
      qty,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const waMessage = `Hello!\n\nI'm interested in ordering the *${product.name}*.\n\nSize: ${selectedSize}\nColor: ${
    selectedColor?.name ?? "Any Colour"
  }\nPrice: ${formatCurrency(product.price)}\n\nIs this available?`;

  return (
    <div className="pb-20 lg:pb-10 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 shadow-lg">
              <Image
                src={images[activeImg]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-y-0 left-0 flex items-center p-2">
                <button
                  onClick={() =>
                    setActiveImg((p) => (p > 0 ? p - 1 : images.length - 1))
                  }
                  className="p-2 rounded-full glass hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center p-2">
                <button
                  onClick={() =>
                    setActiveImg((p) => (p < images.length - 1 ? p + 1 : 0))
                  }
                  className="p-2 rounded-full glass hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "relative w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 silk-transition flex-shrink-0",
                    activeImg === i ? "border-royal" : "border-transparent"
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-xs font-bold text-sapphire tracking-[3px] uppercase mb-2">
              Annaya Boutique • {product.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-bold">
                <Star className="w-4 h-4 fill-gold" />
                {Number(product.rating || 0).toFixed(1)}
              </div>
              <span className="text-slate-400 text-sm">
                {product.reviewCount} Reviews
              </span>
              <span className="text-emerald-600 text-sm font-bold">
                In Stock
              </span>
            </div>
            <div className="bg-sky/10 p-6 rounded-3xl mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-royal">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-emerald-600 text-sm font-medium mt-2">
                You save {formatCurrency(product.originalPrice - product.price)}
                !
              </p>
            </div>

            <div className="space-y-8">
              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                  Color:{" "}
                  <span className="text-slate-500 font-medium normal-case">
                    {selectedColor?.name}
                  </span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 silk-transition relative",
                        selectedColor?.name === color.name
                          ? "border-royal scale-110"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <div className="absolute inset-[-4px] border border-royal rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                    Select Size
                  </label>
                  <button className="text-xs font-bold text-sapphire underline uppercase tracking-widest">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[56px] h-12 rounded-xl border-2 font-bold text-sm silk-transition",
                        selectedSize === size
                          ? "bg-royal border-royal text-white"
                          : "bg-white border-slate-100 text-slate-600 hover:border-royal"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                  Quantity
                </label>
                <div className="inline-flex items-center bg-white border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-slate-50 transition-colors text-royal font-bold"
                  >
                    －
                  </button>
                  <span className="px-6 font-bold text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-3 hover:bg-slate-50 transition-colors text-royal font-bold"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-royal text-white font-bold rounded-2xl hover:bg-sapphire silk-transition shadow-lg shadow-royal/20 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  onClick={() =>
                    window.open(getWhatsAppLink(waMessage), "_blank")
                  }
                  className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 silk-transition flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" /> Order on WhatsApp
                </button>
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 silk-transition flex items-center justify-center",
                    isInWishlist(product._id)
                      ? "border-rose-100 bg-rose-50 text-rose-500"
                      : "border-slate-100 text-slate-400 hover:border-rose-100"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-6 h-6",
                      isInWishlist(product._id) && "fill-current"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-12">
              <div className="flex border-b border-slate-100">
                {["description", "details", "shipping"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-4 text-xs font-bold uppercase tracking-widest silk-transition border-b-2",
                      activeTab === tab
                        ? "border-royal text-royal"
                        : "border-transparent text-slate-400"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-6 text-slate-600 text-sm leading-relaxed">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "details" && (
                  <ul className="space-y-2 list-disc pl-4">
                    <li>Premium Quality Fabric</li>
                    <li>Handcrafted Embroidery</li>
                    <li>Dry Clean Recommended</li>
                    <li>Authentic Annaya Boutique Design</li>
                  </ul>
                )}
                {activeTab === "shipping" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gold shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">
                          Free Shipping
                        </p>
                        <p>
                          On all orders above ₹999. Standard delivery takes 4-7
                          business days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-gold shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">
                          Easy Returns &amp; Exchange
                        </p>
                        <p>
                          7-day hassle-free return policy for unworn items with
                          original tags.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-royal mb-4">
                You May Also Like
              </h2>
              <div className="w-16 h-1 bg-gold rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p as unknown as Record<string, unknown>}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
