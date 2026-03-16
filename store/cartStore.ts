import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQty: (id: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        const existing = get().cart.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },
      removeFromCart: (id, size, color) =>
        set({ cart: get().cart.filter((i) => !(i.id === id && i.size === size && i.color === color)) }),
      updateQty: (id, size, color, qty) =>
        set({
          cart: get().cart.map((i) =>
            i.id === id && i.size === size && i.color === color ? { ...i, qty } : i
          ),
        }),
      clearCart: () => set({ cart: [] }),
      getTotal: () => get().cart.reduce((total, item) => total + item.price * item.qty, 0),
      getItemCount: () => get().cart.reduce((count, item) => count + item.qty, 0),
    }),
    { name: "annaya-cart" }
  )
);
