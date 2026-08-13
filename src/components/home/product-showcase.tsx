"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/shared/product-card";

export function ProductShowcase({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="container-site py-20 md:py-24">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          {subtitle && <p className="eyebrow">{subtitle}</p>}
          <h2 className="mt-3 font-display text-3xl tracking-wide md:text-4xl">
            {title}
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className="group flex items-center gap-2 text-xs tracking-widest2 uppercase text-charcoal"
        >
          View All
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
