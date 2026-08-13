import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <SiteShell>
      <div className="container-site py-14">
        <h1 className="mb-10 font-display text-4xl tracking-wide">Checkout</h1>
        <CheckoutForm />
      </div>
    </SiteShell>
  );
}
