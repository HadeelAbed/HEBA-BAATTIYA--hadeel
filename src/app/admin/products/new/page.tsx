import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { getFeaturedCategories } from "@/lib/queries";

export default async function NewProductPage() {
  const categories = await getFeaturedCategories();

  return (
    <>
      <AdminTopbar title="Add Product" />
      <div className="p-8">
        <AdminProductForm categories={categories} />
      </div>
    </>
  );
}
