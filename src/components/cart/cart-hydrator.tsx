"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart-store";

export function CartHydrator() {
  const hydrate = useCartStore((s) => s.hydrate);
  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      hydrate();
    }
  }, [hydrate, status]);

  return null;
}
