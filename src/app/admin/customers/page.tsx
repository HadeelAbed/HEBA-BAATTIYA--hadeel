"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { formatPrice, formatDate } from "@/lib/utils";

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers ?? []))
      .catch(() => {
        toast.error("Failed to load customers");
        setCustomers([]);
      });
  }, []);

  const filtered = (customers ?? []).filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminTopbar title="Customers" />
      <div className="p-8">
        <div className="mb-6 relative w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full border border-mist bg-white py-2.5 pl-9 pr-4 text-sm focus:border-charcoal focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto border border-hairline bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs tracking-widest2 uppercase text-stone">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3 text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers === null && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-stone">
                    Loading customers...
                  </td>
                </tr>
              )}
              {customers !== null && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-stone">
                    No customers found.
                  </td>
                </tr>
              )}
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-hairline last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bone text-xs">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-graphite">{customer.email}</td>
                  <td className="px-6 py-4 text-graphite">{customer.phone ?? "—"}</td>
                  <td className="px-6 py-4 text-graphite">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-4">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-right">{formatPrice(customer.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
