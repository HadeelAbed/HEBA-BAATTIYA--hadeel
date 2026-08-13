"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart-store";

export function CartHydrator() {
  const hydrate = useCartStore((s) => s.hydrate);
  const { status } = useSession();
  const prevStatus = useRef(status);

  useEffect(() => {
    if (status !== "loading") {
      // On sign-out, clear the previous user's cart so it doesn't leak to the next person
      if (prevStatus.current === "authenticated" && status === "unauthenticated") {
        useCartStore.setState({ lines: [], coupon: null });
      }
      prevStatus.current = status;
      hydrate();
    }
  }, [hydrate, status]);

  return null;
}
