"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { formatPrice, formatDate } from "@/lib/utils";

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

interface AddAdminForm {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

const EMPTY_FORM: AddAdminForm = { name: "", email: "", password: "", role: "ADMIN" };

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddAdminForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  function load() {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers ?? []))
      .catch(() => {
        toast.error("Failed to load customers");
        setCustomers([]);
      });
  }

  useEffect(() => {
    load();
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => setIsSuperAdmin(s?.user?.role === "SUPER_ADMIN"))
      .catch(() => {});
  }, []);

  const filtered = (customers ?? []).filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  async function createAdmin(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "Failed to add admin");
        return;
      }
      toast.success(`${body.user.email} is now ${body.user.role === "SUPER_ADMIN" ? "super admin" : "admin"}`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch {
      toast.error("Failed to add admin");
    } finally {
      setCreating(false);
    }
  }

  async function changeRole(c: AdminCustomer) {
    const nextRole = c.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    setBusyId(c.id);
    try {
      const res = await fetch(`/api/admin/customers/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "Failed to update role");
        return;
      }
      toast.success(nextRole === "ADMIN" ? `${c.email} is now an admin` : `Admin access removed for ${c.email}`);
      load();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <AdminTopbar title="Customers" />
      <div className="p-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full border border-mist bg-white py-2.5 pl-9 pr-4 text-sm focus:border-charcoal focus:outline-none"
            />
          </div>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-sm bg-charcoal px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              <UserPlus size={15} strokeWidth={1.5} />
              {showForm ? "Cancel" : "Add Admin"}
            </button>
          )}
        </div>

        {isSuperAdmin && showForm && (
          <form
            onSubmit={createAdmin}
            className="mb-6 grid grid-cols-1 gap-4 border border-hairline bg-white p-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone">Name (optional)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rania"
                className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-charcoal focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-charcoal focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone">Password (min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-charcoal focus:outline-none"
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <label className="mb-1.5 block text-xs font-medium text-stone">Role</label>
              <div className="flex items-center gap-4">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as AddAdminForm["role"] })}
                  className="flex-1 border border-mist bg-white px-3 py-2.5 text-sm focus:border-charcoal focus:outline-none"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-sm bg-charcoal px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? "Adding..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="overflow-x-auto border border-hairline bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs tracking-widest2 uppercase text-stone">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3 text-right">Total Spent</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers === null && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-stone">
                    Loading customers...
                  </td>
                </tr>
              )}
              {customers !== null && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-stone">
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
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                        customer.role === "SUPER_ADMIN"
                          ? "bg-charcoal text-white"
                          : customer.role === "ADMIN"
                            ? "bg-[#e8e3da] text-charcoal"
                            : "bg-bone text-stone"
                      }`}
                    >
                      {customer.role === "SUPER_ADMIN" ? "Super Admin" : customer.role === "ADMIN" ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-graphite">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-4">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-right">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-6 py-4 text-right">
                    {customer.role === "SUPER_ADMIN" ? (
                      <span className="text-xs text-stone">—</span>
                    ) : (
                      <button
                        onClick={() => changeRole(customer)}
                        disabled={busyId === customer.id}
                        className="text-xs font-medium text-charcoal underline underline-offset-2 hover:opacity-60 disabled:opacity-40"
                      >
                        {busyId === customer.id
                          ? "Updating..."
                          : customer.role === "ADMIN"
                            ? "Remove admin"
                            : "Make admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
