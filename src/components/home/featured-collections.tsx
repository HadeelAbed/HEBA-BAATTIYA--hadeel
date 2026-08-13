"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types";
import { IMG, ImageKey } from "@/lib/images";

export function FeaturedCollections({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="container-site py-24 md:py-32">
      <div className="mx-auto mb-16 max-w-xl text-center">
        <p className="eyebrow">Shop by Occasion</p>
        <h2 className="mt-3 font-display text-3xl tracking-wide md:text-4xl">
          Featured Collections
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/collections?category=${cat.slug}`}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={IMG[cat.image as ImageKey]}
                  alt={cat.name}
                  fill
                  className="object-contain transition-transform duration-[1.2s] ease-couture group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-display text-2xl text-white">{cat.name}</h3>
                <span className="mt-2 inline-block text-xs tracking-widest2 uppercase text-white/85 underline-offset-4 group-hover:underline">
                  Discover
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
