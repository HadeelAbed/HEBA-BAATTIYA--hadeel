import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserOrderByNumber } from "@/lib/queries";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { OrderTracker } from "@/components/dashboard/order-tracker";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await auth();
  const order = session?.user?.id
    ? await getUserOrderByNumber(session.user.id, orderNumber)
    : null;
  if (!order) notFound();

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/orders" className="text-xs text-stone hover:underline">
            ← Back to Orders
          </Link>
          <h2 className="mt-2 font-display text-xl tracking-wide">{order.orderNumber}</h2>
          <p className="mt-1 text-xs text-stone">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-10 border border-hairline p-7">
        <OrderTracker status={order.status} />
        {order.trackingNumber && (
          <p className="mt-6 border-t border-hairline pt-5 text-sm text-graphite">
            Tracking: <span className="font-medium">{order.trackingNumber}</span> via {order.trackingCarrier}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="border border-hairline p-7">
          <h3 className="mb-5 font-display text-lg tracking-wide">Items</h3>
          <div className="space-y-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-hairline pb-5 last:border-0 last:pb-0">
                <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-bone">
                  {item.productImage && (
                    <Image src={item.productImage} alt={item.productName} fill className="object-contain" sizes="80px" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{item.productName}</p>
                  <p className="mt-1 text-xs text-stone">
                    {[item.colorName, item.sizeLabel].filter(Boolean).join(" / ")} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-hairline p-7">
            <h3 className="mb-4 font-display text-lg tracking-wide">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-graphite">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-graphite">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-graphite">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "Complimentary" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-graphite">
                <span>VAT</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-hairline pt-3 text-base">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="border border-hairline p-7">
            <h3 className="mb-4 font-display text-lg tracking-wide">Shipping Address</h3>
            <p className="text-sm text-graphite">{order.shipFullName}</p>
            <p className="text-sm text-graphite">{order.shipLine1}</p>
            <p className="text-sm text-graphite">
              {order.shipCity}, {order.shipCountry} {order.shipPostal}
            </p>
            <p className="mt-2 text-sm text-graphite">{order.shipPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
