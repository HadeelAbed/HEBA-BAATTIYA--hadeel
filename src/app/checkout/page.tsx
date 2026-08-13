import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <div className="container-site py-14">
        <h1 className="mb-10 font-display text-4xl tracking-wide">Checkout</h1>
        <CheckoutForm />
      </div>
    </SiteShell>
  );
}
