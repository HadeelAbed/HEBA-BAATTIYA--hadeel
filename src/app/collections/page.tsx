import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { getCategories, getProducts } from "@/lib/queries";
import { CollectionsList } from "@/components/collections/collections-list";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore HEBA BAATTIYA's collections — evening, cocktail, bridal, daywear, and more.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <SiteShell>
      <div className="py-12">
        <div className="container-site mb-16 text-center">
          <p className="eyebrow">Curated by Occasion</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide">
            Collections
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-stone">
            Each collection is designed around a single moment — the entrance,
            the ceremony, the morning after. Explore the pieces built for yours.
          </p>
        </div>

        <div className="space-y-24">
          <Suspense
            fallback={
              <div className="text-center text-stone">Loading collections…</div>
            }
          >
            <CollectionsList categories={categories} products={products} />
          </Suspense>
        </div>
      </div>
    </SiteShell>
  );
}
