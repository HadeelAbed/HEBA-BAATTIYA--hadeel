import { Star } from "lucide-react";
import { Product } from "@/types";

const MOCK_REVIEWS = [
  {
    name: "Sara M.",
    rating: 5,
    title: "Exquisite craftsmanship",
    comment:
      "The fabric quality is unlike anything I've felt off the rack. Fit was true to size and the finishing on the seams is flawless.",
    date: "2026-04-12",
    verified: true,
  },
  {
    name: "Lina A.",
    rating: 5,
    title: "Worth every riyal",
    comment: "I wore this to a gala and received compliments all night. The structure holds beautifully without feeling stiff.",
    date: "2026-03-28",
    verified: true,
  },
  {
    name: "Noura K.",
    rating: 4,
    title: "Beautiful, runs slightly long",
    comment: "Stunning dress — just have it tailored if you're under 165cm. The atelier alterations service was excellent.",
    date: "2026-03-02",
    verified: true,
  },
];

export function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="container-site border-t border-hairline py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide md:text-3xl">Client Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(product.avgRating) ? "fill-charcoal text-charcoal" : "text-mist"}
                />
              ))}
            </div>
            <span className="text-sm text-stone">
              {product.avgRating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {MOCK_REVIEWS.map((review, i) => (
            <div key={i} className="border-b border-hairline pb-8">
              <div className="flex items-center justify-between">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className={j < review.rating ? "fill-charcoal text-charcoal" : "text-mist"}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone">
                  {new Date(review.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
              <h4 className="mt-3 font-body text-sm font-medium text-charcoal">{review.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{review.comment}</p>
              <p className="mt-3 text-xs text-stone">
                {review.name} {review.verified && "· Verified Purchase"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
