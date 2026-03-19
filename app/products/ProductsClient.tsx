"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Filter, X, Search } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import ShellLayout from "@/components/ShellLayout";

const PRICE_PRESETS = [
  { label: "Under ₹700", min: "", max: "700" },
  { label: "₹700 – ₹1000", min: "700", max: "1000" },
  { label: "₹1000 – ₹1350", min: "1000", max: "1350" },
  { label: "Above ₹1350", min: "1350", max: "" },
];

function PriceRangeFilter({ minPrice, maxPrice, onApply }: { minPrice: string; maxPrice: string; onApply: (min: string, max: string) => void }) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  useEffect(() => { setLocalMin(minPrice); setLocalMax(maxPrice); }, [minPrice, maxPrice]);
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Price Range</h3>
      <div className="space-y-2 mb-4">
        {PRICE_PRESETS.map((p) => (
          <button key={p.label} onClick={() => onApply(p.min, p.max)}
            className={cn("block w-full text-left text-sm py-1 px-2 rounded-lg silk-transition", localMin === p.min && localMax === p.max ? "text-royal font-bold bg-royal/5" : "text-slate-500 hover:text-royal")}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input type="number" placeholder="Min" value={localMin} onChange={(e) => setLocalMin(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-royal" />
        <span className="text-slate-400 text-xs shrink-0">to</span>
        <input type="number" placeholder="Max" value={localMax} onChange={(e) => setLocalMax(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-royal" />
      </div>
      <button onClick={() => onApply(localMin, localMax)} className="mt-3 w-full py-2 bg-royal text-white rounded-full text-sm font-semibold hover:bg-royal/90 transition-colors">Apply</button>
    </div>
  );
}

export default function ProductsClient({
  initialProducts,
  initialCategory,
  initialSort,
  initialSearch,
  initialMinPrice,
  initialMaxPrice
}: {
  initialProducts: Record<string, unknown>[];
  initialCategory: string;
  initialSort: string;
  initialSearch: string;
  initialMinPrice: string;
  initialMaxPrice: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = initialCategory;
  const sort = initialSort;
  const search = initialSearch;
  const minPrice = initialMinPrice;
  const maxPrice = initialMaxPrice;

  const [showFilters, setShowFilters] = useState(false);

  // If we are on /category/[category], we want push to redirect to /products for standard filtering
  const setParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value); else next.delete(key);
    
    // Always route via /products so filters don't mix up with the category route.
    // If the category route sets category, we preserve it by explicitly setting it in URL.
    if (!next.has("category") && category && category !== "All") {
      next.set("category", category);
    }
    
    // Edge case if user selects "All"
    if (key === "category" && !value) {
       next.delete("category");
    }

    router.push(`/products?${next.toString()}`, { scroll: false });
  }, [searchParams, router, category]);

  const applyPriceRange = (min: string, max: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (min) next.set("minPrice", min); else next.delete("minPrice");
    if (max) next.set("maxPrice", max); else next.delete("maxPrice");
    
    if (!next.has("category") && category && category !== "All") {
      next.set("category", category);
    }
    
    router.push(`/products?${next.toString()}`, { scroll: false });
    setShowFilters(false);
  };

  const categories = ["All","Lehenga","Saree","Kurti","Suit","Frock","Kids Wear","Co-ord Set","Ready to Wear","Special"];
  const pageTitle = search ? `Results for "${search}"` : category === "All" ? "Our Collection" : `${category}s`;

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-10 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-royal mb-1">{pageTitle}</h1>
              <p className="text-slate-500 text-sm">{initialProducts.length} exquisite pieces found</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full text-sm font-bold text-slate-700">
                <Filter className="w-4 h-4" /> Filters
              </button>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value)} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-sm font-bold text-slate-700 outline-none focus:border-royal transition-colors">
                <option value="default">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {(search || minPrice || maxPrice || category !== "All") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-royal/10 text-royal rounded-full text-xs font-semibold">Search: &quot;{search}&quot;<button onClick={() => setParam("search", "")}><X className="w-3 h-3" /></button></span>}
              {category !== "All" && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-amber-800 rounded-full text-xs font-semibold">{category}<button onClick={() => setParam("category", "")}><X className="w-3 h-3" /></button></span>}
              {(minPrice || maxPrice) && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">₹{minPrice||"0"} – ₹{maxPrice||"∞"}<button onClick={() => { const n = new URLSearchParams(searchParams.toString()); n.delete("minPrice"); n.delete("maxPrice"); router.push(`/products?${n.toString()}`, {scroll: false}); }}><X className="w-3 h-3" /></button></span>}
            </div>
          )}

          <div className="flex gap-10">
            <aside className="hidden lg:block w-64 shrink-0 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Categories</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setParam("category", cat === "All" ? "" : cat)}
                      className={cn("block w-full text-left text-sm silk-transition hover:translate-x-1", category === cat ? "text-royal font-bold" : "text-slate-500")}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <PriceRangeFilter minPrice={minPrice} maxPrice={maxPrice} onApply={applyPriceRange} />
            </aside>

            <div className="flex-1">
              {initialProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{initialProducts.map((p) => <ProductCard key={p._id as string} product={p} />)}</div>
              ) : (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 italic text-lg">No products found.</p>
                  <button onClick={() => router.push("/products")} className="mt-6 px-6 py-2 bg-royal text-white rounded-full text-sm font-semibold hover:bg-royal/90 transition-colors">Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-serif font-bold text-royal">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => { setParam("category", cat === "All" ? "" : cat); setShowFilters(false); }}
                        className={cn("px-4 py-2 rounded-full text-sm font-bold silk-transition", category === cat ? "bg-royal text-white" : "bg-slate-50 text-slate-600")}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <PriceRangeFilter minPrice={minPrice} maxPrice={maxPrice} onApply={applyPriceRange} />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ShellLayout>
  );
}
