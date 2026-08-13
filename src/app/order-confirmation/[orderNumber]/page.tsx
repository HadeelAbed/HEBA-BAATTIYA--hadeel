import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { OrderConfirmationClient } from "@/components/checkout/order-confirmation-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return (
    <SiteShell>
      <OrderConfirmationClient orderNumber={orderNumber} />
    </SiteShell>
  );
}
