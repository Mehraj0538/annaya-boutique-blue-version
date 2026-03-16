import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (id) => {
        const current = get().wishlist;
        set({ wishlist: current.includes(id) ? current.filter((i) => i !== id) : [...current, id] });
      },
      isInWishlist: (id) => get().wishlist.includes(id),
    }),
    { name: "annaya-wishlist" }
  )
);
