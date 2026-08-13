"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";

export function WishlistPageClient() {
  const { productIds, products } = useWishlistStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const items = productIds.map((id) => products[id]).filter(Boolean);

  if (!hydrated) return null;

  return (
    <div className="container-site py-14">
      <h1 className="mb-2 font-display text-4xl tracking-wide">Wishlist</h1>
      <p className="mb-10 text-sm text-stone">{items.length} saved pieces</p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart size={36} strokeWidth={1} className="text-mist" />
          <p className="mt-5 font-display text-xl">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-stone">Save pieces you love to find them here later.</p>
          <Link href="/shop" className="mt-8">
            <Button variant="primary" size="lg">
              Explore the Collection
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
