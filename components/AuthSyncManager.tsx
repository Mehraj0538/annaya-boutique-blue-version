"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "@/lib/api";
import { Phone, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function AuthSyncManager({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { setUserData, clearUserData } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      clearUserData();
      return;
    }
    if (isAuthenticated && user?.sub) {
      setIsSyncing(true);
      api
        .post("/api/users/sync", {
          auth0Id: user.sub,
          name: user.name,
          email: user.email,
          picture: user.picture,
        })
        .then((res) => {
          setUserData({ role: res.data.role, _id: res.data._id, phone: res.data.phone });
          if (!res.data.phone) {
            setShowPhonePrompt(true);
          } else {
            if (res.data.role === "admin" && pathname === "/") {
              router.push("/admin");
            }
          }
        })
        .catch((err) => console.error("Failed to sync user:", err))
        .finally(() => setIsSyncing(false));
    }
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    if (!user?.sub) return;
    setIsSaving(true);
    try {
      await api.put("/api/users/phone", { auth0Id: user.sub, phone: phoneNumber });
      setUserData({ phone: phoneNumber });
      setShowPhonePrompt(false);
    } catch {
      setError("Failed to save mobile number. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {isAuthenticated && showPhonePrompt && !isLoading && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-royal/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <div className="p-8 text-center bg-gradient-to-b from-sky/10 to-transparent">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky/20 text-sapphire border-4 border-white">
                  <Phone className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-royal mb-2">Almost Done!</h2>
                <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
                  To keep your account secure and provide order tracking, we need your mobile number.
                </p>
              </div>
              <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="10-digit mobile number"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire outline-none font-bold text-slate-700 placeholder:font-normal transition-all"
                        maxLength={10}
                      />
                    </div>
                    {error && <p className="text-xs text-rose-500 font-bold mt-2">{error}</p>}
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 text-xs p-4 rounded-xl flex gap-3 leading-relaxed">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    We respect your privacy. Your number will only be used for order updates and verification.
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving || phoneNumber.length < 10}
                    className="w-full py-4 bg-royal text-white font-bold rounded-2xl hover:bg-sapphire silk-transition shadow-lg shadow-royal/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
