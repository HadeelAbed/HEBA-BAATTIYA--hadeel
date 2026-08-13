import { Product } from "@/types";
import { ProductCard } from "@/components/shared/product-card";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="container-site border-t border-hairline py-20">
      <h2 className="mb-10 text-center font-display text-2xl tracking-wide md:text-3xl">
        You May Also Love
      </h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
