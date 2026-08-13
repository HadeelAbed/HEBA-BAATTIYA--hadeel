"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { cn } from "@/lib/utils";

const FAQ_GROUPS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Ready-to-wear pieces ship within 2–3 business days and arrive within 3–7 business days across the GCC, or 7–14 days internationally. Made-to-measure and bridal pieces have separate production timelines noted on the product page.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. Duties and import taxes, where applicable, are calculated at checkout for select destinations or billed separately by the courier on delivery.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once your order ships, you'll receive a tracking number by email and can monitor its status anytime from your account dashboard under Orders.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "Ready-to-wear pieces can be returned within 14 days of delivery if unworn, with tags attached. Bridal and made-to-measure pieces are final sale due to their custom nature.",
      },
      {
        q: "How do I start a return?",
        a: "Visit your account dashboard, select the relevant order, and choose 'Request Return'. Our team will arrange a complimentary pickup within the GCC.",
      },
    ],
  },
  {
    category: "Sizing & Fit",
    items: [
      {
        q: "What if I'm between two sizes?",
        a: "For evening and bridal silhouettes we generally recommend sizing up, as our pieces are easier to take in than let out. You can also book a free fitting consultation.",
      },
      {
        q: "Do you offer alterations?",
        a: "Yes — every Heba Baattiya piece comes with complimentary first alteration support at our Jeddah atelier, or via a partner atelier in select cities.",
      },
    ],
  },
  {
    category: "Bridal & Couture",
    items: [
      {
        q: "How far in advance should I order my bridal gown?",
        a: "We recommend starting the process at least 4–6 months before your date to allow time for consultation, fittings, and any custom adjustments.",
      },
      {
        q: "Can I customize a ready-to-wear piece?",
        a: "Many of our evening pieces can be adapted in color, length, or neckline through our made-to-measure service. Reach out to our concierge team to discuss options.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <SiteShell>
      <div className="container-site py-16">
        <div className="mb-14 text-center">
          <p className="eyebrow">Need to Know</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide">Frequently Asked Questions</h1>
        </div>

        <div className="mx-auto max-w-2xl space-y-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.category}>
              <h2 className="mb-4 font-display text-xl tracking-wide">{group.category}</h2>
              <div>
                {group.items.map((item) => (
                  <FAQItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline py-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="font-body text-sm text-charcoal">{question}</span>
        <ChevronDown size={16} className={cn("flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="mt-3 text-sm leading-relaxed text-stone">{answer}</p>}
    </div>
  );
}
