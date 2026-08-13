"use client";

import { motion } from "framer-motion";
import { Ruler, Scissors, Gem } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    icon: Ruler,
    title: "Made-to-Measure",
    description:
      "Every couture gown is cut to your exact measurements across a series of private fittings, beginning with a consultation at our atelier or by appointment.",
  },
  {
    icon: Scissors,
    title: "Bridal Consultation",
    description:
      "A dedicated bridal advisor guides you from first sketch to final fitting, with fabric and silhouette selected around the day itself.",
  },
  {
    icon: Gem,
    title: "Alterations & Care",
    description:
      "Lifetime alteration support for every Heba Baattiya piece, plus preservation cleaning for bridal gowns after the day has passed.",
  },
];

export function CoutureServices() {
  return (
    <section id="couture-services" className="container-site py-24 md:py-32">
      <div className="mx-auto mb-16 max-w-xl text-center">
        <p className="eyebrow">By Appointment</p>
        <h2 className="mt-3 font-display text-3xl tracking-wide md:text-4xl">Couture Services</h2>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-mist">
                <Icon size={24} strokeWidth={1.2} className="text-charcoal" />
              </div>
              <h3 className="font-display text-xl tracking-wide">{service.title}</h3>
              <p className="mx-auto mt-3 max-w-xs font-body text-sm leading-relaxed text-stone">
                {service.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/contact"
          className="inline-block border border-charcoal px-9 py-3.5 text-xs tracking-widest2 uppercase transition hover:bg-charcoal hover:text-white"
        >
          Book a Consultation
        </Link>
      </div>
    </section>
  );
}
