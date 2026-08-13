"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Coupon } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, cn } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as Coupon["discountType"],
    discountValue: "",
  });

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => setCoupons(data.coupons ?? []))
      .catch(() => {
        toast.error("Failed to load coupons");
        setCoupons([]);
      });
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to update coupon");
      return;
    }
    setCoupons((prev) => (prev ?? []).map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    toast.success(!isActive ? "Coupon activated" : "Coupon deactivated");
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this coupon?")) return;
    const res = await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to delete coupon");
      return;
    }
    setCoupons((prev) => (prev ?? []).filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to create coupon");
      return;
    }
    const created: Coupon = {
      id: data.coupon.id,
      code: data.coupon.code,
      description: data.coupon.description ?? undefined,
      discountType: data.coupon.discountType,
      discountValue: Number(data.coupon.discountValue),
      usedCount: data.coupon.usedCount,
      isActive: data.coupon.isActive,
      maxUses: data.coupon.maxUses ?? undefined,
      minOrderAmount: data.coupon.minOrderAmount ? Number(data.coupon.minOrderAmount) : undefined,
      expiresAt: data.coupon.expiresAt ?? undefined,
    };
    setCoupons((prev) => [created, ...(prev ?? [])]);
    setForm({ code: "", description: "", discountType: "PERCENTAGE", discountValue: "" });
    setFormOpen(false);
    toast.success("Coupon created");
  }

  return (
    <>
      <AdminTopbar title="Coupons" />
      <div className="p-8">
        <div className="mb-6 flex justify-end">
          <Button variant="primary" size="md" onClick={() => setFormOpen(true)}>
            <Plus size={14} /> Create Coupon
          </Button>
        </div>

        {formOpen && (
          <form onSubmit={handleCreate} className="mb-8 border border-hairline bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg">New Coupon</h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Coupon Code"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              <div>
                <label className="mb-2 block text-xs tracking-wide text-graphite">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as Coupon["discountType"] })}
                  className="w-full border border-mist bg-white px-4 py-3 text-sm focus:border-charcoal focus:outline-none"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>
              <Input
                label="Discount Value"
                type="number"
                required
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
              />
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="mt-5">
              Create Coupon
            </Button>
          </form>
        )}

        <div className="overflow-x-auto border border-hairline bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs tracking-widest2 uppercase text-stone">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Discount</th>
                <th className="px-6 py-3">Used</th>
                <th className="px-6 py-3">Expires</th>
                <th className="px-6 py-3">Active</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons === null && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-stone">
                    Loading coupons...
                  </td>
                </tr>
              )}
              {coupons !== null && coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-stone">
                    No coupons yet.
                  </td>
                </tr>
              )}
              {(coupons ?? []).map((coupon) => (
                <tr key={coupon.id} className="border-b border-hairline last:border-0">
                  <td className="px-6 py-4 font-mono font-medium">{coupon.code}</td>
                  <td className="px-6 py-4 text-graphite">{coupon.description}</td>
                  <td className="px-6 py-4">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : coupon.discountType === "FIXED_AMOUNT"
                      ? `SAR ${coupon.discountValue}`
                      : "Free Shipping"}
                  </td>
                  <td className="px-6 py-4 text-graphite">
                    {coupon.usedCount}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-6 py-4 text-graphite">{coupon.expiresAt ? formatDate(coupon.expiresAt) : "—"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(coupon.id, coupon.isActive)}
                      className={cn(
                        "relative h-5 w-9 rounded-full transition",
                        coupon.isActive ? "bg-charcoal" : "bg-mist"
                      )}
                      aria-label="Toggle active"
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
                          coupon.isActive ? "left-4" : "left-0.5"
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(coupon.id)} className="text-stone hover:text-red-600" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
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
