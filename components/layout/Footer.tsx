"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const categories = [
  { name: "Lehenga", path: "/category/Lehenga" },
  { name: "Saree", path: "/category/Saree" },
  { name: "Kurti", path: "/category/Kurti" },
  { name: "Frock", path: "/category/Frock" },
  { name: "Suit", path: "/category/Suit" },
  { name: "Co-ord Set", path: "/category/Co-ord+Set" },
  { name: "Ready to Wear", path: "/category/Ready+to+Wear" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Shop All", path: "/products" },
  { name: "New Arrivals", path: "/products?sort=newest" },
  { name: "Best Sellers", path: "/products?sort=rating" },
  { name: "My Wishlist", path: "/wishlist" },
  { name: "My Orders", path: "/profile" },
];

export function Footer() {
  return (
    <footer className="bg-royal text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-flex flex-col mb-5">
            <span className="font-serif text-2xl font-bold text-gold tracking-tight">Annaya</span>
            <span className="text-[10px] text-white/60 tracking-[3px] -mt-1 uppercase">Boutique</span>
          </Link>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Bringing you the finest in ethnic &amp; contemporary Indian fashion — crafted with love, delivered with care.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/annaya_boutiique/" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/annayaboutique" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://wa.me/917494954286" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-500 flex items-center justify-center transition-colors" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">Categories</h4>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat.name}><Link href={cat.path} className="text-white/60 text-sm hover:text-gold transition-colors">{cat.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.name}><Link href={link.path} className="text-white/60 text-sm hover:text-gold transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li><a href="tel:+917494954286" className="flex items-start gap-3 text-white/60 text-sm hover:text-gold transition-colors"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-gold/70" />+91 74949 54286</a></li>
            <li><a href="mailto:ananyaboutqiue9495@gmail.com" className="flex items-start gap-3 text-white/60 text-sm hover:text-gold transition-colors"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-gold/70" />ananyaboutqiue9495@gmail.com</a></li>
            <li><span className="flex items-start gap-3 text-white/60 text-sm"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold/70" />Mumbai, Maharashtra, India</span></li>
          </ul>
          <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Business Hours</p>
            <p className="text-sm text-white/80 font-medium">Mon – Sun: 7am – 10pm</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Annaya Boutique. All rights reserved.</p>
          <p>Made by Mohammed Mehraj in Hyderabad</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
