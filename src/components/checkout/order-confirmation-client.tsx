"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Clock, XCircle } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StoredOrder {
  orderNumber: string;
  items: {
    lineId: string;
    product: { name: string; images: { url: string }[] };
    quantity: number;
    colorName?: string;
    sizeLabel?: string;
  }[];
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    line1: string;
    line2?: string;
    postalCode: string;
    paymentMethod: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
}

export function OrderConfirmationClient({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("hb-last-order");
    if (stored) {
      const parsed = JSON.parse(stored) as StoredOrder;
      if (parsed.orderNumber === orderNumber) setOrder(parsed);
    }
  }, [orderNumber]);

  // For online (card) orders, reflect the live Tap payment status after the
  // customer returns from the payment page. Polls a read-only endpoint.
  useEffect(() => {
    if (!order || order.shipping.paymentMethod === "CASH_ON_DELIVERY") return;

    let attempts = 0;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}/payment-status`);
        if (!res.ok) return;
        const data = await res.json();
        setPaymentStatus(data.paymentStatus as string | null);
        if (data.paymentStatus === "PAID" || data.paymentStatus === "FAILED") {
          clearInterval(timer);
        }
      } catch {
        // keep polling
      }
      attempts += 1;
      if (attempts >= 40) clearInterval(timer);
    }, 3000);

    return () => clearInterval(timer);
  }, [orderNumber, order]);

  return (
    <div className="container-site py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-lg text-center"
      >
        <CheckCircle2
          size={48}
          strokeWidth={1.2}
          className="mx-auto text-charcoal"
        />
        <h1 className="mt-6 font-display text-3xl tracking-wide">
          Order Confirmed
        </h1>
        <p className="mt-3 text-sm text-stone">
          Thank you. Your order has been received and is being prepared.
        </p>
        <p className="mt-6 font-body text-lg tracking-wide">{orderNumber}</p>
        <p className="mt-1 text-xs text-stone">{formatDate(new Date())}</p>
      </motion.div>

      {order && order.shipping.paymentMethod !== "CASH_ON_DELIVERY" && (
        <div className="mx-auto mt-8 max-w-lg">
          {paymentStatus === "PAID" && (
            <div className="flex items-center justify-center gap-2 border border-hairline bg-bone px-4 py-3 text-sm text-graphite">
              <CheckCircle2 size={16} className="text-charcoal" />
              Payment received — your order is confirmed.
            </div>
          )}
          {paymentStatus === "PENDING" && (
            <div className="flex items-center justify-center gap-2 border border-hairline px-4 py-3 text-sm text-graphite">
              <Clock size={16} className="animate-pulse text-stone" />
              Payment is being processed… this page refreshes automatically.
            </div>
          )}
          {paymentStatus === "FAILED" && (
            <div className="flex items-center justify-center gap-2 border border-charcoal bg-bone px-4 py-3 text-sm text-graphite">
              <XCircle size={16} className="text-charcoal" />
              Payment was not completed. Please try again or contact us.
            </div>
          )}
        </div>
      )}

      {order ? (
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="border border-hairline p-7">
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg tracking-wide">
              <Package size={18} strokeWidth={1.4} /> Order Details
            </h2>
            <div className="space-y-4 border-b border-hairline pb-6">
              {order.items.map((item) => (
                <div key={item.lineId} className="flex gap-4">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-bone">
                    <Image
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.product.name}</p>
                    <p className="text-xs text-stone">
                      {[item.colorName, item.sizeLabel]
                        .filter(Boolean)
                        .join(" / ")}{" "}
                      · Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between text-graphite">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-graphite">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-graphite">
                <span>Shipping</span>
                <span>
                  {order.shippingCost === 0
                    ? "Complimentary"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-graphite">
                <span>VAT</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-hairline pt-3 text-base">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-7 border border-hairline p-7">
            <h2 className="mb-4 font-display text-lg tracking-wide">
              Shipping To
            </h2>
            <p className="text-sm text-graphite">{order.shipping.fullName}</p>
            <p className="text-sm text-graphite">
              {order.shipping.line1}
              {order.shipping.line2 ? `, ${order.shipping.line2}` : ""}
            </p>
            <p className="text-sm text-graphite">
              {order.shipping.city}, {order.shipping.country}{" "}
              {order.shipping.postalCode}
            </p>
            <p className="mt-2 text-sm text-graphite">{order.shipping.phone}</p>
            <p className="text-sm text-graphite">{order.shipping.email}</p>
          </div>
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-stone">
          We&apos;ve emailed your full receipt. You can also view this order
          anytime from your account.
        </p>
      )}

      <div className="mx-auto mt-12 flex max-w-lg flex-col gap-3 sm:flex-row">
        <Link href="/dashboard/orders" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            View My Orders
          </Button>
        </Link>
        <Link href="/shop" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
