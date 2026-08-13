"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HERO_IMG } from "@/lib/images";

export function BrandStory({
  heading = "A House Built on\nRestraint",
  body = "Heba Baattiya began in a small atelier with a single conviction: that elegance is something you remove, not something you add.",
}: {
  heading?: string;
  body?: string;
}) {
  const headingLines = heading.split("\n");
  return (
    <section className="bg-bone py-24 md:py-32">
      <div className="container-site grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] w-full overflow-hidden"
        >
          <Image
            src={HERO_IMG.editorialTwo}
            alt="The atelier of Heba Baattiya"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-wide md:text-4xl">
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <div className="mt-7 space-y-5 font-body text-[15px] leading-relaxed text-graphite">
            <p>{body}</p>
          </div>
          <Link
            href="/about"
            className="mt-9 inline-block border-b border-charcoal pb-1 text-xs tracking-widest2 uppercase text-charcoal transition hover:opacity-60"
          >
            Read Our Full Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
