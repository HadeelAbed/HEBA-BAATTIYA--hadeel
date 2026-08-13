"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { checkoutSchema } from "@/lib/validations";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, generateOrderNumber, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const TAX_RATE = 0.15;
const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING = 75;

const COUNTRIES = ["Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Bahrain", "Oman", "Egypt", "Jordan"];

const PAYMENT_METHODS: { value: CheckoutFormData["paymentMethod"]; label: string; logo: string }[] = [
  { value: "MADA", label: "mada", logo: "💳" },
  { value: "VISA", label: "Visa", logo: "💳" },
  { value: "MASTERCARD", label: "Mastercard", logo: "💳" },
  { value: "APPLE_PAY", label: "Apple Pay", logo: "🍎" },
  { value: "STC_PAY", label: "STC Pay", logo: "📱" },
  { value: "CASH_ON_DELIVERY", label: "Cash on Delivery", logo: "💰" },
];

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, coupon, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "MADA", country: "Saudi Arabia" },
  });

  const selectedPayment = watch("paymentMethod");

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const discountAmount = coupon
    ? coupon.discountType === "FIXED_AMOUNT"
      ? Math.min(coupon.discountValue, sub)
      : (sub * coupon.discountValue) / 100
    : 0;
  const taxableAmount = Math.max(0, sub - discountAmount);
  const tax = taxableAmount * TAX_RATE;
  const total = Math.max(0, taxableAmount + tax + shipping);

  async function onSubmit(data: CheckoutFormData) {
    setSubmitting(true);

    const payload = {
      ...data,
      lines: lines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
        colorName: line.colorName,
        sizeLabel: line.sizeLabel,
      })),
      couponCode: coupon?.code ?? null,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setSubmitting(false);
      if (res.status === 401) {
        toast.error(body.error ?? "Please sign in to place your order.");
        router.push("/login");
        return;
      }
      toast.error(body.error ?? "Something went wrong. Please try again.");
      return;
    }

    const orderNumber = body.order?.orderNumber ?? generateOrderNumber();
    sessionStorage.setItem(
      "hb-last-order",
      JSON.stringify({
        orderNumber,
        items: lines,
        shipping: data,
        subtotal: sub,
        shippingCost: shipping,
        tax,
        discount: discountAmount,
        total,
      })
    );

    setSubmitting(false);
    clearCart();
    router.push(`/order-confirmation/${orderNumber}`);
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="font-display text-2xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-stone">Add something beautiful before checking out.</p>
        <a href="/shop" className="mt-7 inline-block border border-charcoal px-8 py-3 text-xs tracking-widest2 uppercase">
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
      <div className="space-y-10">
        <section>
          <h2 className="mb-5 font-display text-xl tracking-wide">Contact Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name" placeholder="Your full name" error={errors.fullName?.message} {...register("fullName")} />
            <Input label="Phone" placeholder="+966 5XX XXX XXX" error={errors.phone?.message} {...register("phone")} />
            <div className="sm:col-span-2">
              <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-display text-xl tracking-wide">Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs tracking-wide text-graphite">Country</label>
              <select
                {...register("country")}
                className="w-full border border-mist bg-white px-4 py-3 text-sm focus:border-charcoal focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Input label="City" placeholder="City" error={errors.city?.message} {...register("city")} />
            <div className="sm:col-span-2">
              <Input label="Address" placeholder="Street address, building, apartment" error={errors.line1?.message} {...register("line1")} />
            </div>
            <div className="sm:col-span-2">
              <Input label="Address Line 2 (optional)" placeholder="Nearest landmark" {...register("line2")} />
            </div>
            <Input label="Postal Code" placeholder="00000" error={errors.postalCode?.message} {...register("postalCode")} />
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-display text-xl tracking-wide">Payment Method</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setValue("paymentMethod", method.value)}
                className={cn(
                  "flex flex-col items-center gap-2 border px-4 py-5 text-center transition",
                  selectedPayment === method.value ? "border-charcoal bg-bone" : "border-mist hover:border-graphite"
                )}
              >
                <span className="text-xl" aria-hidden>
                  {method.logo}
                </span>
                <span className="text-xs tracking-wide">{method.label}</span>
              </button>
            ))}
          </div>
          {selectedPayment && selectedPayment !== "CASH_ON_DELIVERY" && (
            <p className="mt-4 flex items-center gap-2 text-xs text-stone">
              <Lock size={13} /> Payment details are collected on the next secure step. No card data is
              stored on our servers.
            </p>
          )}
        </section>
      </div>

      <div className="border border-hairline p-7">
        <h2 className="font-display text-xl tracking-wide">Order Summary</h2>

        <div className="mt-6 max-h-72 space-y-4 overflow-y-auto border-b border-hairline pb-6">
          {lines.map((line) => (
            <div key={line.lineId} className="flex gap-3">
              <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-bone">
                <Image src={line.product.images[0]?.url} alt={line.product.name} fill className="object-contain" sizes="56px" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs leading-snug">{line.product.name}</p>
                <p className="text-[11px] text-stone">{[line.colorName, line.sizeLabel].filter(Boolean).join(" / ")}</p>
              </div>
              <span className="text-xs">{formatPrice(line.product.price * line.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between text-graphite">
            <span>Subtotal</span>
            <span>{formatPrice(sub)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-graphite">
              <span>Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-graphite">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-graphite">
            <span>VAT (15%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-between border-t border-hairline pt-5 font-body text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Button type="submit" variant="primary" size="lg" className="mt-7 w-full" loading={submitting}>
          {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
        </Button>
        <p className="mt-4 text-center text-[11px] text-stone">
          By placing your order, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
