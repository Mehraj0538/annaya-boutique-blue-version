"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Star } from "lucide-react";
import api from "@/lib/api";
import { ProductCard } from "@/components/products/ProductCard";
import ShellLayout from "@/components/ShellLayout";

const testimonials = [
  { name: "Lavanya", duration: "One Year With Us", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Lavanya&backgroundColor=b6e3f4", review: "The kurti I ordered arrived on time, looked exactly like the picture — and was even more beautiful in person! The quality is high and the fit is perfect. Thank you, Annaya Boutique!" },
  { name: "Sravani", duration: "One Year With Us", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sravani&backgroundColor=c0aede", review: "This is my 6th order from Annaya! After seeing and using your outfits, I've completely stopped visiting shops. The quality is amazing and your response is always awesome. Thank you so much!" },
  { name: "Sukanya", duration: "Happy Customer", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sukanya&backgroundColor=ffd5dc", review: "The product looks exactly like the picture. I'm completely satisfied with it. The fabric quality is outstanding and delivery was super fast. Thanks, Annaya Boutique!" },
  { name: "Priya Sharma", duration: "Regular Customer", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Priya&backgroundColor=d1f4cc", review: "Absolutely love the lehenga I ordered for my cousin's wedding! Got so many compliments. The embroidery work is exquisite and packaging was beautiful. Will definitely order again!" },
  { name: "Meena Reddy", duration: "Two Years With Us", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Meena&backgroundColor=ffdfbf", review: "I've been shopping here for two years and never once been disappointed. The customer service is warm and helpful, and every outfit is exactly as shown. Truly a boutique that cares!" },
];

const categories = [
  { name: "Lehenga", img: "https://res.cloudinary.com/douvhybil/image/upload/v1773507187/annaya-boutique/lehengas/ydg4qczdt7hi8cxor4nj.jpg", path: "/category/Lehenga" },
  { name: "Saree", img: "https://res.cloudinary.com/douvhybil/image/upload/v1773508585/annaya-boutique/sarees/utyyz0gnnwmfxwgsqhq3.webp", path: "/category/Saree" },
  { name: "Frock", img: "https://res.cloudinary.com/douvhybil/image/upload/v1772313689/AWP%20Shopping-products/gwgpp5mk9y5pfh174app.jpg", path: "/category/Frock" },
  { name: "Kurti", img: "https://res.cloudinary.com/douvhybil/image/upload/v1773516396/annaya-boutique/kurties/tcyskaimbs9pk3lfmjt9.jpg", path: "/category/Kurti" },
  { name: "Kids Wear", img: "https://res.cloudinary.com/douvhybil/image/upload/v1773541163/annaya-boutique/products/zy0yeykgaukwggjrvfmz.jpg", path: "/products?category=Kids+Wear" },
  { name: "Ready to Wear", img: "https://res.cloudinary.com/douvhybil/image/upload/v1773516363/annaya-boutique/readytowears/vpr1otjdvznug2yoejnb.jpg", path: "/products?category=Ready+to+Wear" },
];

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Record<string, unknown>[]>([]);
  const [newArrivals, setNewArrivals] = useState<Record<string, unknown>[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lehRes, frockRes] = await Promise.all([
          api.get("/api/products?category=Lehenga&sort=rating"),
          api.get("/api/products?category=Frock&sort=rating"),
        ]);
        const combined = [
          ...(Array.isArray(lehRes.data) ? lehRes.data.slice(0, 4) : []),
          ...(Array.isArray(frockRes.data) ? frockRes.data.slice(0, 4) : []),
        ];
        setBestSellers(combined.slice(0, 8));
      } catch { /* ignore */ }
      try {
        const newRes = await api.get("/api/products/new-arrivals");
        if (Array.isArray(newRes.data)) setNewArrivals(newRes.data);
      } catch { /* ignore */ }
    };
    fetchData();
  }, []);

  const prevT = () => setCurrentTestimonial((p) => (p === 0 ? testimonials.length - 1 : p - 1));
  const nextT = () => setCurrentTestimonial((p) => (p === testimonials.length - 1 ? 0 : p + 1));

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-0">
        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-royal">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-gold/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-sky/20 rounded-full blur-[100px]" />
          <div className="relative z-10 max-w-4xl mx-auto py-10 px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold tracking-[3px] uppercase mb-8">
              New Collection 2026
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
              Elegance <span className="text-gold">Redefined.</span><br />Crafted for You.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Discover our curated collection of ethnic and western wear — where tradition meets modern luxury.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-gold text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-center">
                Explore Collections
              </Link>
            </motion.div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3 text-white/60 text-sm"><ShieldCheck className="w-5 h-5 text-gold" /> 3-4 Days Delivery</div>
              <div className="flex items-center gap-3 text-white/60 text-sm"><ShieldCheck className="w-5 h-5 text-gold" /> 100% Safe &amp; Secure</div>
              <div className="flex items-center gap-3 text-white/60 text-sm"><RefreshCw className="w-5 h-5 text-gold" /> Easy Returns</div>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-royal mb-4">Shop by Category</h2>
            <div className="w-16 h-1 bg-gold rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.path} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-royal/90 via-transparent to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-serif font-bold text-lg">{cat.name}</h3>
                  <span className="text-white/60 text-[10px] uppercase tracking-widest">Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-royal mb-4">New Arrivals</h2>
                <div className="w-16 h-1 bg-gold rounded-full" />
              </div>
              <Link href="/products" className="text-royal font-bold text-sm flex items-center gap-2 hover:text-sapphire transition-colors">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
              {newArrivals.map((product) => (
                <div key={product._id as string} className="min-w-[280px] md:min-w-[300px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-royal mb-4">Best Sellers</h2>
            <div className="w-16 h-1 bg-gold rounded-full" />
            <p className="text-slate-500 mt-4 text-center max-w-md">Our most-loved Lehengas &amp; Frocks — chosen by thousands of women across India.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => <ProductCard key={product._id as string} product={product} />)}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-royal text-white font-bold rounded-full hover:bg-royal/90 transition-all">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-start justify-between mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-royal leading-tight">Client&apos;s Feedback <br />&amp; Trust</h2>
              <div className="flex gap-2 mt-2 shrink-0">
                <button onClick={prevT} className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center hover:bg-royal/80 transition-colors shadow-md"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={nextT} className="w-10 h-10 rounded-full border-2 border-slate-200 text-slate-400 flex items-center justify-center hover:border-royal hover:text-royal transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((offset) => {
                const idx = (currentTestimonial + offset) % testimonials.length;
                const t = testimonials[idx];
                return (
                  <motion.div key={`${idx}-${offset}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: offset * 0.05 }}
                    className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 ${offset === 0 ? "ring-1 ring-royal/10" : ""}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full border-2 border-slate-100 bg-slate-50" />
                        <div><p className="font-bold text-slate-800 text-sm">{t.name}</p><p className="text-xs text-slate-400">{t.duration}</p></div>
                      </div>
                      <div className="text-4xl font-serif font-black text-gold/30 leading-none select-none">❝</div>
                    </div>
                    <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}</div>
                    <p className="text-slate-600 text-sm leading-relaxed">&quot;{t.review}&quot;</p>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? "bg-royal w-5" : "bg-slate-300"}`} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
