"use client";

import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
  updatedAt?: string;
} | null;

type CartItem = {
  id: string;
  productId: number;
  quantity: number;
  unitPrice: number | null;
  currency: string;
  product?: any | null;
};

type Cart = {
  id: string;
  userId: string | null;
  status: string;
  currency: string;
  totalAmount: number;
  computedTotal: number;
  items: CartItem[];
} | null;

type UserStore = {
  user: User;
  cart: Cart;
  setUser: (user: User) => void;
  setCart: (cart: Cart) => void;
  fetchMe: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  cart: null,
  setUser: (user) => set({ user }),
  setCart: (cart) => set({ cart }),
  async fetchMe() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json())?.data as { user: User; cart: Cart };
      set({ user: data?.user ?? null, cart: data?.cart ?? null });
    } catch {
      // ignore
    }
  },
}));
