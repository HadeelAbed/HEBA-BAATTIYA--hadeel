"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Category, Product } from "@/types";
import { ProductCard } from "@/components/shared/product-card";
import { ShopFiltersPanel, ShopFilters, MAX_PRICE } from "@/components/shop/shop-filters";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export function ShopPageClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialFilter = searchParams.get("filter");

  // Only show featured categories in filters — same logic as Collections page
  const featuredCategories = useMemo(
    () => categories.filter((cat) => cat.isFeatured),
    [categories],
  );

  // Color swatches are derived live from the actual colors of the products —
  // no hardcoded list, so the filter always matches what's in the collection.
  const availableColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string; count: number }>();
    for (const p of products) {
      for (const c of p.colors) {
        const existing = map.get(c.name);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(c.name, { name: c.name, hex: c.hexCode, count: 1 });
        }
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [products]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ShopFilters>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, MAX_PRICE],
    colors: [],
    sizes: [],
  });

  const filtered = useMemo(() => {
    let result = [...products];

    if (initialFilter === "new") result = result.filter((p) => p.isNewArrival);
    if (initialFilter === "bestsellers") result = result.filter((p) => p.isBestSeller);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length) {
      result = result.filter((p) => filters.categories.includes(p.category.slug));
    }

    result = result.filter((p) => p.price <= filters.priceRange[1]);

    if (filters.colors.length) {
      result = result.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)));
    }

    if (filters.sizes.length) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s.label)));
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        result.sort((a, b) => b.avgRating - a.avgRating);
        break;
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return result;
  }, [search, filters, sort, initialFilter, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFiltersChange(next: ShopFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="container-site py-12">
      <div className="mb-10 text-center">
        <p className="eyebrow">Full Collection</p>
        <h1 className="mt-3 font-display text-4xl tracking-wide">Shop</h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full border border-mist bg-white py-2.5 pl-9 pr-4 text-sm focus:border-charcoal focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 border border-mist px-4 py-2.5 text-xs tracking-widest2 uppercase lg:hidden"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-mist bg-white px-3 py-2.5 text-xs tracking-widest2 uppercase focus:border-charcoal focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ShopFiltersPanel filters={filters} onChange={handleFiltersChange} categories={featuredCategories} colors={availableColors} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-white p-6 lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <ShopFiltersPanel filters={filters} onChange={handleFiltersChange} categories={featuredCategories} colors={availableColors} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full bg-charcoal py-3.5 text-xs tracking-widest2 uppercase text-white"
            >
              Show {filtered.length} Results
            </button>
          </div>
        )}

        <div>
          <p className="mb-6 text-sm text-stone">{filtered.length} products</p>

          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-xl">No products found</p>
              <p className="mt-2 text-sm text-stone">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {paginated.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center border text-sm transition",
                    p === page ? "border-charcoal bg-charcoal text-white" : "border-mist hover:border-charcoal"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
