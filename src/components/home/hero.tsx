"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HERO_IMG } from "@/lib/images";

export function Hero() {
  return (
    <section className="relative h-[100vh] min-h-[640px] w-full overflow-hidden bg-charcoal">
      <Image
        src={HERO_IMG.heroMain}
        alt="HEBA BAATTIYA — Spring Couture"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/20" />

      <div className="container-site relative z-10 flex h-full flex-col items-center justify-end pb-16 text-center md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/shop"
            className="border border-ivory bg-ivory px-9 py-3.5 text-xs tracking-widest2 uppercase text-charcoal transition hover:bg-transparent hover:text-ivory"
          >
            Shop the Collection
          </Link>
          <Link
            href="/collections"
            className="border border-ivory/70 px-9 py-3.5 text-xs tracking-widest2 uppercase text-ivory transition hover:border-ivory hover:bg-ivory/10"
          >
            View Collections
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-10 w-px bg-ivory/50" />
      </motion.div>
    </section>
  );
}
