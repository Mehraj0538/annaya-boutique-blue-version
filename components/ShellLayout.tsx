"use client";

import { usePathname } from "next/navigation";
import { Navbar, MobileBottomNav } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "pt-16" : ""}>
        {children}
      </main>
      {!isAdmin && <MobileBottomNav />}
      {!isAdmin && <Footer />}
    </>
  );
}
