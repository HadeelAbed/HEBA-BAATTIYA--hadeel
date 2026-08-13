import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
}) {
  return (
    <div className="border border-hairline bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-widest2 uppercase text-stone">{label}</p>
        <Icon size={18} strokeWidth={1.4} className="text-stone" />
      </div>
      <p className="mt-4 font-display text-2xl tracking-wide">{value}</p>
      {change !== undefined && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-xs",
            change >= 0 ? "text-green-700" : "text-red-600"
          )}
        >
          {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
}
