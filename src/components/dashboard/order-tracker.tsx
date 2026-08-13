import { Check } from "lucide-react";
import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export function OrderTracker({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const isTerminalIssue = ["CANCELLED", "REFUNDED", "RETURNED"].includes(status);

  if (isTerminalIssue) {
    return (
      <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        This order was {status.toLowerCase()}. Contact support if you have questions.
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs",
                  reached ? "border-charcoal bg-charcoal text-white" : "border-mist text-stone"
                )}
              >
                {reached ? <Check size={14} /> : i + 1}
              </div>
              {!isLast && (
                <div className={cn("h-px flex-1", i < currentIndex ? "bg-charcoal" : "bg-mist")} />
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-center text-[11px] tracking-wide",
                reached ? "text-charcoal" : "text-stone"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
