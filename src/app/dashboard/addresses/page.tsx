"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Address } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  async function fetchAddresses() {
    setLoading(true);
    try {
      const res = await fetch("/api/user/addresses");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAddresses(data.addresses ?? []);
    } catch {
      toast.error("Could not load addresses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed");
    } catch {
      toast.error("Could not delete address");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error();
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      toast.success("Default address updated");
    } catch {
      toast.error("Could not update address");
    }
  }

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setFormOpen(true);
  }

  async function handleSave(data: Omit<Address, "id" | "isDefault">) {
    try {
      if (editing) {
        const res = await fetch(`/api/user/addresses/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setAddresses((prev) => prev.map((a) => (a.id === editing.id ? json.address : a)));
        toast.success("Address updated");
      } else {
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setAddresses((prev) => [...prev, json.address]);
        toast.success("Address added");
      }
      setFormOpen(false);
    } catch {
      toast.error("Could not save address");
    }
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <h2 className="font-display text-xl tracking-wide">Saved Addresses</h2>
        <Button variant="secondary" size="sm" onClick={openNew}>
          <Plus size={14} /> Add Address
        </Button>
      </div>

      {formOpen && (
        <AddressForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center py-16 text-center">
          <MapPin size={32} strokeWidth={1} className="text-mist" />
          <p className="mt-4 text-sm text-stone">Loading addresses…</p>
        </div>
      ) : addresses.length === 0 && !formOpen ? (
        <div className="flex flex-col items-center py-16 text-center">
          <MapPin size={32} strokeWidth={1} className="text-mist" />
          <p className="mt-4 text-sm text-stone">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="border border-hairline p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest2 uppercase text-stone">{address.label ?? "Address"}</span>
                {address.isDefault && (
                  <span className="bg-bone px-2 py-0.5 text-[10px] tracking-wide uppercase text-graphite">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm">{address.fullName}</p>
              <p className="text-sm text-graphite">{address.line1}</p>
              <p className="text-sm text-graphite">
                {address.city}, {address.country} {address.postalCode}
              </p>
              <p className="mt-2 text-sm text-stone">{address.phone}</p>

              <div className="mt-4 flex items-center gap-4 border-t border-hairline pt-4 text-xs">
                <button onClick={() => openEdit(address)} className="flex items-center gap-1.5 hover:underline">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="flex items-center gap-1.5 text-stone hover:underline">
                  <Trash2 size={12} /> Delete
                </button>
                {!address.isDefault && (
                  <button onClick={() => handleSetDefault(address.id)} className="ml-auto hover:underline">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Address | null;
  onCancel: () => void;
  onSave: (data: Omit<Address, "id" | "isDefault">) => void;
}) {
  const [form, setForm] = useState({
    label: initial?.label ?? "",
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    country: initial?.country ?? "Saudi Arabia",
    city: initial?.city ?? "",
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    postalCode: initial?.postalCode ?? "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="mb-8 border border-hairline p-6"
    >
      <h3 className="mb-5 font-body text-sm uppercase tracking-wide">{initial ? "Edit Address" : "New Address"}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Label (e.g. Home)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <Input label="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="Postal Code" required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <div className="sm:col-span-2">
          <Input label="Address" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button type="submit" variant="primary" size="sm">
          Save Address
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
