"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Category, Product } from "@/types";
import { IMG, ImageKey } from "@/lib/images";
import { ProductCard } from "@/components/shared/product-card";

export function CollectionsList({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categorySlug = searchParams?.get("category") ?? undefined;

  // Only show categories marked as featured in the DB.
  // Admin can toggle isFeatured on any category to show/hide it here.
  const featuredCategories = useMemo(
    () => categories.filter((cat) => cat.isFeatured),
    [categories],
  );

  // Which sections to render (all featured, or just the one selected)
  const selectedCategories = useMemo(
    () =>
      categorySlug
        ? featuredCategories.filter((cat) => cat.slug === categorySlug)
        : featuredCategories,
    [featuredCategories, categorySlug],
  );

  const handleFilter = useCallback(
    (slug: string | undefined) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (slug) {
        params.set("category", slug);
      } else {
        params.delete("category");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div>
      {/* ── Filter tabs (shown only when there are 2+ featured categories) ── */}
      {featuredCategories.length > 1 && (
        <div className="container-site mb-14">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="filter-all"
              onClick={() => handleFilter(undefined)}
              className={`border px-6 py-2.5 text-xs tracking-widest2 uppercase transition-all duration-200 ${
                !categorySlug
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-stone/30 text-stone hover:border-charcoal hover:text-charcoal"
              }`}
            >
              All
            </button>

            {featuredCategories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-${cat.slug}`}
                onClick={() => handleFilter(cat.slug)}
                className={`border px-6 py-2.5 text-xs tracking-widest2 uppercase transition-all duration-200 ${
                  categorySlug === cat.slug
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-stone/30 text-stone hover:border-charcoal hover:text-charcoal"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Collection Sections ──────────────────────────────────── */}
      <div className="space-y-24">
        {selectedCategories.map((cat, i) => {
          const items = products
            .filter((p) => p.category.slug === cat.slug)
            .slice(0, 4);

          return (
            <section key={cat.id} id={cat.slug} className="container-site">
              <div
                className={`mb-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    cat.slug === "evening-dresses" || cat.slug === "read-to-wear"
                      ? "aspect-[3/4] lg:aspect-[3/4]"
                      : "aspect-[16/9] lg:aspect-[4/3]"
                  }`}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image in IMG ? IMG[cat.image as ImageKey] : cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-stone/10" />
                  )}
                </div>

                <div>
                  <h2 className="font-display text-3xl tracking-wide">
                    {cat.name}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
                    {cat.description}
                  </p>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="mt-7 inline-block border border-charcoal px-8 py-3 text-xs tracking-widest2 uppercase transition hover:bg-charcoal hover:text-white"
                  >
                    Shop {cat.name}
                  </Link>
                </div>
              </div>

              {items.length > 0 && (
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
                  {items.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
