"use client";

import { Bell, Search } from "lucide-react";

export function AdminTopbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-hairline bg-white/95 px-8 backdrop-blur-sm">
      <h1 className="font-display text-xl tracking-wide">{title}</h1>
      <div className="flex items-center gap-5">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 border border-mist bg-white py-2 pl-9 pr-3 text-sm focus:border-charcoal focus:outline-none"
          />
        </div>
        <button aria-label="Notifications" className="relative text-graphite hover:text-charcoal">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-charcoal" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-xs text-white">
            A
          </div>
          <span className="hidden text-sm text-graphite sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
