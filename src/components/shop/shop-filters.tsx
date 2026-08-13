"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

export interface ShopFilters {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const MAX_PRICE = 25000;

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-hairline py-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
        aria-expanded={open}
      >
        <span className="font-body text-sm uppercase tracking-wide text-charcoal">{title}</span>
        <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function ShopFiltersPanel({
  filters,
  onChange,
  categories,
  colors,
}: {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  categories: Category[];
  colors: { name: string; hex: string }[];
}) {
  function toggleCategory(slug: string) {
    const exists = filters.categories.includes(slug);
    onChange({
      ...filters,
      categories: exists ? filters.categories.filter((c) => c !== slug) : [...filters.categories, slug],
    });
  }

  function toggleColor(name: string) {
    const exists = filters.colors.includes(name);
    onChange({
      ...filters,
      colors: exists ? filters.colors.filter((c) => c !== name) : [...filters.colors, name],
    });
  }

  function toggleSize(label: string) {
    const exists = filters.sizes.includes(label);
    onChange({
      ...filters,
      sizes: exists ? filters.sizes.filter((s) => s !== label) : [...filters.sizes, label],
    });
  }

  return (
    <div>
      <FilterSection title="Category">
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id}>
              <label className="flex items-center gap-3 text-sm text-graphite">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="h-4 w-4 rounded-none border-mist text-charcoal focus:ring-0"
                />
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={500}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
            }
            className="w-full accent-charcoal"
          />
          <div className="flex justify-between text-xs text-stone">
            <span>SAR 0</span>
            <span>SAR {filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              aria-label={color.name}
              aria-pressed={filters.colors.includes(color.name)}
              className={cn(
                "h-8 w-8 rounded-full border transition",
                filters.colors.includes(color.name) ? "ring-2 ring-charcoal ring-offset-2" : "border-mist"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              aria-pressed={filters.sizes.includes(size)}
              className={cn(
                "flex h-9 w-9 items-center justify-center border text-xs transition",
                filters.sizes.includes(size)
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-mist text-graphite hover:border-charcoal"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <button
        onClick={() => onChange({ categories: [], priceRange: [0, MAX_PRICE], colors: [], sizes: [] })}
        className="mt-6 text-xs tracking-widest2 uppercase text-stone underline-offset-4 hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export { MAX_PRICE };
