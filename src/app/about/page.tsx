import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { CoutureServices } from "@/components/home/couture-services";
import { HERO_IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: "The story, philosophy, and atelier behind HEBA BAATTIYA.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-charcoal">
        <Image
          src={HERO_IMG.editorialThree}
          alt="The Heba Baattiya atelier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="container-site relative z-10 flex h-full flex-col items-center justify-center text-center">
          <p className="eyebrow text-ivory/80">Est. in a Small Atelier</p>
          <h1 className="mt-4 font-display text-4xl tracking-wide text-ivory md:text-5xl">
            Our Story
          </h1>
        </div>
      </section>

      <section className="container-site py-20 md:py-28">
        <div className="mx-auto max-w-2xl space-y-7 font-body text-[15px] leading-relaxed text-graphite">
          <p>
            Heba Baattiya was founded on a simple belief: that the most powerful
            garments are the quietest ones. We design for the woman who enters a
            room and is remembered for her presence, not her ornamentation.
          </p>
          <p>
            Every collection begins with fabric, not sketches. Our design team
            spends weeks sourcing silk crepe, duchesse satin, and wool from
            mills we have worked with for over a decade before a single
            silhouette is drawn. We believe a dress is only as good as what
            it&apos;s made of.
          </p>
          <p>
            Our atelier produces in small, deliberate runs. Each piece is cut,
            fitted, and finished by hand by a team that has worked together for
            years. We do not chase trends — we build pieces meant to outlast
            them, designed to be worn for a decade and still feel correct.
          </p>
          <p>
            Today, Heba Baattiya dresses clients across the Gulf and beyond for
            galas, weddings, and the quieter occasions that deserve just as much
            care. Whether ready-to-wear or made to measure, every piece carries
            the same standard: nothing added that doesn&apos;t need to be there.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 border-t border-hairline pt-14 sm:grid-cols-3">
          <div className="text-center">
            <p className="font-display text-3xl">2008</p>
            <p className="mt-1 text-xs tracking-widest2 uppercase text-stone">
              Founded
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl">30+</p>
            <p className="mt-1 text-xs tracking-widest2 uppercase text-stone">
              Atelier Artisans
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl">12k+</p>
            <p className="mt-1 text-xs tracking-widest2 uppercase text-stone">
              Pieces Hand-Finished
            </p>
          </div>
        </div>
      </section>

      <div className="bg-bone">
        <CoutureServices />
      </div>
    </SiteShell>
  );
}
