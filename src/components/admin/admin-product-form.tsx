"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product, Category } from "@/types";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminProductForm({ initial, categories }: { initial?: Product; categories: Category[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images.map((i) => i.url) ?? []);
  const [colors, setColors] = useState<{ name: string; hexCode: string }[]>(
    initial?.colors.map((c) => ({ name: c.name, hexCode: c.hexCode })) ?? [{ name: "Noir", hexCode: "#161616" }]
  );
  const [sizes, setSizes] = useState<string[]>(initial?.sizes.map((s) => s.label) ?? ["XS", "S", "M", "L", "XL"]);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    sku: initial?.sku ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    price: initial?.price?.toString() ?? "",
    compareAtPrice: initial?.compareAtPrice?.toString() ?? "",
    description: initial?.description ?? "",
    fabricDetails: initial?.fabricDetails ?? "",
    careInstructions: initial?.careInstructions ?? "",
    status: initial?.status ?? "DRAFT",
    stockTotal: initial?.stockTotal?.toString() ?? "0",
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      
      // Optimitistic UI preview could go here, but doing it directly for simplicity
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          setImages((prev) => [...prev, data.url]);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: initial?.id,
        name: form.name,
        sku: form.sku,
        description: form.description,
        fabricDetails: form.fabricDetails || undefined,
        careInstructions: form.careInstructions || undefined,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        categoryId: form.categoryId,
        status: form.status,
        colors,
        sizes,
        images: images.filter((src) => !src.startsWith("blob:")),
        stockTotal: Number(form.stockTotal || 0),
      };

      const res = await fetch("/api/admin/products", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      toast.success(initial ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-5 font-display text-lg tracking-wide">Basic Information</h2>
          <div className="space-y-5">
            <Input
              label="Product Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <div>
                <label className="mb-2 block text-xs tracking-wide text-graphite">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border border-mist bg-white px-4 py-3 text-sm focus:border-charcoal focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Textarea
              label="Description"
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Textarea
              label="Fabric & Construction Details"
              rows={3}
              value={form.fabricDetails}
              onChange={(e) => setForm({ ...form, fabricDetails: e.target.value })}
            />
            <Textarea
              label="Care Instructions"
              rows={2}
              value={form.careInstructions}
              onChange={(e) => setForm({ ...form, careInstructions: e.target.value })}
            />
          </div>
        </div>

        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-5 font-display text-lg tracking-wide">Images</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden bg-bone">
                <Image src={src} alt={`Product image ${i + 1}`} fill className="object-contain" sizes="120px" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-charcoal px-1.5 py-0.5 text-[9px] text-white">
                    Primary
                  </span>
                )}
              </div>
            ))}
            <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-mist text-stone transition hover:border-charcoal hover:text-charcoal">
              <Upload size={20} strokeWidth={1.3} />
              <span className="text-xs">Upload</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-5 font-display text-lg tracking-wide">Variants</h2>

          <div className="mb-6">
            <p className="mb-3 text-xs tracking-wide uppercase text-graphite">Colors</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <span key={i} className="flex items-center gap-2 border border-mist px-3 py-1.5 text-xs">
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: c.hexCode }}
                    aria-hidden
                  />
                  {c.name}
                  <span className="text-[10px] text-stone">{c.hexCode}</span>
                  <button type="button" onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <AddColor onAdd={(color) => setColors((prev) => [...prev, color])} />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs tracking-wide uppercase text-graphite">Sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s, i) => (
                <span key={i} className="flex items-center gap-2 border border-mist px-3 py-1.5 text-xs">
                  {s}
                  <button type="button" onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <AddTag onAdd={(val) => setSizes((prev) => [...prev, val])} placeholder="Add size" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-5 font-display text-lg tracking-wide">Pricing</h2>
          <div className="space-y-4">
            <Input
              label="Price (SAR)"
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              label="Compare-at Price (optional)"
              type="number"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-5 font-display text-lg tracking-wide">Inventory</h2>
          <Input
            label="Total Stock"
            type="number"
            value={form.stockTotal}
            onChange={(e) => setForm({ ...form, stockTotal: e.target.value })}
          />
        </div>

        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-5 font-display text-lg tracking-wide">Status</h2>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}
            className="w-full border border-mist bg-white px-4 py-3 text-sm focus:border-charcoal focus:outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
          {initial ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

function AddColor({ onAdd }: { onAdd: (color: { name: string; hexCode: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#161616");

  function submit() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), hexCode: hex });
    setName("");
    setHex("#161616");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 border border-dashed border-mist px-3 py-1.5 text-xs text-stone hover:border-charcoal hover:text-charcoal"
      >
        <Plus size={12} /> Add color
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 border border-charcoal px-2 py-1.5">
      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        aria-label="Pick exact color shade"
        title="Pick exact color shade"
        className="h-7 w-7 cursor-pointer border border-mist bg-white p-0.5"
      />
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Color name"
        className="w-28 border border-mist px-2 py-1 text-xs focus:border-charcoal focus:outline-none"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!name.trim()}
        className="text-xs tracking-widest2 uppercase text-charcoal disabled:opacity-40"
      >
        Add
      </button>
    </div>
  );
}

function AddTag({ onAdd, placeholder }: { onAdd: (value: string) => void; placeholder: string }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 border border-dashed border-mist px-3 py-1.5 text-xs text-stone hover:border-charcoal hover:text-charcoal"
      >
        <Plus size={12} /> {placeholder}
      </button>
    );
  }

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && value.trim()) {
          onAdd(value.trim());
          setValue("");
          setOpen(false);
        }
        if (e.key === "Escape") setOpen(false);
      }}
      onBlur={() => setOpen(false)}
      placeholder="Type and press Enter"
      className="w-32 border border-charcoal px-3 py-1.5 text-xs focus:outline-none"
    />
  );
}
