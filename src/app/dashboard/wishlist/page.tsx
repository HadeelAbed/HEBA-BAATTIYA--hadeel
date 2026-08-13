"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardWishlistPage() {
  const { productIds, products, remove } = useWishlistStore();
  const { addItem } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const items = productIds.map((id) => products[id]).filter(Boolean);

  if (!hydrated) return null;

  return (
    <div>
      <h2 className="mb-7 font-display text-xl tracking-wide">Wishlist</h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Heart size={32} strokeWidth={1} className="text-mist" />
          <p className="mt-4 text-sm text-stone">No saved items yet.</p>
          <Link href="/shop" className="mt-6">
            <Button variant="secondary" size="sm">
              Browse the Shop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((product) => (
            <div key={product.id} className="flex items-center gap-4 border border-hairline p-4">
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-bone">
                <Image src={product.images[0]?.url} alt={product.name} fill className="object-contain" sizes="64px" />
              </div>
              <div className="flex-1">
                <Link href={`/product/${product.slug}`} className="text-sm hover:underline">
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-stone">{formatPrice(product.price)}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  addItem(product);
                  toast.success("Added to bag");
                }}
              >
                Add to Bag
              </Button>
              <button onClick={() => remove(product.id)} aria-label="Remove" className="text-stone hover:text-charcoal">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
