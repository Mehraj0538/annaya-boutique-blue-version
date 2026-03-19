// Server Component wrapper — adds static generation for known categories.
// The actual UI (filtering, products grid) is the same "use client" ProductsPage.

import ProductsPage from "@/app/products/page";

// ─── ISR: re-generate category shells once per hour ──────────────────────────
export const revalidate = 3600;

// ─── Pre-build all category pages at deploy time → 0% function invocations ───
export async function generateStaticParams() {
  return [
    { category: "Lehenga" },
    { category: "Saree" },
    { category: "Kurti" },
    { category: "Suit" },
    { category: "Frock" },
    { category: "Kids%20Wear" },
    { category: "Kids+Wear" },
    { category: "Co-ord+Set" },
    { category: "Co-ord%20Set" },
    { category: "Ready+to+Wear" },
    { category: "Ready%20to%20Wear" },
    { category: "Special" },
  ];
}

export { default } from "@/app/products/page";
