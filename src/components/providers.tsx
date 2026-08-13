"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { CartHydrator } from "@/components/cart/cart-hydrator";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartHydrator />
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#161616",
            color: "#F8F8F5",
            border: "none",
            borderRadius: 0,
            fontFamily: "var(--font-poppins)",
            fontSize: "13px",
            letterSpacing: "0.02em",
          },
        }}
      />
    </SessionProvider>
  );
}
