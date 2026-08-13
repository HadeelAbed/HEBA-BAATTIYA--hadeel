"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { toast } from "sonner";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const primary = product.images[0]?.url || "/hero-heba.jpg";
  const secondary = product.images[1]?.url ?? primary;

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        href={`/product/${product.slug}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-bone">
          <Image
            src={primary}
            alt={product.name}
            fill
            className={cn(
              "object-contain transition-opacity duration-700",
              hovered && secondary !== primary ? "opacity-0" : "opacity-100",
            )}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {secondary !== primary && (
            <Image
              src={secondary}
              alt={product.name}
              fill
              className={cn(
                "object-contain transition-opacity duration-700",
                hovered ? "opacity-100" : "opacity-0",
              )}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          {(product.isNewArrival || product.compareAtPrice) && (
            <span className="absolute left-3 top-3 bg-charcoal px-2.5 py-1 text-[10px] tracking-widest2 uppercase text-white">
              {product.isNewArrival ? "New" : "Sale"}
            </span>
          )}

          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Heart
              size={15}
              className={
                wishlisted ? "fill-charcoal text-charcoal" : "text-charcoal"
              }
              strokeWidth={1.5}
            />
          </button>
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-body text-sm leading-snug text-charcoal">
              {product.name}
            </h3>
            <p className="mt-1 text-[11px] tracking-wide text-stone">
              {product.category.name}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            {product.compareAtPrice && (
              <p className="text-[11px] text-stone line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
            <p className="font-body text-sm text-charcoal">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
