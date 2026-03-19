"use client";

import Link from "next/link";
import { ShoppingBag, Heart, MessageCircle, Phone, Mail, Instagram } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatCurrency } from "@/lib/utils";
import ShellLayout from "@/components/ShellLayout";

export default function ProfilePage() {
  const cart = useCartStore((s) => s.cart);
  const wishlist = useWishlistStore((s) => s.wishlist);
  const total = useCartStore((s) => s.getTotal());

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-10 pt-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="bg-royal rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden mb-10">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/10 border-4 border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold font-serif text-gold">
                A
              </div>
              <h1 className="text-2xl font-serif font-bold mb-1">
                Welcome to Annaya Boutique
              </h1>
              <p className="text-white/60 text-sm">
                Your fashion destination
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link
              href="/cart"
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-royal/5 text-royal rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-royal">{cart.length}</p>
                <p className="text-xs text-slate-500 font-medium">
                  Items in Cart
                </p>
                {cart.length > 0 && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    {formatCurrency(total)}
                  </p>
                )}
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-royal">
                  {wishlist.length}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Saved Items
                </p>
              </div>
            </Link>
          </div>

          {/* Contact us */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-6">
            <h2 className="text-lg font-serif font-bold text-royal mb-6">
              Need Help? Contact Us
            </h2>
            <div className="space-y-4">
              <a
                href="https://wa.me/917494954286"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    WhatsApp us
                  </p>
                  <p className="text-xs text-slate-500">
                    +91 74949 54286 · Fastest response
                  </p>
                </div>
              </a>

              <a
                href="tel:+917494954286"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-royal/10 text-royal rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Call Us</p>
                  <p className="text-xs text-slate-500">
                    Mon – Sun: 7am – 10pm
                  </p>
                </div>
              </a>

              <a
                href="mailto:ananyaboutqiue9495@gmail.com"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-royal/10 text-royal rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Email Us</p>
                  <p className="text-xs text-slate-500">
                    ananyaboutqiue9495@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/annaya_boutiique/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-royal/10 text-royal rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Instagram</p>
                  <p className="text-xs text-slate-500">
                    @annaya_boutiique
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Browse All Products", href: "/products" },
              { label: "New Arrivals", href: "/products?sort=newest" },
              { label: "About Us", href: "/about" },
              { label: "Contact Page", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 px-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-royal text-center hover:bg-royal hover:text-white transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
