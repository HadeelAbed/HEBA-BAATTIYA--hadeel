import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 text-xs tracking-widest2 uppercase transition disabled:cursor-not-allowed disabled:opacity-50",
          variant === "primary" && "bg-charcoal text-white hover:bg-graphite",
          variant === "secondary" && "border border-charcoal text-charcoal hover:bg-charcoal hover:text-white",
          variant === "ghost" && "text-charcoal hover:opacity-60",
          variant === "danger" && "border border-red-700 text-red-700 hover:bg-red-700 hover:text-white",
          size === "sm" && "px-4 py-2 text-[11px]",
          size === "md" && "px-7 py-3",
          size === "lg" && "px-9 py-4",
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
