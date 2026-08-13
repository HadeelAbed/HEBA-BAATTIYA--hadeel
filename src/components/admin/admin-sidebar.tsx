"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FolderTree,
  BarChart3,
  FileText,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Content", href: "/admin/content", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-hairline bg-white lg:flex">
      <div className="flex h-[72px] items-center border-b border-hairline px-6">
        <Logo variant="full" className="h-8 w-auto" href="/admin" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition",
                active ? "bg-charcoal text-white" : "text-graphite hover:bg-bone"
              )}
            >
              <Icon size={16} strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-hairline p-4">
        <Link href="/" className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-stone hover:bg-bone">
          <LogOut size={16} strokeWidth={1.5} />
          Exit to Storefront
        </Link>
      </div>
    </aside>
  );
}
