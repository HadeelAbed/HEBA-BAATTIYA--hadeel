import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-mist text-graphite",
  CONFIRMED: "bg-bone text-graphite border border-mist",
  PROCESSING: "bg-bone text-graphite border border-mist",
  SHIPPED: "bg-charcoal text-white",
  OUT_FOR_DELIVERY: "bg-charcoal text-white",
  DELIVERED: "bg-charcoal text-white",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-red-100 text-red-700",
  RETURNED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  RETURNED: "Returned",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-block px-3 py-1 text-[11px] tracking-wide uppercase", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
