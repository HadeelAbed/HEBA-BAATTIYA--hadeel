"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const pathname = usePathname();
  const { status } = useSession();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    fetch("/api/admin/content?key=announcement")
      .then((r) => r.json())
      .then((d) => setAnnouncement(d.content ?? ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isTransparent = transparentOnTop && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isTransparent ? "bg-transparent py-6" : "bg-white/95 py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md"
        )}
      >
        {announcement && (
          <div className="absolute inset-x-0 top-0 bg-charcoal px-4 py-2 text-center text-[11px] tracking-widest uppercase text-ivory">
            {announcement}
          </div>
        )}
        <div className={cn("container-site flex items-center justify-between", announcement && "pt-9")}>
          <button
            className="flex w-8 items-center justify-start lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={22} className={isTransparent ? "text-white" : "text-charcoal"} />
            ) : (
              <Menu size={22} className={isTransparent ? "text-white" : "text-charcoal"} />
            )}
          </button>

          <nav className="hidden flex-1 items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-[13px] tracking-widest2 uppercase transition-opacity hover:opacity-60",
                  isTransparent ? "text-white" : "text-charcoal",
                  pathname === link.href && "opacity-100 underline underline-offset-8"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 justify-center lg:flex-none">
            <Logo
              variant="full"
              theme={isTransparent ? "light" : "dark"}
              className="h-10 w-auto md:h-12"
              priority
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-5">
            <button
              aria-label="Search"
              className={cn("hidden transition-opacity hover:opacity-60 sm:block", isTransparent ? "text-white" : "text-charcoal")}
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link
              href={status === "authenticated" ? "/dashboard" : "/login"}
              aria-label="Account"
              className={cn("hidden transition-opacity hover:opacity-60 sm:block", isTransparent ? "text-white" : "text-charcoal")}
            >
              <User size={19} strokeWidth={1.5} />
            </Link>
            {status === "authenticated" && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={cn(
                  "hidden text-[11px] tracking-widest2 uppercase transition-opacity hover:opacity-60 md:block",
                  isTransparent ? "text-white" : "text-charcoal"
                )}
              >
                Sign Out
              </button>
            )}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={cn("relative transition-opacity hover:opacity-60", isTransparent ? "text-white" : "text-charcoal")}
            >
              <Heart size={19} strokeWidth={1.5} />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-[9px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className={cn("relative transition-opacity hover:opacity-60", isTransparent ? "text-white" : "text-charcoal")}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {hydrated && itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-[9px] text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white pt-24"
          >
            <nav className="container-site flex flex-col gap-6 py-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-display text-2xl tracking-wide text-charcoal"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 flex gap-8 border-t border-hairline pt-6">
                {status === "authenticated" ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="text-xs tracking-widest2 uppercase"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link href="/login" className="text-xs tracking-widest2 uppercase" onClick={() => setMobileOpen(false)}>
                    Account
                  </Link>
                )}
                <Link href="/wishlist" className="text-xs tracking-widest2 uppercase" onClick={() => setMobileOpen(false)}>
                  Wishlist
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
