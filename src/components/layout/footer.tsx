"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const FOOTER_LINKS: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "Shop",
    links: [
      { label: "Limited Pieces", href: "/shop?category=evening-dresses" },
      { label: "Read to Wear", href: "/shop?category=read-to-wear" },
      { label: "New Arrivals", href: "/shop?filter=new" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "Size Guide", href: "/size-guide" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "The House",
    links: [
      { label: "About", href: "/about" },
      { label: "Couture Services", href: "/about#couture-services" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-site grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
        <div>
          <Logo variant="full" theme="light" className="h-12 w-auto" href="/" />
          <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-mist">
            Timeless couture for women who dress with intention. Designed and
            finished by hand.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-mist transition hover:text-white"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-mist transition hover:text-white"
            >
              <Facebook size={18} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-mist transition hover:text-white"
            >
              <Twitter size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <h3 className="eyebrow mb-5 text-mist">{group.heading}</h3>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-ivory/85 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-site border-t border-white/10 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-sm">
            <h3 className="font-display text-lg">Join the House</h3>
            <p className="mt-1 font-body text-sm text-mist">
              First access to new collections and private trunk shows.
            </p>
          </div>
          {submitted ? (
            <p className="font-body text-sm text-ivory">
              Thank you — you&apos;re on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md gap-0"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-white/20 bg-transparent px-4 py-3 font-body text-sm text-white placeholder:text-mist focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 border border-white bg-white px-6 py-3 text-xs tracking-widest2 uppercase text-charcoal transition hover:bg-transparent hover:text-white"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container-site flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-mist md:flex-row">
        <p>© {new Date().getFullYear()} Heba Baattiya. All rights reserved.</p>
        <div className="flex items-center gap-3 opacity-80">
          {["Visa", "Mastercard", "mada", "Apple Pay", "STC Pay"].map((m) => (
            <span
              key={m}
              className="rounded-sm border border-white/20 px-2 py-1 text-[10px] tracking-wide"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
