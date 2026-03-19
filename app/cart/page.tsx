"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, getWhatsAppLink } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ShellLayout from "@/components/ShellLayout";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, getTotal, getItemCount } =
    useCartStore();
  const [ordering, setOrdering] = useState(false);

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <ShellLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20">
          <div className="w-24 h-24 bg-sky/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-sky" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-royal mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-slate-500 mb-8 text-center max-w-xs">
            Looks like you haven&apos;t added anything yet. Explore our
            beautiful collection!
          </p>
          <Link
            href="/products"
            className="px-8 py-4 bg-royal text-white font-bold rounded-full hover:shadow-lg transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </ShellLayout>
    );
  }

  // ─── Totals ───────────────────────────────────────────────────────────────
  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // ─── WhatsApp message ─────────────────────────────────────────────────────
  const waLines = cart
    .map(
      (i) =>
        `*${i.name}*\nSize: ${i.size} | Color: ${i.color} | Qty: ${i.qty}\nPrice: ${formatCurrency(i.price * i.qty)}`
    )
    .join("\n\n");

  const waMessage = [
    "Hello! I'd like to place an order:\n",
    waLines,
    shipping === 0
      ? "\n✅ Free shipping applies (order above ₹999)"
      : `\n🚚 Shipping: ${formatCurrency(shipping)}`,
    `\n*Total: ${formatCurrency(total)}*`,
    "\nPlease confirm availability and share payment details. Thank you!",
  ]
    .filter(Boolean)
    .join("\n");

  const handleWhatsAppOrder = () => {
    setOrdering(true);
    window.open(getWhatsAppLink(waMessage), "_blank");
    setTimeout(() => setOrdering(false), 2000);
  };

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-10 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-royal mb-10">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Cart items ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 shadow-sm"
                  >
                    <div className="w-24 aspect-[4/5] rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.size, item.color)
                            }
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Size: {item.size} • Color: {item.color}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                          <button
                            onClick={() =>
                              updateQty(
                                item.id,
                                item.size,
                                item.color,
                                Math.max(1, item.qty - 1)
                              )
                            }
                            className="p-2 hover:bg-slate-100 text-royal"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 text-sm font-bold text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(
                                item.id,
                                item.size,
                                item.color,
                                item.qty + 1
                              )
                            }
                            className="p-2 hover:bg-slate-100 text-royal"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-royal">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-royal font-bold text-sm mt-4 hover:underline"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
              </Link>
            </div>

            {/* ── Order summary ───────────────────────────────────────────── */}
            <div className="sticky top-24">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-royal/5">
                <h2 className="text-xl font-serif font-bold text-royal mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-600 font-bold" : ""}>
                      {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-slate-400">
                      Add {formatCurrency(1000 - subtotal)} more for free shipping
                    </p>
                  )}
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-lg font-bold text-royal">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={ordering}
                  className="mt-8 w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 silk-transition flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                >
                  <MessageCircle className="w-5 h-5" />
                  {ordering ? "Opening WhatsApp…" : "Order via WhatsApp"}
                </button>

                <p className="mt-4 text-center text-[11px] text-slate-400 leading-relaxed">
                  Tap above to send your order details to us on WhatsApp.
                  We&apos;ll confirm availability &amp; guide you through
                  payment.
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <ShoppingBag className="w-3 h-3" /> Secure &amp; Personalised
                  Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
