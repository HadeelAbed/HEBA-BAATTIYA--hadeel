import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <div className="container-site py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl tracking-wide">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-stone">Last updated: June 1, 2026</p>

          <div className="prose prose-sm mt-10 max-w-none space-y-7 font-body text-[15px] leading-relaxed text-graphite [&_h2]:font-display [&_h2]:text-xl [&_h2]:tracking-wide [&_h2]:text-charcoal [&_h2]:mt-10 [&_h2]:mb-3">
            <p>
              Heba Baattiya (“we,” “our,” “us”) respects your privacy. This
              policy explains what personal information we collect, how we use
              it, and the choices you have.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name,
              email, phone number, shipping address, and payment details when
              you create an account, place an order, or contact our concierge
              team. We also collect technical information automatically,
              including your IP address, browser type, and browsing behavior on
              our site through cookies and similar technologies.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              We use your information to process orders, provide customer
              support, send order and shipping updates, personalize your
              shopping experience, and — with your consent — send marketing
              communications about new collections and private events. We do not
              sell your personal information to third parties.
            </p>

            <h2>Payment Information</h2>
            <p>
              Payment card details are processed directly by our PCI-compliant
              payment partners (including providers supporting Mada, Visa,
              Mastercard, Apple Pay, and STC Pay). We do not store your full
              card number or CVV on our servers.
            </p>

            <h2>Sharing Your Information</h2>
            <p>
              We share information with trusted service providers who help us
              operate our business — including shipping carriers, payment
              processors, and customer support tools — solely for the purposes
              of fulfilling your orders and improving our services.
            </p>

            <h2>Your Rights</h2>
            <p>
              You may access, correct, or request deletion of your personal data
              at any time through your account dashboard, or by contacting
              concierge@hebabaattiya.com. You may opt out of marketing emails at
              any time using the unsubscribe link in any newsletter.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide services, comply with legal obligations,
              resolve disputes, and enforce our agreements.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this policy, please contact us at
              concierge@hebabaattiya.com or through our Contact page.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
