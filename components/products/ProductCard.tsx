"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Record<string, unknown> }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id as string);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id as string,
      name: product.name as string,
      price: product.price as number,
      image: (product.images as string[])[0],
      size: (product.sizes as string[])[0],
      color: (product.colors as { name: string }[])[0].name,
      qty: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id as string);
    if (!isWishlisted) toast.success("Added to wishlist!");
  };

  return (
    <motion.div whileHover={{ y: -8 }} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img src={(product.images as string[])[0]} alt={product.name as string} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
        {(product.discountPercent as number) > 0 && (
          <div className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{product.discountPercent as number}% OFF</div>
        )}
        {product.isNewArrival && (
          <div className="absolute top-3 left-3 bg-sapphire text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mt-7">New</div>
        )}
        <button onClick={handleToggleWishlist} className={cn("absolute top-3 right-3 p-2 rounded-full glass silk-transition", isWishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-500")}>
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>
      </Link>
      <div className="p-4">
        <div className="text-[10px] font-bold text-sapphire uppercase tracking-widest mb-1">{product.category as string}</div>
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-royal transition-colors">{product.name as string}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-royal">{formatCurrency(product.price as number)}</span>
            {(product.originalPrice as number) > (product.price as number) && (
              <span className="text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice as number)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-bold">{Number(product.rating || 0).toFixed(1)}</span>
            <span>({product.reviewCount as number})</span>
          </div>
        </div>
        <button onClick={handleAddToCart} className="w-full mt-4 py-2.5 bg-royal text-white text-xs font-bold rounded-xl hover:bg-sapphire silk-transition flex items-center justify-center gap-2">
          <ShoppingBag className="w-4 h-4" />Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
