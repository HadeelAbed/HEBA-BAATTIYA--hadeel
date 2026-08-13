"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { Button } from "@/components/ui/button";

export function ProductInfoPanel({ product }: { product: Product }) {
  const router = useRouter();
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState(product.sizes[0]?.label);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  function validateSize() {
    if (product.sizes.length > 0 && !size) {
      setSizeError(true);
      return false;
    }
    return true;
  }

  async function handleAddToCart() {
    if (!validateSize()) return;
    try {
      await addItem(product, color, size, quantity);
      toast.success("Added to your bag", { description: product.name });
    } catch {
      toast.error("Could not add to bag. Please try again.");
    }
  }

  async function handleBuyNow() {
    if (!validateSize()) return;
    try {
      await addItem(product, color, size, quantity);
    } catch {
      toast.error("Could not add to bag. Please try again.");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div>
      <p className="eyebrow">{product.category.name}</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide md:text-4xl">{product.name}</h1>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-0.5 text-charcoal">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(product.avgRating) ? "fill-charcoal text-charcoal" : "text-mist"}
            />
          ))}
        </div>
        <span className="text-xs text-stone">
          {product.avgRating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-body text-2xl text-charcoal">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-base text-stone line-through">{formatPrice(product.compareAtPrice)}</span>
        )}
      </div>

      <p className="mt-6 max-w-md text-sm leading-relaxed text-graphite">{product.description}</p>

      {product.colors.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs tracking-wide uppercase text-graphite">
            Color: <span className="text-charcoal">{color}</span>
          </p>
          <div className="flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                aria-pressed={color === c.name}
                className={cn(
                  "h-9 w-9 rounded-full border transition",
                  color === c.name ? "ring-2 ring-charcoal ring-offset-2" : "border-mist"
                )}
                style={{ backgroundColor: c.hexCode }}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs tracking-wide uppercase text-graphite">
              Size: <span className="text-charcoal">{size}</span>
            </p>
            <a href="/size-guide" className="text-xs text-stone underline-offset-4 hover:underline">
              Size Guide
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSize(s.label);
                  setSizeError(false);
                }}
                aria-pressed={size === s.label}
                className={cn(
                  "flex h-11 w-11 items-center justify-center border text-sm transition",
                  size === s.label
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-mist text-graphite hover:border-charcoal"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          {sizeError && <p className="mt-2 text-xs text-red-600">Please select a size.</p>}
        </div>
      )}

      <div className="mt-7 flex items-center gap-4">
        <p className="text-xs tracking-wide uppercase text-graphite">Quantity</p>
        <div className="flex items-center border border-mist">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 hover:bg-bone"
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="p-3 hover:bg-bone"
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" size="lg" className="flex-1" onClick={handleAddToCart}>
          Add to Bag
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleBuyNow}>
          Buy Now
        </Button>
        <button
          onClick={() => {
            toggle(product);
            toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Toggle wishlist"
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-mist transition hover:border-charcoal"
        >
          <Heart size={18} className={wishlisted ? "fill-charcoal text-charcoal" : "text-charcoal"} />
        </button>
      </div>

      <div className="mt-10 space-y-4 border-t border-hairline pt-8">
        <div className="flex items-start gap-3">
          <Truck size={17} strokeWidth={1.4} className="mt-0.5 flex-shrink-0 text-stone" />
          <p className="text-xs text-graphite">Complimentary express shipping on orders over SAR 2,000</p>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw size={17} strokeWidth={1.4} className="mt-0.5 flex-shrink-0 text-stone" />
          <p className="text-xs text-graphite">14-day returns on ready-to-wear pieces</p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck size={17} strokeWidth={1.4} className="mt-0.5 flex-shrink-0 text-stone" />
          <p className="text-xs text-graphite">Secure checkout with Mada, Visa, Mastercard, Apple Pay & STC Pay</p>
        </div>
      </div>

      {(product.fabricDetails || product.careInstructions) && (
        <div className="mt-8 space-y-5 border-t border-hairline pt-8">
          {product.fabricDetails && (
            <div>
              <h3 className="text-xs tracking-widest2 uppercase text-charcoal">Fabric & Construction</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{product.fabricDetails}</p>
            </div>
          )}
          {product.careInstructions && (
            <div>
              <h3 className="text-xs tracking-widest2 uppercase text-charcoal">Care</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{product.careInstructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
