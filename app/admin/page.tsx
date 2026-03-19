"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Plus, Edit, Trash2,
  ArrowLeft, MapPin, Truck, CheckCircle, XCircle, LogOut, TrendingUp,
  X, Mail, Phone, ShoppingBag, Loader2, Eye, EyeOff,
} from "lucide-react";
import api from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import ShellLayout from "@/components/ShellLayout";

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Shipped: "bg-sky-50 text-sky-600 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  Processing: "bg-amber-50 text-amber-600 border-amber-100",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ADMIN_KEY_STORAGE = "annaya_admin_key";

function getStoredKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
}
function storeKey(key: string) {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
}
function clearKey() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Verify the key against a lightweight API call
      await api.get("/api/admin/stats", { headers: { "x-admin-key": key } });
      storeKey(key);
      onLogin(key);
    } catch {
      setError("Invalid admin key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShellLayout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-[32px] w-full max-w-sm shadow-xl border border-slate-100 p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-royal rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-royal/30">
              <span className="font-serif text-gold font-bold text-2xl leading-none">A</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-royal">Admin Console</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your admin secret key</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Admin secret key"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal pr-12 font-mono text-sm"
                autoFocus
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}
            <button type="submit" disabled={loading || !key.trim()} className="w-full py-3 bg-royal text-white font-bold rounded-2xl hover:bg-sapphire transition-colors shadow-lg shadow-royal/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Verifying…" : "Access Console"}
            </button>
          </form>
        </div>
      </div>
    </ShellLayout>
  );
}

// ─── Main admin page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Record<string, unknown> | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", slug: "", description: "", price: "", originalPrice: "", discountPercent: "", stock: "", category: "Lehenga",
    images: [] as string[], sizes: [] as string[], colors: [] as { name: string; hex: string }[],
    rating: 0, reviewCount: 0, isFeatured: false, isNewArrival: false,
  });
  const [sizeInput, setSizeInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [colorHexInput, setColorHexInput] = useState("#000000");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    const stored = getStoredKey();
    if (stored) setAdminKey(stored);
  }, []);

  const headers = useCallback(
    () => ({ "x-admin-key": adminKey ?? "" }),
    [adminKey]
  );

  // Load data once authenticated
  useEffect(() => {
    if (!adminKey) return;
    api.get("/api/products")
      .then((prodRes) => {
        setProducts(prodRes.data);
      })
      .catch(() => {});
  }, [adminKey, headers]);

  if (!adminKey) {
    return <AdminLogin onLogin={(k) => setAdminKey(k)} />;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearKey();
    setAdminKey(null);
  };



  const handleOpenProductModal = (product: Record<string, unknown> | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: (product.name as string) || "",
        slug: (product.slug as string) || "",
        description: (product.description as string) || "",
        price: String(product.price || ""),
        originalPrice: String(product.originalPrice || ""),
        discountPercent: String(product.discountPercent || ""),
        stock: String(product.stock || ""),
        category: (product.category as string) || "Lehenga",
        images: (product.images as string[]) || [],
        sizes: (product.sizes as string[]) || [],
        colors: (product.colors as { name: string; hex: string }[]) || [],
        rating: (product.rating as number) || 0,
        reviewCount: (product.reviewCount as number) || 0,
        isFeatured: Boolean(product.isFeatured),
        isNewArrival: Boolean(product.isNewArrival)
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", slug: "", description: "", price: "", originalPrice: "", discountPercent: "", stock: "", category: "Lehenga", images: [], sizes: [], colors: [], rating: 0, reviewCount: 0, isFeatured: false, isNewArrival: false });
    }
    setSizeInput("");
    setColorNameInput("");
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
        discountPercent: Number(productForm.discountPercent || 0),
        stock: Number(productForm.stock),
        rating: Number(productForm.rating),
        reviewCount: Number(productForm.reviewCount),
        isFeatured: Boolean(productForm.isFeatured),
        isNewArrival: Boolean(productForm.isNewArrival),
      };
      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct._id}`, payload, { headers: headers() });
        setProducts(products.map((p) => (p._id === editingProduct._id ? res.data : p)));
        toast.success("Product updated");
      } else {
        const res = await api.post("/api/products", payload, { headers: headers() });
        setProducts([res.data, ...products]);
        toast.success("Product created");
      }
      setIsProductModalOpen(false);
    } catch {
      toast.error("Error saving product");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`, { headers: headers() });
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const tabs = [
    { id: "products", label: "Inventory", icon: Package },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Admin nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 shadow-2xl">
        <div className="max-w-[1500px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => { setActiveTab("products"); }} className="flex items-center gap-3 mr-6">
              <div className="w-9 h-9 rounded-xl bg-royal flex items-center justify-center ring-2 ring-gold/40">
                <span className="font-serif text-gold font-bold text-lg leading-none">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-white font-bold text-sm tracking-tight">Annaya Boutique</span>
                <span className="text-[9px] text-slate-500 tracking-[0.2em] font-bold uppercase mt-1">Management Console</span>
              </div>
            </button>
            <div className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-4 py-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); }}
                  className={cn("flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300", activeTab === tab.id ? "bg-white/10 text-white shadow-lg ring-1 ring-white/20" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                  <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-gold" : "opacity-60")} />{tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-royal text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all">
              Storefront
            </Link>
            <button onClick={handleLogout} className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all">
              <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 overflow-x-auto no-scrollbar px-4 pb-2 bg-slate-900 border-t border-slate-800">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); }}
              className={cn("flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all shrink-0 mt-2", activeTab === tab.id ? "bg-white/10 text-white ring-1 ring-white/20" : "text-slate-400 hover:text-white")}>
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-gold" : "")} />{tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="pt-[104px] md:pt-24 pb-20 px-4 max-w-[1500px] mx-auto min-h-screen">
        {/* Dashboard */}

        {/* Inventory */}
        {activeTab === "products" && (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 lg:text-2xl">Catalogue Management</h3>
                <p className="text-sm text-slate-500 mt-1">Manage your product listings.</p>
              </div>
              <button onClick={() => handleOpenProductModal()} className="px-6 py-3 bg-royal text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-sapphire shadow-xl shadow-royal/10 transition-all hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Product</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5 text-right">Price</th>
                    <th className="px-8 py-5 text-center">Stock</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p._id as string} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={(p.images as string[])[0]} alt="" className="w-14 h-16 object-cover rounded-xl shadow-sm border border-slate-100" />
                          <div>
                            <span className="font-bold text-slate-900 text-base">{p.name as string}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 uppercase block">ID: {(p._id as string).slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{p.category as string}</span>
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-royal text-lg">{formatCurrency(p.price as number)}</td>
                      <td className="px-8 py-5 text-center">
                        <div className={cn("px-3 py-1.5 rounded-xl font-bold text-xs inline-block min-w-[60px]", (p.stock as number) > 10 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                          {p.stock as number}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenProductModal(p)} className="p-2.5 text-slate-400 hover:text-royal hover:bg-royal/5 rounded-xl transition-all"><Edit className="w-5 h-5" /></button>
                          <button onClick={() => handleDeleteProduct(p._id as string)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">No products yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>

      {/* Product modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] w-full max-w-2xl my-8 shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-royal rounded-[24px] flex items-center justify-center shadow-2xl shadow-royal/30 text-gold">
                  {editingProduct ? <Edit className="w-6 h-6" /> : <Plus className="w-7 h-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {editingProduct ? "Edit Product" : "New Product"}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full font-bold transition-all text-xl">✕</button>
            </div>
            <div className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {([
                    ["Product Name", "name", "text"], 
                    ["Slug (Auto-generated if empty)", "slug", "text"], 
                    ["Current Price (₹)", "price", "number"], 
                    ["Original Price (₹)", "originalPrice", "number"], 
                    ["Discount %", "discountPercent", "number"], 
                    ["Stock", "stock", "number"],
                    ["Rating", "rating", "number"],
                    ["Review Count", "reviewCount", "number"]
                  ] as [string, string, string][]).map(([label, field, type]) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
                      <input required={["name", "price", "stock"].includes(field)} type={type} value={(productForm as Record<string, unknown>)[field] as string}
                        onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none focus:bg-white focus:border-royal/10 focus:ring-4 focus:ring-royal/5 text-slate-900 text-sm font-bold transition-all" />
                    </div>
                  ))}
                  
                  <div className="col-span-1 md:col-span-2 flex flex-wrap gap-8 items-center bg-royal/5 p-6 rounded-[24px] border border-royal/10">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={productForm.isFeatured} onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} className="w-5 h-5 rounded text-royal focus:ring-royal" />
                      <span className="text-sm font-bold text-slate-700">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={productForm.isNewArrival} onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })} className="w-5 h-5 rounded text-royal focus:ring-royal" />
                      <span className="text-sm font-bold text-slate-700">New Arrival</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category</label>
                    <select required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none focus:bg-white focus:border-royal/10 text-slate-900 text-sm font-bold transition-all cursor-pointer">
                      {["Lehenga","Saree","Kurti","Ready to Wear","Co-ord Set","Frock","Suit","Special","Kids Wear"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Sizes */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sizes</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productForm.sizes.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-royal/10 text-royal px-3 py-1.5 rounded-xl text-xs font-bold">
                          {s}
                          <button type="button" onClick={() => setProductForm({ ...productForm, sizes: productForm.sizes.filter((_, i) => i !== idx) })}>
                            <X className="w-4 h-4 hover:text-rose-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={sizeInput} onChange={(e) => setSizeInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (sizeInput) { setProductForm({ ...productForm, sizes: [...productForm.sizes, sizeInput] }); setSizeInput(""); } } }}
                        className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:bg-white focus:border-royal/10 text-sm font-bold" placeholder="Add size (e.g. M, L, XL) and hit Enter" />
                      <button type="button" onClick={() => { if (sizeInput) { setProductForm({ ...productForm, sizes: [...productForm.sizes, sizeInput] }); setSizeInput(""); } }} className="px-6 bg-slate-200 hover:bg-slate-300 rounded-[20px] font-bold text-sm text-slate-600">Add</button>
                    </div>
                  </div>
                  {/* Colors */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Colors</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productForm.colors.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                          <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: c.hex }} />
                          {c.name}
                          <button type="button" onClick={() => setProductForm({ ...productForm, colors: productForm.colors.filter((_, i) => i !== idx) })}>
                            <X className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={colorNameInput} onChange={(e) => setColorNameInput(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:bg-white focus:border-royal/10 text-sm font-bold" placeholder="Color name (e.g. Navy Blue)" />
                      <input type="color" value={colorHexInput} onChange={(e) => setColorHexInput(e.target.value)} className="w-14 h-[44px] bg-slate-50 border-2 border-transparent rounded-xl outline-none cursor-pointer p-0.5" />
                      <button type="button" onClick={() => { if (colorNameInput) { setProductForm({ ...productForm, colors: [...productForm.colors, { name: colorNameInput, hex: colorHexInput }] }); setColorNameInput(""); } }} className="px-6 bg-slate-200 hover:bg-slate-300 rounded-[20px] font-bold text-sm text-slate-600">Add</button>
                    </div>
                  </div>
                </div>
                {/* Images */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Images</label>
                  <ImageUpload images={productForm.images} onChange={(urls) => setProductForm({ ...productForm, images: urls })} adminKey={adminKey} />
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Description</label>
                  <textarea required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[24px] outline-none focus:bg-white focus:border-royal/10 focus:ring-4 focus:ring-royal/5 text-slate-900 text-sm font-bold transition-all min-h-[140px] leading-relaxed" />
                </div>
              </form>
            </div>
            <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-5">
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 rounded-[20px] transition-all uppercase tracking-widest text-[11px]">Cancel</button>
              <button onClick={handleSaveProduct} disabled={isSavingProduct}
                className="px-10 py-4 bg-royal text-white font-bold rounded-[20px] hover:bg-sapphire shadow-2xl shadow-royal/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
                {isSavingProduct ? "Saving…" : editingProduct ? "Save Changes" : "Create Product"}
                <CheckCircle className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
