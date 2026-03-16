import { create } from "zustand";

interface UserState {
  role: "user" | "admin" | null;
  dbId: string | null;
  phone: string | null;
  setUserData: (data: { role?: "user" | "admin"; _id?: string; phone?: string }) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  dbId: null,
  phone: null,
  setUserData: (data) =>
    set((state) => ({
      ...state,
      role: data.role || state.role,
      dbId: data._id || state.dbId,
      phone: data.phone || state.phone,
    })),
  clearUserData: () => set({ role: null, dbId: null, phone: null }),
}));
