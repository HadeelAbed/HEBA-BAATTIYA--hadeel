"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, Lock, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Profile", href: "/dashboard", icon: User },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
  { label: "Password Settings", href: "/dashboard/settings", icon: Lock },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-shrink-0 items-center gap-3 whitespace-nowrap px-4 py-3 text-sm transition lg:w-56",
                active ? "bg-charcoal text-white" : "text-graphite hover:bg-bone"
              )}
            >
              <Icon size={16} strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
        <button className="flex flex-shrink-0 items-center gap-3 whitespace-nowrap px-4 py-3 text-sm text-stone transition hover:bg-bone lg:w-56">
          <LogOut size={16} strokeWidth={1.5} />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
