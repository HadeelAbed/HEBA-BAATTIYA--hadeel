import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="container-site py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl tracking-wide">Terms & Conditions</h1>
          <p className="mt-3 text-sm text-stone">Last updated: June 1, 2026</p>

          <div className="prose prose-sm mt-10 max-w-none space-y-7 font-body text-[15px] leading-relaxed text-graphite [&_h2]:font-display [&_h2]:text-xl [&_h2]:tracking-wide [&_h2]:text-charcoal [&_h2]:mt-10 [&_h2]:mb-3">
            <p>
              These Terms & Conditions govern your use of the Heba Baattiya website and your
              purchase of any products from us. By placing an order, you agree to these terms.
            </p>

            <h2>Orders & Acceptance</h2>
            <p>
              All orders are subject to acceptance and availability. We reserve the right to refuse
              or cancel any order for reasons including product availability, pricing errors, or
              suspected fraudulent activity. You will be notified and fully refunded if your order
              is cancelled.
            </p>

            <h2>Pricing & Payment</h2>
            <p>
              All prices are listed in Saudi Riyals (SAR) and include applicable VAT unless stated
              otherwise. We accept Mada, Visa, Mastercard, Apple Pay, and STC Pay. Payment is
              processed at the time of order.
            </p>

            <h2>Made-to-Measure & Bridal Orders</h2>
            <p>
              Made-to-measure and bridal pieces are produced according to the measurements and
              specifications confirmed during your consultation. These orders are final sale and
              non-refundable once production has begun, given their custom nature.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on this site — including designs, photography, text, and the Heba
              Baattiya name and monogram — is the property of Heba Baattiya and may not be
              reproduced without written permission.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Heba Baattiya is not liable for indirect, incidental, or consequential damages arising
              from the use of our products or website, to the fullest extent permitted by law.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes
              shall be subject to the exclusive jurisdiction of the competent courts of Jeddah.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of our site after changes
              are posted constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
