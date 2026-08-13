"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "The fit was unlike anything I've worn before — structured but completely weightless. I felt like the dress disappeared and all anyone saw was the room I walked into.",
    name: "R. Al-Fahad",
    occasion: "Gala Client, Riyadh",
  },
  {
    quote:
      "My bridal gown took eight weeks and three fittings, and every single one was worth it. The atelier team understood exactly what I wanted before I could fully explain it.",
    name: "N. Al-Otaibi",
    occasion: "Bridal Client, Jeddah",
  },
  {
    quote:
      "I've bought four pieces over the past two years and each one still looks new. The construction is simply on another level from anything else in my closet.",
    name: "L. Marwan",
    occasion: "Returning Client, Dubai",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  function next() {
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  return (
    <section className="bg-charcoal py-24 text-ivory md:py-32">
      <div className="container-site mx-auto max-w-2xl text-center">
        <p className="eyebrow text-mist">In Their Words</p>
        <div className="relative mt-10 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-xl leading-relaxed tracking-wide md:text-2xl">
                “{TESTIMONIALS[index].quote}”
              </p>
              <p className="mt-7 font-body text-sm text-mist">
                {TESTIMONIALS[index].name} — {TESTIMONIALS[index].occasion}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={prev} aria-label="Previous testimonial" className="text-mist transition hover:text-white">
            <ChevronLeft size={22} strokeWidth={1.3} />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Next testimonial" className="text-mist transition hover:text-white">
            <ChevronRight size={22} strokeWidth={1.3} />
          </button>
        </div>
      </div>
    </section>
  );
}
