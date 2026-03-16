"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Package, Users, Plus, Edit, Trash2, ArrowLeft, MapPin, Clock, Truck, CheckCircle, XCircle, LogOut, TrendingUp, X, Mail, Phone, ShoppingBag, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { useAuth0 } from "@auth0/auth0-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import ShellLayout from "@/components/ShellLayout";

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Shipped: "bg-sky-50 text-sky-600 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  Processing: "bg-amber-50 text-amber-600 border-amber-100",
};

function CustomerTab({ usersList, adminAuthId }: { usersList: Record<string, unknown>[]; adminAuthId: string }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Record<string, unknown> | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Record<string, unknown>[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleSelectCustomer = async (u: Record<string, unknown>) => {
    setSelectedCustomer(u); setCustomerOrders([]); setOrdersLoading(true);
    try {
      const res = await api.get(`/api/admin/users/${u._id}/orders`, { headers: { "x-auth0-id": adminAuthId } });
      setCustomerOrders(Array.isArray(res.data) ? res.data : []);
    } catch { setCustomerOrders([]); } finally { setOrdersLoading(false); }
  };

  const totalSpent = customerOrders.filter((o) => o.status !== "Cancelled").reduce((sum, o) => sum + (o.totalAmount as number || 0), 0);

  if (selectedCustomer) {
    const u = selectedCustomer;
    return (
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <button onClick={() => { setSelectedCustomer(null); setCustomerOrders([]); }} className="flex items-center gap-2.5 text-slate-500 hover:text-royal font-bold transition-all hover:-translate-x-1"><ArrowLeft className="w-5 h-5" /> Back to Customers</button>
          <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">#{(u._id as string).substring((u._id as string).length - 12).toUpperCase()}</span>
        </div>
        <div className="p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-10 border-b border-slate-100">
            <div className="shrink-0">
              {u.picture ? <img src={u.picture as string} alt={u.name as string} className="w-20 h-20 rounded-[24px] border-2 border-slate-100 shadow-lg" /> : <div className="w-20 h-20 rounded-[24px] bg-royal text-gold flex items-center justify-center font-black text-3xl border-2 border-royal/20 shadow-lg">{(u.name as string)?.charAt(0).toUpperCase() || "U"}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{u.name as string}</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium"><Mail className="w-3.5 h-3.5 text-royal/60" />{u.email as string}</span>
                {u.phone && <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium"><Phone className="w-3.5 h-3.5 text-royal/60" />{u.phone as string}</span>}
              </div>
              <span className={cn("mt-3 inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset", u.role === "admin" ? "bg-royal text-gold ring-gold/20" : "bg-slate-100 text-slate-500 ring-slate-200")}>{u.role as string || "Customer"}</span>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="text-center px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-3xl font-bold text-royal">{customerOrders.length}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Orders</p></div>
              <div className="text-center px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-xl font-bold text-emerald-600">{formatCurrency(totalSpent)}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total Spent</p></div>
            </div>
          </div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-royal" /> Order History</h4>
          {ordersLoading ? <div className="flex items-center justify-center gap-3 py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" />Fetching orders…</div>
            : customerOrders.length === 0 ? <div className="py-16 text-center text-slate-400"><ShoppingBag className="w-12 h-12 mx-auto mb-4 text-slate-200" /><p className="font-medium">No orders placed yet.</p></div>
            : <div className="space-y-4">{customerOrders.map((order) => (
                <div key={order._id as string} className="bg-slate-50 rounded-[28px] border border-slate-100 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
                    <div><p className="font-mono text-[11px] text-slate-400 font-bold uppercase tracking-widest">#{(order._id as string).substring((order._id as string).length - 12).toUpperCase()}</p><p className="text-xs text-slate-500 mt-0.5 font-medium">{new Date(order.createdAt as string).toLocaleDateString()}</p></div>
                    <div className="flex items-center gap-3"><span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border", STATUS_STYLES[order.status as string] || STATUS_STYLES.Processing)}>{order.status as string}</span><span className="text-lg font-bold text-royal">{formatCurrency(order.totalAmount as number)}</span></div>
                  </div>
                </div>
              ))}</div>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50"><h3 className="text-2xl font-bold text-slate-900">CRM — Customer Relations</h3><p className="text-sm text-slate-500 mt-1 font-medium italic">{usersList.length} registered profiles · Click any row to see full details</p></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]"><tr><th className="px-8 py-5">Profile</th><th className="px-8 py-5">Communication</th><th className="px-8 py-5">Joined</th><th className="px-8 py-5 text-right">Role</th></tr></thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {usersList.map((u) => (
              <tr key={u._id as string} className="hover:bg-royal/5 transition-colors cursor-pointer group" onClick={() => handleSelectCustomer(u)}>
                <td className="px-8 py-6"><div className="flex items-center gap-5">{u.picture ? <img src={u.picture as string} alt={u.name as string} className="w-12 h-12 rounded-[18px] border-2 border-slate-100 shadow-sm" /> : <div className="w-12 h-12 rounded-[18px] bg-royal text-gold flex items-center justify-center font-black text-lg">{(u.name as string)?.charAt(0).toUpperCase() || "U"}</div>}<div><div className="font-bold text-slate-900 text-base group-hover:text-royal transition-colors">{u.name as string}</div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">#{(u._id as string).substring((u._id as string).length - 8)}</div></div></div></td>
                <td className="px-8 py-6"><div className="font-bold text-slate-900">{u.email as string}</div><div className="text-xs text-slate-400 mt-1">{u.phone as string || "No phone"}</div></td>
                <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase tracking-tight">{new Date(u.createdAt as string).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</td>
                <td className="px-8 py-6 text-right"><span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset", u.role === "admin" ? "bg-royal text-gold ring-gold/20" : "bg-white text-slate-400 ring-slate-100")}>{u.role as string || "Customer"}</span></td>
              </tr>
            ))}
            {usersList.length === 0 && <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">No customers registered yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, productsCount: 0 });
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [usersList, setUsersList] = useState<Record<string, unknown>[]>([]);
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Record<string, unknown> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Record<string, unknown> | null>(null);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock: "", category: "Lehenga", images: [] as string[], sizes: [] as string[], colors: [] as { name: string; hex: string }[], rating: 0, reviewCount: 0 });
  const [sizeInput, setSizeInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [colorHexInput, setColorHexInput] = useState("#000000");
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const isAdminUser = useUserStore((s) => s.role === "admin");

  useEffect(() => {
    if (!isAuthenticated || !user?.sub || !isAdminUser) return;
    const headers = { "x-auth0-id": user.sub };
    Promise.all([api.get("/api/products"), api.get("/api/admin/stats", { headers }), api.get("/api/admin/orders", { headers }), api.get("/api/admin/users", { headers })])
      .then(([prodRes, statsRes, ordersRes, usersRes]) => {
        setProducts(prodRes.data); setOrders(ordersRes.data); setUsersList(usersRes.data);
        setStats({ totalOrders: statsRes.data.totalOrders || 0, revenue: statsRes.data.revenue || 0, productsCount: statsRes.data.productsCount || prodRes.data.length });
      }).catch(() => {});
  }, [isAuthenticated, user, isAdminUser]);

  if (isLoading) return <ShellLayout><div className="pt-32 text-center text-royal font-bold">Initializing Admin Console...</div></ShellLayout>;
  if (!isAuthenticated || !isAdminUser) return (
    <ShellLayout>
      <div className="pt-32 pb-20 px-4 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6 border border-rose-100"><XCircle className="w-8 h-8" /></div>
        <h1 className="text-4xl font-serif font-bold text-royal mb-4">403 Forbidden</h1>
        <p className="text-slate-500 max-w-md text-center font-medium leading-relaxed">Access denied. This portal is restricted to authorized administrators only.</p>
        <Link href="/" className="mt-8 px-8 py-3 bg-royal text-white rounded-2xl font-bold shadow-lg shadow-royal/20 hover:scale-105 transition-transform">Return to Storefront</Link>
      </div>
    </ShellLayout>
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!user?.sub) return;
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus }, { headers: { "x-auth0-id": user.sub } });
      setOrders(orders.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedAdminOrder?._id === orderId) setSelectedAdminOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      toast.success(`Status updated to ${newStatus}`);
    } catch { toast.error("Failed to update status"); }
  };

  const handleOpenProductModal = (product: Record<string, unknown> | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({ name: product.name as string || "", description: product.description as string || "", price: String(product.price || ""), stock: String(product.stock || ""), category: product.category as string || "Lehenga", images: product.images as string[] || [], sizes: product.sizes as string[] || [], colors: product.colors as { name: string; hex: string }[] || [], rating: product.rating as number || 0, reviewCount: product.reviewCount as number || 0 });
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", stock: "", category: "Lehenga", images: [], sizes: [], colors: [], rating: 0, reviewCount: 0 });
    }
    setSizeInput(""); setColorNameInput(""); setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.sub) return;
    setIsSavingProduct(true);
    try {
      const payload = { ...productForm, price: Number(productForm.price), originalPrice: Number(productForm.price), stock: Number(productForm.stock), rating: Number(productForm.rating), reviewCount: Number(productForm.reviewCount) };
      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct._id}`, payload, { headers: { "x-auth0-id": user.sub } });
        setProducts(products.map((p) => p._id === editingProduct._id ? res.data : p));
        toast.success("Product updated successfully");
      } else {
        const res = await api.post("/api/products", payload, { headers: { "x-auth0-id": user.sub } });
        setProducts([res.data, ...products]);
        toast.success("New product published");
      }
      setIsProductModalOpen(false);
    } catch { toast.error("Error saving product details"); }
    finally { setIsSavingProduct(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user?.sub || !window.confirm("Confirm product deletion?")) return;
    try {
      await api.delete(`/api/products/${id}`, { headers: { "x-auth0-id": user.sub } });
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product removed");
    } catch { toast.error("Failed to delete product"); }
  };

  const tabs = [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { id: "products", label: "Inventory", icon: Package }, { id: "orders", label: "Orders", icon: ShoppingCart }, { id: "users", label: "Customers", icon: Users }];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Admin Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 shadow-2xl">
        <div className="max-w-[1500px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => { setActiveTab("dashboard"); setSelectedAdminOrder(null); }} className="flex items-center gap-3 mr-6">
              <div className="w-9 h-9 rounded-xl bg-royal flex items-center justify-center ring-2 ring-gold/40"><span className="font-serif text-gold font-bold text-lg leading-none">A</span></div>
              <div className="flex flex-col leading-none"><span className="font-serif text-white font-bold text-sm tracking-tight">Annaya Boutique</span><span className="text-[9px] text-slate-500 tracking-[0.2em] font-bold uppercase mt-1">Management Console</span></div>
            </button>
            <div className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-4 py-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedAdminOrder(null); }}
                  className={cn("flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300", activeTab === tab.id ? "bg-white/10 text-white shadow-lg ring-1 ring-white/20" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                  <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-gold" : "opacity-60")} />{tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user?.picture && <img src={user.picture} alt="" className="w-9 h-9 rounded-full ring-2 ring-slate-800 p-0.5" />}
            <Link href="/" className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-royal text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all ml-2">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="hidden sm:inline">Exit Console</span>
            </Link>
          </div>
        </div>
        <div className="md:hidden flex gap-1 overflow-x-auto no-scrollbar px-4 pb-2 bg-slate-900 border-t border-slate-800">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedAdminOrder(null); }}
              className={cn("flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all shrink-0 mt-2", activeTab === tab.id ? "bg-white/10 text-white ring-1 ring-white/20" : "text-slate-400 hover:text-white")}>
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-gold" : "")} />{tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="pt-[104px] md:pt-24 pb-20 px-4 max-w-[1500px] mx-auto min-h-screen">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-10"><h2 className="text-3xl font-serif font-bold text-slate-900">Dashboard Overview</h2><p className="text-slate-500 font-medium mt-1">Real-time statistics for your storefront.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{ icon: TrendingUp, label: "Total Revenue Generated", value: formatCurrency(stats.revenue), color: "emerald", badge: "Live Transaction Data" },
                { icon: ShoppingCart, label: "Order Fulfillment Queue", value: String(stats.totalOrders), color: "royal", badge: "Across all regions" },
                { icon: Package, label: "Inventory Catalogue", value: String(stats.productsCount), color: "amber", badge: "Active SKU Count" }
              ].map(({ icon: Icon, label, value, color, badge }) => (
                <div key={label} className={`bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-${color}/5 transition-all group overflow-hidden relative`}>
                  <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${color}/5 rounded-full blur-3xl`} />
                  <div className="relative">
                    <div className={`w-12 h-12 bg-${color}/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-${color}/20`}><Icon className={`w-6 h-6 text-${color}`} /></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{label}</p>
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{value}</h2>
                    <p className="mt-6 text-[11px] text-slate-500 font-bold uppercase tracking-wider">{badge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory */}
        {activeTab === "products" && (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div><h3 className="text-xl font-bold text-slate-900 lg:text-2xl">Catalogue Management</h3><p className="text-sm text-slate-500 mt-1">Manage, update, and deploy your product listings.</p></div>
              <button onClick={() => handleOpenProductModal()} className="px-6 py-3 bg-royal text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-sapphire shadow-xl shadow-royal/10 transition-all hover:scale-105 active:scale-95"><Plus className="w-5 h-5" /> Launch New SKU</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]"><tr><th className="px-8 py-5">Product</th><th className="px-8 py-5">Category</th><th className="px-8 py-5 text-right">Price</th><th className="px-8 py-5 text-center">Stock</th><th className="px-8 py-5 text-right">Actions</th></tr></thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p._id as string} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5"><div className="flex items-center gap-5"><img src={(p.images as string[])[0]} alt="" className="w-14 h-16 object-cover rounded-xl shadow-sm border border-slate-100" /><div><span className="font-bold text-slate-900 text-base">{p.name as string}</span><span className="text-[10px] text-slate-400 font-mono mt-1 uppercase block">ID: {(p._id as string).substring(0, 8)}</span></div></div></td>
                      <td className="px-8 py-5"><span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{p.category as string}</span></td>
                      <td className="px-8 py-5 text-right font-bold text-royal text-lg">{formatCurrency(p.price as number)}</td>
                      <td className="px-8 py-5 text-center"><div className={cn("px-3 py-1.5 rounded-xl font-bold text-xs inline-block min-w-[60px]", (p.stock as number) > 10 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>{p.stock as number}</div></td>
                      <td className="px-8 py-5"><div className="flex justify-end gap-2"><button onClick={() => handleOpenProductModal(p)} className="p-2.5 text-slate-400 hover:text-royal hover:bg-royal/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></button><button onClick={() => handleDeleteProduct(p._id as string)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button></div></td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">Catalogue is currently empty.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
            {selectedAdminOrder ? (
              <div>
                <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
                  <button onClick={() => setSelectedAdminOrder(null)} className="flex items-center gap-2.5 text-slate-500 hover:text-royal font-bold transition-all hover:-translate-x-1"><ArrowLeft className="w-5 h-5" /> Exit Detailed View</button>
                  <span className="font-mono text-base font-bold text-slate-900">#{(selectedAdminOrder._id as string).toUpperCase()}</span>
                </div>
                <div className="p-8 lg:p-12">
                  {/* Status Control */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
                    <div><h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Status Workflow</h4><p className="text-2xl font-serif font-bold text-slate-900">Live Delivery Tracking</p></div>
                    <select value={selectedAdminOrder.status as string} onChange={(e) => handleStatusChange(selectedAdminOrder._id as string, e.target.value)}
                      className={cn("px-5 py-2.5 rounded-xl text-xs font-bold border-none outline-none cursor-pointer shadow-sm", selectedAdminOrder.status === "Delivered" ? "bg-emerald-500 text-white" : selectedAdminOrder.status === "Shipped" ? "bg-sky-500 text-white" : selectedAdminOrder.status === "Cancelled" ? "bg-rose-500 text-white" : "bg-amber-500 text-white")}>
                      <option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  {/* Items */}
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Manifest Inventory</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {(selectedAdminOrder.items as Record<string, unknown>[])?.map((item, idx) => (
                      <div key={idx} className="flex gap-6 p-6 rounded-[28px] border border-slate-100 bg-white hover:shadow-lg transition-all">
                        <img src={item.image as string} alt={item.name as string} className="w-24 h-32 object-cover rounded-2xl shadow-sm" />
                        <div className="flex flex-col justify-center flex-1">
                          <h5 className="font-bold text-slate-900 text-xl leading-tight mb-2">{item.name as string}</h5>
                          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                            <div>Size <span className="text-royal font-black">{item.size as string}</span></div>
                            <div>Qty <span className="text-royal font-black">{item.qty as number}</span></div>
                          </div>
                          <div className="text-lg font-bold text-royal">{formatCurrency(item.price as number)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Address */}
                  {selectedAdminOrder.shippingAddress && (
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3"><MapPin className="w-5 h-5 text-royal" /> Destination</h4>
                      <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                        <p className="font-bold text-slate-900 text-xl mb-1">{(selectedAdminOrder.shippingAddress as Record<string, string>)?.fullName}</p>
                        <p className="text-base text-slate-500 mb-4">{(selectedAdminOrder.shippingAddress as Record<string, string>)?.phoneNumber}</p>
                        <p className="text-slate-600">{(selectedAdminOrder.shippingAddress as Record<string, string>)?.addressLine1}, {(selectedAdminOrder.shippingAddress as Record<string, string>)?.city}, {(selectedAdminOrder.shippingAddress as Record<string, string>)?.state} — {(selectedAdminOrder.shippingAddress as Record<string, string>)?.postalCode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="p-8 border-b border-slate-50"><h3 className="text-2xl font-bold text-slate-900">Global Acquisitions</h3><p className="text-sm text-slate-500 mt-1 font-medium">Monitoring {orders.length} transaction entries.</p></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"><tr><th className="px-8 py-5">Order ID</th><th className="px-8 py-5">Date</th><th className="px-8 py-5">Customer</th><th className="px-8 py-5 text-right">Amount</th><th className="px-8 py-5 text-center">Status</th></tr></thead>
                    <tbody className="text-sm divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order._id as string} className="hover:bg-slate-50/80 transition-all cursor-pointer group" onClick={() => setSelectedAdminOrder(order)}>
                          <td className="px-8 py-6 font-mono text-[11px] text-slate-400 group-hover:text-royal group-hover:font-bold transition-colors">#{(order._id as string).substring((order._id as string).length - 12).toUpperCase()}</td>
                          <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase">{new Date(order.createdAt as string).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}</td>
                          <td className="px-8 py-6"><div className="font-bold text-slate-900 text-base">{(order.shippingAddress as Record<string, string>)?.fullName}</div><div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{(order.shippingAddress as Record<string, string>)?.city} — {(order.shippingAddress as Record<string, string>)?.postalCode}</div></td>
                          <td className="px-8 py-6 text-right font-bold text-royal text-lg">{formatCurrency(order.totalAmount as number)}</td>
                          <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <select value={order.status as string} onChange={(e) => handleStatusChange(order._id as string, e.target.value)}
                              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm outline-none cursor-pointer", STATUS_STYLES[order.status as string] || STATUS_STYLES.Processing)}>
                              <option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && <tr><td colSpan={5} className="px-8 py-24 text-center text-slate-400 font-medium animate-pulse uppercase tracking-[0.25em]">Awaiting Incoming Transactions...</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customers */}
        {activeTab === "users" && <CustomerTab usersList={usersList} adminAuthId={user?.sub || ""} />}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] w-full max-w-2xl my-8 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-royal rounded-[24px] flex items-center justify-center shadow-2xl shadow-royal/30 text-gold">{editingProduct ? <Edit className="w-6 h-6" /> : <Plus className="w-7 h-7" />}</div>
                <div><h2 className="text-2xl font-serif font-bold text-slate-900">{editingProduct ? "Revise Listing" : "New Product"}</h2><p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-1">Inventory Management</p></div>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full font-bold transition-all text-xl">✕</button>
            </div>
            <div className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[["Master Name", "name", "text"], ["Unit Valuation (₹)", "price", "number"], ["Warehouse Stock", "stock", "number"]].map(([label, field, type]) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
                      <input required type={type} value={(productForm as Record<string, unknown>)[field] as string} onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none focus:bg-white focus:border-royal/10 focus:ring-4 focus:ring-royal/5 text-slate-900 text-sm font-bold transition-all" />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Classification</label>
                    <select required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none focus:bg-white focus:border-royal/10 focus:ring-4 focus:ring-royal/5 text-slate-900 text-sm font-bold transition-all cursor-pointer">
                      {["Lehenga","Saree","Kurti","Ready to Wear","Co-ord Set","Frock","Suit","Special"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Sizes */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Size Variants</label>
                    <div className="flex flex-wrap gap-2 mb-2">{productForm.sizes.map((s, idx) => <div key={idx} className="flex items-center gap-1 bg-royal/10 text-royal px-3 py-1.5 rounded-xl text-xs font-bold">{s}<button type="button" onClick={() => setProductForm({ ...productForm, sizes: productForm.sizes.filter((_, i) => i !== idx) })}><X className="w-4 h-4 hover:text-rose-500" /></button></div>)}</div>
                    <div className="flex gap-2">
                      <input value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (sizeInput) { setProductForm({ ...productForm, sizes: [...productForm.sizes, sizeInput] }); setSizeInput(""); } } }} className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:bg-white focus:border-royal/10 text-sm font-bold" placeholder="Add size (e.g. M, L, XL) and hit Enter" />
                      <button type="button" onClick={() => { if (sizeInput) { setProductForm({ ...productForm, sizes: [...productForm.sizes, sizeInput] }); setSizeInput(""); } }} className="px-6 bg-slate-200 hover:bg-slate-300 rounded-[20px] font-bold text-sm text-slate-600 transition-colors">Add</button>
                    </div>
                  </div>
                  {/* Colors */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Color Variants</label>
                    <div className="flex flex-wrap gap-2 mb-2">{productForm.colors.map((c, idx) => <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700"><div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: c.hex }} />{c.name}<button type="button" onClick={() => setProductForm({ ...productForm, colors: productForm.colors.filter((_, i) => i !== idx) })}><X className="w-4 h-4 text-slate-400 hover:text-rose-500" /></button></div>)}</div>
                    <div className="flex gap-2">
                      <input value={colorNameInput} onChange={(e) => setColorNameInput(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:bg-white focus:border-royal/10 text-sm font-bold" placeholder="Color name (e.g. Navy Blue)" />
                      <input type="color" value={colorHexInput} onChange={(e) => setColorHexInput(e.target.value)} className="w-14 h-[44px] bg-slate-50 border-2 border-transparent rounded-xl outline-none cursor-pointer p-0.5" />
                      <button type="button" onClick={() => { if (colorNameInput) { setProductForm({ ...productForm, colors: [...productForm.colors, { name: colorNameInput, hex: colorHexInput }] }); setColorNameInput(""); } }} className="px-6 bg-slate-200 hover:bg-slate-300 rounded-[20px] font-bold text-sm text-slate-600 transition-colors">Add</button>
                    </div>
                  </div>
                </div>
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Visual Assets</label>
                  <ImageUpload images={productForm.images} onChange={(urls) => setProductForm({ ...productForm, images: urls })} userToken={user?.sub || ""} />
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Description</label>
                  <textarea required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none focus:bg-white focus:border-royal/10 focus:ring-4 focus:ring-royal/5 text-slate-900 text-sm font-bold transition-all min-h-[140px] leading-relaxed" />
                </div>
              </form>
            </div>
            <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-5">
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 rounded-[20px] transition-all uppercase tracking-widest text-[11px]">Discard</button>
              <button onClick={handleSaveProduct} disabled={isSavingProduct} className="px-10 py-4 bg-royal text-white font-bold rounded-[20px] hover:bg-sapphire shadow-2xl shadow-royal/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
                {isSavingProduct ? "Saving..." : editingProduct ? "Store Revisions" : "Deploy Listing"}<CheckCircle className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
