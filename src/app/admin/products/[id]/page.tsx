import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { getProductById, getFeaturedCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getFeaturedCategories()]);
  if (!product) notFound();

  return (
    <>
      <AdminTopbar title="Edit Product" />
      <div className="p-8">
        <AdminProductForm initial={product} categories={categories} />
      </div>
    </>
  );
}
