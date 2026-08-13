"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {
        toast.error("Failed to load products");
        setProducts([]);
      });
  }, []);

  const filtered = (products ?? []).filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product permanently?")) return;
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to delete product");
      return;
    }
    setProducts((prev) => (prev ?? []).filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  return (
    <>
      <AdminTopbar title="Products" />
      <div className="p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full border border-mist bg-white py-2.5 pl-9 pr-4 text-sm focus:border-charcoal focus:outline-none"
            />
          </div>
          <Link href="/admin/products/new">
            <Button variant="primary" size="md">
              <Plus size={14} /> Add Product
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto border border-hairline bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs tracking-widest2 uppercase text-stone">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products === null && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-stone">
                    Loading products...
                  </td>
                </tr>
              )}
              {products !== null && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-stone">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-hairline last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-bone">
                        <Image src={product.images[0]?.url} alt={product.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone">{product.sku}</td>
                  <td className="px-6 py-4 text-graphite">{product.category.name}</td>
                  <td className="px-6 py-4">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(product.stockTotal < 10 && "text-red-600")}>{product.stockTotal}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs tracking-wide",
                        product.status === "ACTIVE" && "bg-green-100 text-green-700",
                        product.status === "DRAFT" && "bg-bone text-graphite",
                        product.status === "ARCHIVED" && "bg-mist text-graphite"
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-stone hover:text-charcoal" aria-label="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="text-stone hover:text-red-600" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
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
