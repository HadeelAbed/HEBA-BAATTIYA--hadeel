import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Truck, RotateCcw, Globe, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Shipping timelines, costs, and our return and exchange policy.",
};

export default function ShippingReturnsPage() {
  return (
    <SiteShell>
      <div className="container-site py-16">
        <div className="mb-14 text-center">
          <p className="eyebrow">Client Care</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide">
            Shipping & Returns
          </h1>
        </div>

        <div className="mx-auto max-w-3xl space-y-14">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <Truck size={20} strokeWidth={1.4} />
              <h2 className="font-display text-2xl tracking-wide">Shipping</h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-graphite">
              <p>
                Domestic (Saudi Arabia): 2–4 business days. Complimentary on
                orders over SAR 2,000, otherwise SAR 75.
              </p>
              <p>
                GCC (UAE, Kuwait, Qatar, Bahrain, Oman): 3–7 business days. Flat
                rate SAR 120.
              </p>
              <p>
                International: 7–14 business days. Rates calculated at checkout
                based on destination and weight.
              </p>
              <p>
                Made-to-measure and bridal pieces follow a separate production
                timeline communicated at the time of order, typically 6–8 weeks.
              </p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <RotateCcw size={20} strokeWidth={1.4} />
              <h2 className="font-display text-2xl tracking-wide">
                Returns & Exchanges
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-graphite">
              <p>
                Ready-to-wear pieces may be returned within 14 days of delivery,
                provided items are unworn, unwashed, and have all original tags
                attached.
              </p>
              <p>
                To initiate a return, visit your account dashboard and select
                &quot;Request Return&quot; on the relevant order. We&apos;ll
                arrange a complimentary pickup within Saudi Arabia and the GCC;
                international returns are the customer&apos;s responsibility
                unless the item arrived damaged or incorrect.
              </p>
              <p>
                Refunds are issued to the original payment method within 5–10
                business days of receiving the returned item.
              </p>
              <p className="font-medium text-charcoal">
                Bridal gowns and made-to-measure pieces are final sale and
                cannot be returned or exchanged due to their custom nature.
              </p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <Globe size={20} strokeWidth={1.4} />
              <h2 className="font-display text-2xl tracking-wide">
                Customs & Duties
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-graphite">
              International orders may be subject to import duties and taxes
              levied by the destination country. These charges are the
              responsibility of the recipient and are not included in our
              shipping rates.
            </p>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <PackageCheck size={20} strokeWidth={1.4} />
              <h2 className="font-display text-2xl tracking-wide">
                Damaged or Incorrect Items
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-graphite">
              If your order arrives damaged or incorrect, contact our concierge
              team within 48 hours of delivery with photos of the item and
              packaging, and we&apos;ll arrange a replacement or full refund at
              no cost to you.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
