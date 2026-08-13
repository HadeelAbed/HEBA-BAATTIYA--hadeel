"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  function next() {
    setActive((a) => (a + 1) % images.length);
  }
  function prev() {
    setActive((a) => (a - 1 + images.length) % images.length);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="order-2 flex gap-3 sm:order-1 sm:w-20 sm:flex-col">
        {images.length > 0 ? images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden border sm:w-full",
              active === i
                ? "border-charcoal"
                : "border-hairline opacity-70 hover:opacity-100",
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={img.altText ?? productName}
              fill
              className="object-contain"
              sizes="80px"
            />
          </button>
        )) : (
          <div className="relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden border border-charcoal sm:w-full">
            <Image src="/hero-heba.jpg" alt="Fallback" fill className="object-contain" sizes="80px" />
          </div>
        )}
      </div>

      <div
        className="group relative order-1 aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden bg-bone sm:order-2"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images.length > 0 ? images[active]?.url : "/hero-heba.jpg"}
          alt={images.length > 0 ? (images[active]?.altText ?? productName) : productName}
          fill
          priority
          className="object-contain transition-transform duration-300"
          style={
            zooming
              ? {
                  transform: "scale(1.8)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn size={16} />
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute right-6 top-6 text-white"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X size={28} strokeWidth={1.3} />
            </button>
            <button
              className="absolute left-4 text-white sm:left-8"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>
            <div
              className="relative h-[80vh] w-[90vw] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images.length > 0 ? images[active]?.url : "/hero-heba.jpg"}
                alt={images.length > 0 ? (images[active]?.altText ?? productName) : productName}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <button
              className="absolute right-4 text-white sm:right-8"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
