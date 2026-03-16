"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, Settings, ChevronRight, LogOut, Loader2, Plus, X, ArrowLeft, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import api from "@/lib/api";
import ShellLayout from "@/components/ShellLayout";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { user, isAuthenticated, isLoading, logout, loginWithRedirect } = useAuth0();
  const [dbUser, setDbUser] = useState<Record<string, unknown> | null>(null);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Record<string, unknown> | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "", deliveryNotes: "", isDefault: false });

  const tabs = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    if (!isAuthenticated || !user?.sub) return;
    setIsSyncing(true);
    Promise.all([
      api.get(`/api/users/orders?auth0Id=${user.sub}`),
      api.get(`/api/users/me?auth0Id=${user.sub}`),
    ]).then(([ordersRes, profileRes]) => {
      setOrders(ordersRes.data);
      setDbUser(profileRes.data);
    }).catch(() => {}).finally(() => setIsSyncing(false));
  }, [isAuthenticated, user]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`, { headers: { "Accept-Language": "en" } });
        if (res.data?.address) {
          const a = res.data.address;
          setAddressForm((prev) => ({ ...prev, city: a.city || a.town || a.village || "", state: a.state || "", postalCode: a.postcode || "", country: a.country || "" }));
        }
      } catch {} finally { setIsLocating(false); }
    }, () => setIsLocating(false));
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.sub) return;
    setIsSavingAddress(true);
    try {
      const res = await api.put("/api/users/address", { auth0Id: user.sub, address: addressForm });
      setDbUser((prev) => prev ? { ...prev, addresses: res.data } : prev);
      setIsAddressModalOpen(false);
      setAddressForm({ fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "", deliveryNotes: "", isDefault: false });
    } catch { alert("Failed to save address."); }
    finally { setIsSavingAddress(false); }
  };

  if (isLoading || isSyncing) return (
    <ShellLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-royal animate-spin mb-4" />
        <p className="text-royal font-bold">Loading profile...</p>
      </div>
    </ShellLayout>
  );

  if (!isAuthenticated || !user) return (
    <ShellLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="w-24 h-24 bg-sky/10 rounded-full flex items-center justify-center mb-6"><User className="w-10 h-10 text-sky" /></div>
        <h2 className="text-3xl font-serif font-bold text-royal mb-4">You are not logged in</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Log in to view your orders, saved addresses, and manage your account.</p>
        <button onClick={() => loginWithRedirect()} className="px-8 py-4 bg-royal text-white font-bold rounded-full hover:shadow-lg transition-all">Log In / Sign Up</button>
      </div>
    </ShellLayout>
  );

  const STATUS_COLORS: Record<string, string> = { Delivered: "bg-emerald-100 text-emerald-600", Cancelled: "bg-rose-100 text-rose-600", Shipped: "bg-blue-100 text-blue-600", Processing: "bg-amber-100 text-amber-600" };

  return (
    <ShellLayout>
      <div className="pb-20 lg:pb-10 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-royal rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden mb-10">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white/20 object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-3xl font-bold font-serif">{user.name?.charAt(0).toUpperCase() || "U"}</div>
              )}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold mb-2">{user.name}</h1>
                <p className="text-white/70 text-sm">{user.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Verified Member</div>
              </div>
              <button onClick={() => logout({ logoutParams: { returnTo: typeof window !== "undefined" ? window.location.origin : "" } })} className="md:ml-auto p-4 bg-white/10 hover:bg-white/20 rounded-2xl silk-transition flex items-center gap-2">
                <LogOut className="w-5 h-5" /><span className="font-bold text-sm hidden md:block">Log Out</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn("flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold silk-transition whitespace-nowrap", activeTab === tab.id ? "bg-royal text-white shadow-lg shadow-royal/20" : "bg-white text-slate-500 border border-slate-100 hover:border-royal")}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <>
              {selectedOrder ? (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
                    <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-slate-500 hover:text-royal font-bold transition-colors"><ArrowLeft className="w-5 h-5" /> Back to Orders</button>
                    <span className="text-xs font-mono font-bold text-slate-400">ORDER #{(selectedOrder._id as string).substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="p-6 md:p-8">
                    {/* Status Timeline */}
                    <div className="mb-12">
                      <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Order Status</h4>
                      {selectedOrder.status === "Cancelled" ? (
                        <div className="flex items-center gap-4 bg-rose-50 p-6 rounded-2xl border border-rose-100">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500 shrink-0"><XCircle className="w-6 h-6" /></div>
                          <div><h5 className="font-bold text-rose-700 text-lg">Order Cancelled</h5><p className="text-sm text-rose-600/80 mt-1">This order has been cancelled.</p></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full hidden sm:block" />
                          <div className="absolute top-1/2 left-0 h-1.5 bg-emerald-400 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-1000 ease-out" style={{ width: selectedOrder.status === "Delivered" ? "100%" : selectedOrder.status === "Shipped" ? "50%" : "0%" }} />
                          <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                            {[{ label: "Processing", icon: Clock, done: true }, { label: "Shipped", icon: Truck, done: selectedOrder.status !== "Processing" }, { label: "Delivered", icon: CheckCircle, done: selectedOrder.status === "Delivered" }].map((step) => (
                              <div key={step.label} className="flex sm:flex-col items-center gap-4 sm:gap-2 text-center">
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors border-4 shrink-0",
                                  selectedOrder.status === step.label ? "bg-royal text-white border-white shadow-royal/30 ring-4 ring-royal/10" : step.done ? "bg-emerald-500 text-white border-white shadow-emerald-500/20" : "bg-white text-slate-200 border-slate-50")}>
                                  <step.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left sm:text-center mt-1">
                                  <p className={cn("text-sm font-bold", step.done ? "text-slate-900" : "text-slate-400")}>{step.label}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Address & Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h4>
                        <div className="bg-slate-50/80 p-5 rounded-2xl">
                          <p className="font-bold text-slate-900 mb-1">{(selectedOrder.shippingAddress as Record<string, string>)?.fullName}</p>
                          <p className="text-sm text-slate-500 mb-3">{(selectedOrder.shippingAddress as Record<string, string>)?.phoneNumber}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{(selectedOrder.shippingAddress as Record<string, string>)?.addressLine1}<br />{(selectedOrder.shippingAddress as Record<string, string>)?.city}, {(selectedOrder.shippingAddress as Record<string, string>)?.state} — {(selectedOrder.shippingAddress as Record<string, string>)?.postalCode}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Order Summary</h4>
                        <div className="bg-slate-50/80 p-5 rounded-2xl space-y-3">
                          <div className="flex justify-between text-sm"><span className="text-slate-500">Date Placed</span><span className="font-bold text-slate-900">{new Date(selectedOrder.createdAt as string).toLocaleDateString()}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-slate-500">Payment</span><span className="font-bold text-slate-900 capitalize">{selectedOrder.paymentMethod as string}</span></div>
                          <div className="pt-3 mt-3 border-t border-slate-200/60 flex justify-between items-center"><span className="font-bold text-slate-900">Total Paid</span><span className="text-xl font-bold text-royal">₹{selectedOrder.totalAmount as number}</span></div>
                        </div>
                      </div>
                    </div>
                    {/* Items */}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Items in Order</h4>
                    <div className="space-y-4">
                      {(selectedOrder.items as Record<string, unknown>[])?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-slate-100">
                          <img src={item.image as string} alt={item.name as string} className="w-20 h-24 object-cover rounded-xl" />
                          <div className="flex-1">
                            <h5 className="font-bold text-slate-900 text-lg leading-tight mb-1">{item.name as string}</h5>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                              <span>Size: <strong className="text-slate-700">{item.size as string}</strong></span>
                              <span>Qty: <strong className="text-slate-700">{item.qty as number}</strong></span>
                            </div>
                            <div className="font-bold text-royal">₹{item.price as number} each</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id as string} onClick={() => setSelectedOrder(order)}
                    className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-royal/30 hover:shadow-md cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-royal transition-colors">Order #{(order._id as string).substring(0, 8).toUpperCase()}</span>
                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider", STATUS_COLORS[order.status as string] || STATUS_COLORS.Processing)}>{order.status as string}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{new Date(order.createdAt as string).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-600">{(order.items as Record<string, unknown>[]).map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                      <span className="text-lg font-bold text-royal">₹{order.totalAmount as number}</span>
                      <button className="p-3 bg-slate-50 group-hover:bg-royal group-hover:text-white rounded-xl silk-transition"><ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                  <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">You haven&apos;t placed any orders yet.</p>
                </div>
              )}
            </>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif font-bold text-royal">Saved Addresses</h3>
                <button onClick={() => setIsAddressModalOpen(true)} className="text-sm font-bold text-sapphire hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add New</button>
              </div>
              <div className="space-y-4">
                {(dbUser?.addresses as Record<string, unknown>[])?.length > 0 ? (
                  (dbUser!.addresses as Record<string, unknown>[]).map((addr) => (
                    <div key={addr._id as string} className={cn("p-6 rounded-2xl border-2 relative", addr.isDefault ? "border-royal bg-royal/5" : "border-slate-100")}>
                      {addr.isDefault && <div className="absolute top-4 right-4 text-[10px] font-bold text-royal bg-white px-2 py-1 rounded-full border border-royal/20">DEFAULT</div>}
                      <p className="font-bold text-slate-900 mb-1">{addr.fullName as string}</p>
                      <p className="text-sm text-slate-500 mb-3">{addr.phoneNumber as string}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{addr.addressLine1 as string}<br />{addr.city as string}, {addr.state as string} — {addr.postalCode as string}<br />{addr.country as string}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No addresses saved yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-lg font-serif font-bold text-royal mb-6">Account Settings</h3>
                <div className="space-y-6">
                  {[["Full Name", user.name], ["Email Address", user.email]].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-4 border-b border-slate-50">
                      <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p><p className="font-bold text-slate-900">{value}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full py-4 bg-rose-50 text-rose-500 font-bold rounded-2xl hover:bg-rose-100 silk-transition">Delete Account</button>
            </div>
          )}
        </div>

        {/* Address Modal */}
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
                    {[["Full Name", "fullName"], ["Phone Number", "phoneNumber"]].map(([label, field]) => (
                      <div key={field} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label} *</label>
                        <input required type="text" value={(addressForm as Record<string, unknown>)[field] as string} onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire" />
                      </div>
                    ))}
                  </div>
                  {[["Address Line 1 *", "addressLine1", true], ["Address Line 2 (Optional)", "addressLine2", false]].map(([label, field, req]) => (
                    <div key={field as string} className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label as string}</label>
                      <input required={req as boolean} type="text" value={(addressForm as Record<string, unknown>)[field as string] as string} onChange={(e) => setAddressForm({ ...addressForm, [field as string]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-5">
                    {[["City", "city"], ["State", "state"], ["Postal Code", "postalCode"], ["Country", "country"]].map(([label, field]) => (
                      <div key={field} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label} *</label>
                        <input required type="text" value={(addressForm as Record<string, unknown>)[field] as string} onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire" />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                    <button type="submit" disabled={isSavingAddress} className="px-8 py-3 bg-royal text-white font-bold rounded-xl hover:bg-sapphire shadow-lg shadow-royal/20 flex items-center gap-2 disabled:opacity-70">
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
