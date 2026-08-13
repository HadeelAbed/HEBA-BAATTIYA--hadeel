"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { IMG, ImageKey } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isFeatured: boolean;
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);

  function openCreate() {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setIsFeatured(true);
    setFormOpen(true);
  }

  function openEdit(cat: AdminCategory) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setIsFeatured(cat.isFeatured);
    setFormOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setImage(tempUrl);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setImage(data.url);
      else toast.error("Image upload failed");
    } catch {
      toast.error("Image upload failed");
    }
  }

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => {
        toast.error("Failed to load categories");
        setCategories([]);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category?")) return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to delete category");
      return;
    }
    setCategories((prev) => (prev ?? []).filter((c) => c.id !== id));
    toast.success("Category deleted");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = "/api/admin/categories";
    const method = editingId ? "PATCH" : "POST";
    const bodyData = editingId ? { id: editingId, name, description, image, isFeatured } : { name, description, image, isFeatured };
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to save category");
      return;
    }
    
    if (editingId) {
      setCategories((prev) => (prev ?? []).map((c) => c.id === editingId ? { ...c, name: data.category.name, description: data.category.description, image: data.category.image, isFeatured: data.category.isFeatured } : c));
      toast.success("Category updated");
    } else {
      setCategories((prev) => [
        {
          id: data.category.id,
          name: data.category.name,
          slug: data.category.slug,
          description: data.category.description,
          image: data.category.image,
          isFeatured: data.category.isFeatured,
          productCount: 0,
        },
        ...(prev ?? []),
      ]);
      toast.success("Category created");
    }
    
    setName("");
    setDescription("");
    setImage("");
    setIsFeatured(true);
    setEditingId(null);
    setFormOpen(false);
  }

  return (
    <>
      <AdminTopbar title="Categories" />
      <div className="p-8">
        <div className="mb-6 flex justify-end">
          <Button variant="primary" size="md" onClick={openCreate}>
            <Plus size={14} /> Add Category
          </Button>
        </div>

        {formOpen && (
          <form onSubmit={handleSubmit} className="mb-8 border border-hairline bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg">{editingId ? "Edit Category" : "New Category"}</h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Category Name" required value={name} onChange={(e) => setName(e.target.value)} />
              <Textarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              
              <div>
                <label className="mb-2 block text-xs tracking-wide text-graphite">Image</label>
                <div className="flex items-center gap-4">
                  {image && (
                    <div className="relative aspect-square w-16 overflow-hidden border border-hairline bg-bone">
                      <Image src={image.startsWith("blob:") ? image : (image in IMG ? IMG[image as ImageKey] : image)} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 border border-dashed border-mist px-4 py-2 text-xs text-stone hover:border-charcoal hover:text-charcoal">
                    <Upload size={14} />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <span className="text-xs text-mist">OR</span>
                  <input
                    type="text"
                    placeholder="Image URL or Key"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 border border-mist bg-white px-3 py-2 text-sm focus:border-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-charcoal" />
                Featured (shows on main collections page)
              </label>
              <Button type="submit" variant="primary" size="md">
                {editingId ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        )}

        {categories === null && (
          <div className="border border-hairline bg-white p-10 text-center text-sm text-stone">
            Loading categories...
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((cat) => (
            <div key={cat.id} className="overflow-hidden border border-hairline bg-white">
              <div className="relative aspect-square w-full bg-bone">
                <Image
                  src={cat.image?.startsWith("blob:") ? cat.image : (cat.image && cat.image in IMG ? IMG[cat.image as ImageKey] : (cat.image || IMG.blackDressPortrait))}
                  alt={cat.name}
                  fill
                  className="object-contain p-4"
                  sizes="320px"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-body text-sm font-medium">{cat.name}</h3>
                  {cat.isFeatured && (
                    <span className="bg-bone px-2 py-0.5 text-[10px] uppercase text-graphite">Featured</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-stone">{cat.productCount} products</p>
                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4 text-xs">
                  <button onClick={() => openEdit(cat)} className="flex items-center gap-1.5 text-stone hover:text-charcoal">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1.5 text-stone hover:text-red-600">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
