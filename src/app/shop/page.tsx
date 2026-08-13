import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { getProducts, getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full HEBA BAATTIYA collection of evening, cocktail, and bridal couture.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <SiteShell>
      <Suspense fallback={<div className="container-site py-24 text-center text-stone">Loading…</div>}>
        <ShopPageClient products={products} categories={categories} />
      </Suspense>
    </SiteShell>
  );
}
