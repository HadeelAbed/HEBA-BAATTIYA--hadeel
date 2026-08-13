"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CustomerUser } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm({ user }: { user: CustomerUser }) {
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    phone: user.phone ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Could not update your profile.");
      return;
    }

    toast.success("Profile updated");
  }

  return (
    <div className="max-w-lg">
      <h2 className="mb-1 font-display text-xl tracking-wide">Profile</h2>
      <p className="mb-7 text-sm text-stone">
        Member since{" "}
        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={form.email}
          disabled
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Button type="submit" variant="primary" size="md" loading={saving}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
