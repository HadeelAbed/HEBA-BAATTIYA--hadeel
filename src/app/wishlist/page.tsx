import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { WishlistPageClient } from "@/components/shared/wishlist-page-client";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <SiteShell>
      <WishlistPageClient />
    </SiteShell>
  );
}
