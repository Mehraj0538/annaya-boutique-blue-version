"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/products/ProductCard";
import api from "@/lib/api";
import ShellLayout from "@/components/ShellLayout";

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlist.length === 0) { setLoading(false); return; }
      try {
        const res = await api.get("/api/products");
        setProducts(res.data.filter((p: Record<string, unknown>) => wishlist.includes(p._id as string)));
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchWishlist();
  }, [wishlist]);

  if (wishlist.length === 0) return (
    <ShellLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6"><Heart className="w-10 h-10 text-rose-500" /></div>
        <h2 className="text-3xl font-serif font-bold text-royal mb-4">Your Wishlist is Empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-xs">Save items you love by tapping the heart icon on any product.</p>
        <Link href="/products" className="px-8 py-4 bg-royal text-white font-bold rounded-full hover:shadow-lg transition-all">Explore Products</Link>
      </div>
    </ShellLayout>
  );

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-10 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-royal mb-10">My Wishlist</h1>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] bg-slate-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p._id as string} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </ShellLayout>
  );
}
