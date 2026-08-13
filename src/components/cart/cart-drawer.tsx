"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            className="fixed inset-0 z-[60] bg-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <h2 className="font-display text-lg tracking-wide">
                Your Bag {lines.length > 0 && <span className="text-stone">({lines.length})</span>}
              </h2>
              <button onClick={onClose} aria-label="Close cart" className="p-1 hover:opacity-60">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={32} className="text-mist" strokeWidth={1} />
                <p className="font-body text-sm text-stone">Your bag is empty.</p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-2 border border-charcoal px-6 py-2.5 text-xs tracking-widest2 uppercase transition hover:bg-charcoal hover:text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <div key={line.lineId} className="flex gap-4 border-b border-hairline py-5">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-bone">
                        <Image
                          src={line.product.images[0]?.url}
                          alt={line.product.name}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/product/${line.product.slug}`}
                            onClick={onClose}
                            className="font-body text-sm leading-snug hover:underline"
                          >
                            {line.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(line.lineId)}
                            aria-label={`Remove ${line.product.name}`}
                            className="text-stone hover:text-charcoal"
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-stone">
                          {[line.colorName, line.sizeLabel].filter(Boolean).join(" / ")}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-mist">
                            <button
                              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                              className="p-1.5 hover:bg-bone"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-xs">{line.quantity}</span>
                            <button
                              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                              className="p-1.5 hover:bg-bone"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-body text-sm">
                            {formatPrice(line.product.price * line.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-hairline px-6 py-5">
                  <div className="mb-4 flex items-center justify-between font-body text-sm">
                    <span className="text-stone">Subtotal</span>
                    <span className="text-base">{formatPrice(subtotal())}</span>
                  </div>
                  <p className="mb-4 text-xs text-stone">Shipping and taxes calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className={cn(
                      "block w-full bg-charcoal py-3.5 text-center text-xs tracking-widest2 uppercase text-white transition hover:bg-graphite"
                    )}
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="mt-3 block w-full border border-charcoal py-3.5 text-center text-xs tracking-widest2 uppercase transition hover:bg-charcoal hover:text-white"
                  >
                    View Bag
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
