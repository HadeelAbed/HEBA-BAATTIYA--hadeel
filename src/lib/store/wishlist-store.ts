"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  productIds: string[];
  products: Record<string, Product>;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      products: {},

      toggle: (product) => {
        const exists = get().productIds.includes(product.id);
        if (exists) {
          set((state) => ({
            productIds: state.productIds.filter((id) => id !== product.id),
          }));
        } else {
          set((state) => ({
            productIds: [...state.productIds, product.id],
            products: { ...state.products, [product.id]: product },
          }));
        }
      },

      remove: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    { name: "heba-baattiya-wishlist" }
  )
);
