export const dynamic = "force-static";

import Link from "next/link";
import { Shield, Truck, RefreshCw, Heart } from "lucide-react";
import ShellLayout from "@/components/ShellLayout";

export default function AboutPage() {
  return (
    <ShellLayout>
      <div className="min-h-screen bg-slate-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal mb-6">Our Story</h1>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto mb-6" />
            <p className="text-slate-600 text-lg leading-relaxed">Welcome to Annaya Boutique, your premier destination for exquisite ethnic and contemporary fashion. Born from a passion for preserving traditional craftsmanship while embracing modern aesthetics, we bring you curated collections that celebrate the beauty of Indian wear.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {[{ title: "Our Vision", color: "royal", desc: "To be the most trusted and preferred ethnic fashion brand, recognized globally for our impeccable quality, authentic designs, and commitment to customer satisfaction. We aim to make luxury fashion accessible and enjoyable for every occasion." },
              { title: "Our Mission", color: "gold", desc: "To curate and create timeless wardrobe staples that empower our customers to express their unique style with confidence. We are dedicated to providing an exceptional shopping experience from discovery to delivery." }
            ].map(({ title, color, desc }) => (
              <div key={title} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-full blur-3xl group-hover:bg-${color}/10 transition-colors`} />
                <h2 className="text-2xl font-serif font-bold text-royal mb-4 relative z-10">{title}</h2>
                <p className="text-slate-600 leading-relaxed relative z-10">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-royal mb-4">Why Choose Us</h2>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[{ icon: Shield, title: "Premium Quality", desc: "Finest fabrics and meticulous craftsmanship in every piece." },
              { icon: Heart, title: "Curated Designs", desc: "Exclusive collections carefully selected for modern tastes." },
              { icon: Truck, title: "Fast Delivery", desc: "Reliable and swift shipping across all regions." },
              { icon: RefreshCw, title: "Easy Returns", desc: "Hassle-free return capabilities for a smooth experience." }
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl text-center border border-slate-100 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-royal/5 text-royal rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-royal group-hover:text-white transition-all"><Icon className="w-6 h-6" /></div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-royal rounded-[40px] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 relative z-10">Ready to explore our collections?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 relative z-10">Discover the perfect outfit for your next special occasion. From stunning Lehengas to elegant Kurtis, find exactly what you&apos;re looking for.</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-gold text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 relative z-10">Shop Now</Link>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
