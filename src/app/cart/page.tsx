"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, Tag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TAX_RATE = 0.15; // 15% VAT (Saudi Arabia)
const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING = 75;

export default function CartPage() {
  const { lines, removeItem, updateQuantity, subtotal, applyCoupon, removeCoupon, coupon } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD || sub === 0 ? 0 : STANDARD_SHIPPING;
  const discountAmount = coupon
    ? coupon.discountType === "FIXED_AMOUNT"
      ? Math.min(coupon.discountValue, sub)
      : (sub * coupon.discountValue) / 100
    : 0;
  const taxableAmount = Math.max(0, sub - discountAmount);
  const tax = taxableAmount * TAX_RATE;
  const total = Math.max(0, taxableAmount + tax + shipping);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    const result = await applyCoupon(couponInput, sub);
    if (result.success) {
      toast.success("Coupon applied", { description: result.message });
    } else {
      toast.error(result.message);
    }
  }

  return (
    <SiteShell>
      <div className="container-site py-14">
        <h1 className="mb-10 font-display text-4xl tracking-wide">Shopping Bag</h1>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-2xl">Your bag is empty</p>
            <p className="mt-2 text-sm text-stone">Discover pieces designed to last beyond the season.</p>
            <Link href="/shop">
              <Button variant="primary" size="lg" className="mt-8">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="hidden border-b border-hairline pb-4 text-xs tracking-widest2 uppercase text-stone md:grid md:grid-cols-[100px_1fr_120px_100px_100px]">
                <span>Item</span>
                <span></span>
                <span>Quantity</span>
                <span>Price</span>
                <span></span>
              </div>

              {lines.map((line) => (
                <div
                  key={line.lineId}
                  className="grid grid-cols-[80px_1fr] gap-4 border-b border-hairline py-6 md:grid-cols-[100px_1fr_120px_100px_100px] md:items-center md:gap-4"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-bone">
                    <Image src={line.product.images[0]?.url} alt={line.product.name} fill className="object-contain" sizes="100px" />
                  </div>

                  <div>
                    <Link href={`/product/${line.product.slug}`} className="font-body text-sm hover:underline">
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-stone">
                      {[line.colorName, line.sizeLabel].filter(Boolean).join(" / ")}
                    </p>
                    <p className="mt-1 text-xs text-stone md:hidden">{formatPrice(line.product.price)}</p>
                  </div>

                  <div className="col-span-2 mt-4 flex items-center justify-between md:col-span-1 md:mt-0 md:justify-start">
                    <div className="flex items-center border border-mist">
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        className="p-2.5 hover:bg-bone"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        className="p-2.5 hover:bg-bone"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(line.lineId)}
                      className="ml-4 text-stone hover:text-charcoal md:hidden"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <span className="hidden text-sm md:block">{formatPrice(line.product.price)}</span>

                  <div className="hidden items-center justify-between md:flex">
                    <span className="text-sm">{formatPrice(line.product.price * line.quantity)}</span>
                    <button
                      onClick={() => removeItem(line.lineId)}
                      className="text-stone hover:text-charcoal"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 text-xs tracking-widest2 uppercase text-charcoal hover:opacity-60"
              >
                ← Continue Shopping
              </Link>
            </div>

            <div className="border border-hairline p-7">
              <h2 className="font-display text-xl tracking-wide">Order Summary</h2>

              <div className="mt-6 space-y-3 border-b border-hairline pb-6 text-sm">
                <div className="flex justify-between text-graphite">
                  <span>Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-graphite">
                    <span>Discount ({coupon?.code})</span>
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

              <div className="my-6">
                {coupon ? (
                  <div className="flex items-center justify-between border border-charcoal bg-bone px-4 py-3">
                    <span className="flex items-center gap-2 text-xs">
                      <Tag size={14} /> {coupon.code}
                    </span>
                    <button onClick={removeCoupon} className="text-xs text-stone underline-offset-2 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 border border-mist px-3 py-2.5 text-sm focus:border-charcoal focus:outline-none"
                    />
                    <Button variant="secondary" size="sm" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-stone">Try: HBWELCOME10, HBVIP20, or HB500</p>
              </div>

              <div className="flex justify-between border-t border-hairline pt-5 font-body text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Link href="/checkout">
                <Button variant="primary" size="lg" className="mt-7 w-full">
                  Proceed to Checkout <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
