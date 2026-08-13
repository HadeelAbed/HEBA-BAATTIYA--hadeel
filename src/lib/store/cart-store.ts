"use client";

import { create } from "zustand";
import type { Product } from "@/types";

export interface CartLine {
  lineId: string;
  productId: string;
  product: Product;
  colorName?: string;
  sizeLabel?: string;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
}

interface CartState {
  lines: CartLine[];
  coupon: AppliedCoupon | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addItem: (product: Product, colorName?: string, sizeLabel?: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string, subtotal: number) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => Promise<void>;
  subtotal: () => number;
  itemCount: () => number;
}

function compositeKey(line: { productId: string; colorName?: string; sizeLabel?: string }) {
  return `${line.productId}|${line.colorName ?? ""}|${line.sizeLabel ?? ""}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  coupon: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        set({ lines: data.items, hydrated: true });
      }
    } catch {
      // Keep whatever is currently in the store
    }
  },

  addItem: async (product, colorName, sizeLabel, quantity = 1) => {
    const qty = Math.max(1, Math.min(Math.round(quantity) || 1, 10));
    const key = compositeKey({ productId: product.id, colorName, sizeLabel });

    // Optimistic update
    const current = get().lines;
    const idx = current.findIndex((l) => compositeKey(l) === key);
    const tempLineId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimistic = [...current];
    if (idx >= 0) {
      optimistic[idx] = { ...optimistic[idx], quantity: optimistic[idx].quantity + qty };
    } else {
      optimistic.push({ lineId: tempLineId, productId: product.id, product, colorName, sizeLabel, quantity: qty });
    }
    set({ lines: optimistic });

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, colorName, sizeLabel, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add item");
      set({ lines: data.items });
    } catch (err) {
      set({ lines: current });
      throw err;
    }
  },

  removeItem: async (lineId) => {
    const current = get().lines;
    const removed = current.find((l) => l.lineId === lineId);
    if (!removed) return;

    set({ lines: current.filter((l) => l.lineId !== lineId) });

    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(lineId)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to remove item");
      if (Array.isArray(data.items)) set({ lines: data.items });
    } catch {
      set({ lines: current });
    }
  },

  updateQuantity: async (lineId, quantity) => {
    const current = get().lines;
    const nextQty = Math.max(0, Math.min(Math.round(quantity) || 0, 10));

    if (nextQty === 0) {
      await get().removeItem(lineId);
      return;
    }

    set({ lines: current.map((l) => (l.lineId === lineId ? { ...l, quantity: nextQty } : l)) });

    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(lineId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update item");
      if (Array.isArray(data.items)) set({ lines: data.items });
    } catch {
      set({ lines: current });
    }
  },

  applyCoupon: async (code, subtotal) => {
    const normalized = code.trim().toUpperCase();
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid || !data.coupon) {
        return { success: false, message: data.message ?? "This coupon code is not valid." };
      }
      const coupon = data.coupon as { code: string; discountType: string; discountValue: number | string };
      set({
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType === "FIXED_AMOUNT" ? "FIXED_AMOUNT" : "PERCENTAGE",
          discountValue: Number(coupon.discountValue),
        },
      });
      return { success: true, message: "Coupon applied" };
    } catch {
      return { success: false, message: "Could not validate this coupon right now." };
    }
  },

  removeCoupon: () => set({ coupon: null }),

  clearCart: async () => {
    set({ lines: [], coupon: null });
    try {
      await fetch("/api/cart", { method: "DELETE" });
    } catch {
      // Best effort
    }
  },

  subtotal: () => get().lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),

  itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
}));
