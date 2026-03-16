"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, Loader2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, getWhatsAppLink } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import ShellLayout from "@/components/ShellLayout";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, getTotal, getItemCount, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const [addresses, setAddresses] = useState<Record<string, unknown>[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "", deliveryNotes: "", isDefault: false });

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      setIsLoadingAddresses(true);
      api.get(`/api/users/me?auth0Id=${user.sub}`)
        .then((res) => {
          if (res.data?.addresses) {
            setAddresses(res.data.addresses);
            const def = res.data.addresses.find((a: Record<string, unknown>) => a.isDefault);
            if (def) setSelectedAddressId(def._id as string);
            else if (res.data.addresses.length > 0) setSelectedAddressId(res.data.addresses[0]._id as string);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingAddresses(false));
    }
  }, [isAuthenticated, user]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        if (res.data?.address) {
          const addr = res.data.address;
          setAddressForm((prev) => ({ ...prev, city: addr.city || addr.town || addr.village || "", state: addr.state || "", postalCode: addr.postcode || "", country: addr.country || "" }));
        }
      } catch {} finally { setIsLocating(false); }
    }, () => { setIsLocating(false); alert("Could not get your location."); });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.sub) return;
    setIsSavingAddress(true);
    try {
      const res = await api.put("/api/users/address", { auth0Id: user.sub, address: addressForm });
      setAddresses(res.data);
      const last = res.data[res.data.length - 1];
      if (last) setSelectedAddressId(last._id as string);
      setIsAddressModalOpen(false);
      setAddressForm({ fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "", deliveryNotes: "", isDefault: false });
    } catch { toast.error("Failed to save address."); }
    finally { setIsSavingAddress(false); }
  };

  if (cart.length === 0) return (
    <ShellLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20">
        <div className="w-24 h-24 bg-sky/10 rounded-full flex items-center justify-center mb-6"><ShoppingBag className="w-10 h-10 text-sky" /></div>
        <h2 className="text-3xl font-serif font-bold text-royal mb-4">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-xs">Looks like you haven&apos;t added anything yet. Explore our beautiful collection!</p>
        <Link href="/products" className="px-8 py-4 bg-royal text-white font-bold rounded-full hover:shadow-lg transition-all">Start Shopping</Link>
      </div>
    </ShellLayout>
  );

  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = subtotal > 2000 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const waItems = cart.map((i) => `*${i.name}*\nSize: ${i.size}\nColor: ${i.color}\nPrice: ${formatCurrency(i.price)}\nQty: ${i.qty}\nSubtotal: ${formatCurrency(i.price * i.qty)}`).join("\n\n");
  const waMessage = `Hello!\n\nI'm interested in ordering the following items:\n\n${waItems}\n\n*Total: ${formatCurrency(total)}*\n\nIs this available?`;

  const handlePayment = async () => {
    if (!isAuthenticated) { loginWithRedirect({ appState: { returnTo: "/cart" } }); return; }
    setIsPaymentModalOpen(true);
  };

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-10 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-royal mb-10">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div key={`${item.id}-${item.size}-${item.color}`} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 shadow-sm">
                    <div className="w-24 aspect-[4/5] rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Size: {item.size} • Color: {item.color}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                          <button onClick={() => updateQty(item.id, item.size, item.color, Math.max(1, item.qty - 1))} className="p-2 hover:bg-slate-100 text-royal"><Minus className="w-3 h-3" /></button>
                          <span className="px-4 text-sm font-bold text-slate-900">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)} className="p-2 hover:bg-slate-100 text-royal"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-bold text-royal">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Link href="/products" className="inline-flex items-center gap-2 text-royal font-bold text-sm mt-4 hover:underline">
                <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {isAuthenticated && (
                <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-royal/5">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold text-royal flex items-center gap-2"><MapPin className="w-5 h-5 text-sapphire" /> Delivery</h2>
                    <button onClick={() => setIsAddressModalOpen(true)} className="text-sm font-bold text-sapphire hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add New</button>
                  </div>
                  {isLoadingAddresses ? (
                    <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-royal" /></div>
                  ) : addresses.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {addresses.map((addr) => (
                        <label key={addr._id as string} className={cn("flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-colors", selectedAddressId === addr._id ? "border-royal bg-royal/5" : "border-slate-100 hover:border-royal/30")}>
                          <div className="pt-1"><input type="radio" name="delivery_address" checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id as string)} className="w-4 h-4 text-royal focus:ring-royal" /></div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 text-sm mb-1">{addr.fullName as string}</p>
                            <p className="text-xs text-slate-600 leading-relaxed mb-1">{addr.addressLine1 as string}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />{addr.city as string}, {addr.state as string} {addr.postalCode as string}</p>
                            <p className="text-xs text-slate-500">{addr.phoneNumber as string}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-sm font-bold text-slate-500 mb-2">No Saved Addresses</p>
                      <p className="text-xs text-slate-400 max-w-[200px] mx-auto">Add an address to proceed with checkout.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-royal/5 sticky top-24">
                <h2 className="text-xl font-serif font-bold text-royal mb-6">Order Summary</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-slate-500"><span>Subtotal ({getItemCount()} items)</span><span>{formatCurrency(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount (10%)</span><span>-{formatCurrency(discount)}</span></div>}
                  <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-lg font-bold text-royal"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>
                <div className="mt-8 space-y-4">
                  <button onClick={handlePayment} disabled={isProcessing || (isAuthenticated && !selectedAddressId && addresses.length > 0) || (isAuthenticated && addresses.length === 0)}
                    className="w-full py-4 bg-royal text-white font-bold rounded-2xl hover:bg-sapphire silk-transition shadow-lg shadow-royal/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay with Razorpay"}
                  </button>
                  <button onClick={() => window.open(getWhatsAppLink(waMessage), "_blank")} className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 silk-transition flex items-center justify-center gap-3">
                    <MessageCircle className="w-5 h-5" /> Order via WhatsApp
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <ShoppingBag className="w-3 h-3" /> 100% Secure &amp; Safe Checkout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-royal/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6"><MessageCircle className="w-10 h-10 text-amber-500" /></div>
                <h2 className="text-2xl font-serif font-bold text-royal mb-4">Online Payment Unavailable</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">We&apos;re currently experiencing issues with our online payment gateway.<br /><br />Please complete your order via <strong>WhatsApp</strong>. Our team will assist you.</p>
                <div className="space-y-3">
                  <button onClick={() => { window.open(getWhatsAppLink(waMessage), "_blank"); setIsPaymentModalOpen(false); }}
                    className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 silk-transition flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20">
                    <MessageCircle className="w-5 h-5" /> Order via WhatsApp
                  </button>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Close</button>
                </div>
              </div>
              <div className="bg-slate-50 py-4 px-8 border-t border-slate-100 flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Personalized Service via WhatsApp</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Address Modal */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-royal/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold text-royal">Add New Address</h2>
                <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <button type="button" onClick={handleGetLocation} disabled={isLocating} className="w-full mb-6 flex items-center gap-3 p-4 bg-sapphire/5 rounded-2xl border border-sapphire/10 text-sm font-bold text-sapphire hover:bg-sapphire/10 transition-colors disabled:opacity-50">
                  {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {isLocating ? "Locating..." : "Auto-fill from Current Location"}
                </button>
                <form onSubmit={handleSaveAddress} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[["Full Name", "fullName", "text"], ["Phone Number", "phoneNumber", "tel"]].map(([label, field, type]) => (
                      <div key={field} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label} *</label>
                        <input required type={type} value={(addressForm as Record<string, unknown>)[field] as string} onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire" />
                      </div>
                    ))}
                  </div>
                  {[["Address Line 1", "addressLine1", true], ["Address Line 2 (Optional)", "addressLine2", false]].map(([label, field, req]) => (
                    <div key={field as string} className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label as string}</label>
                      <input required={req as boolean} type="text" value={(addressForm as Record<string, unknown>)[field as string] as string} onChange={(e) => setAddressForm({ ...addressForm, [field as string]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[["City", "city", 2], ["State", "state", 2], ["Postal Code", "postalCode", 2], ["Country", "country", 2]].map(([label, field, span]) => (
                      <div key={field as string} className={`space-y-1 md:col-span-${span}`}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label as string} *</label>
                        <input required type="text" value={(addressForm as Record<string, unknown>)[field as string] as string} onChange={(e) => setAddressForm({ ...addressForm, [field as string]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire" />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" disabled={isSavingAddress} className="px-8 py-3 bg-royal text-white font-bold rounded-xl hover:bg-sapphire transition-colors shadow-lg shadow-royal/20 flex items-center gap-2 disabled:opacity-70">
                      {isSavingAddress && <Loader2 className="w-4 h-4 animate-spin" />} Save Address
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ShellLayout>
  );
}
