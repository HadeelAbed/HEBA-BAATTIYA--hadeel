"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { IMG } from "@/lib/images";

const GALLERY = [
  IMG.blackDressPortrait,
  IMG.blackBlazerDress,
  IMG.blueWhiteDressHat,
  IMG.bridalGown,
  IMG.blackDressPortrait,
  IMG.blackBlazerDress,
];

export function InstagramGallery() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-site mb-12 text-center">
        <p className="eyebrow">Follow Along</p>
        <h2 className="mt-3 flex items-center justify-center gap-3 font-display text-3xl tracking-wide md:text-4xl">
          <Instagram size={26} strokeWidth={1.2} />
          @hebabaattiya
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {GALLERY.map((src, i) => (
          <motion.a
            href="#"
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="group relative block aspect-square overflow-hidden"
          >
            <Image
              src={src}
              alt="Instagram post"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 33vw, 16vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors group-hover:bg-charcoal/30">
              <Instagram
                size={20}
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
