import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/queries";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";

export const dynamic = "force-dynamic";

export default async function DashboardOrdersPage() {
  const session = await auth();
  const orders = session?.user?.id ? await getUserOrders(session.user.id) : [];

  return (
    <div>
      <h2 className="mb-7 font-display text-xl tracking-wide">Order History</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Package size={32} strokeWidth={1} className="text-mist" />
          <p className="mt-4 text-sm text-stone">
            You haven&apos;t placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.orderNumber}`}
              className="block border border-hairline p-6 transition hover:border-graphite"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-body text-sm">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-stone">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-hairline pt-5">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="h-12 w-10 overflow-hidden border-2 border-white bg-bone"
                      style={{
                        backgroundImage: `url(${item.productImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>
                <span className="ml-auto font-body text-sm">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
