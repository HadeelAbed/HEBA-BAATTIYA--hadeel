import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with the HEBA BAATTIYA size guide and measurement instructions.",
};

const SIZE_CHART = [
  { size: "XS", bust: "78–81", waist: "60–63", hip: "86–89" },
  { size: "S", bust: "82–85", waist: "64–67", hip: "90–93" },
  { size: "M", bust: "86–89", waist: "68–71", hip: "94–97" },
  { size: "L", bust: "90–94", waist: "72–76", hip: "98–102" },
  { size: "XL", bust: "95–99", waist: "77–81", hip: "103–107" },
];

export default function SizeGuidePage() {
  return (
    <SiteShell>
      <div className="container-site py-16">
        <div className="mb-12 text-center">
          <p className="eyebrow">Find Your Fit</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide">Size Guide</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-stone">
            All measurements are in centimeters. If you fall between two sizes, we recommend sizing
            up for evening and bridal silhouettes, or booking a complimentary fitting consultation.
          </p>
        </div>

        <div className="mx-auto max-w-3xl overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-charcoal text-left text-xs tracking-widest2 uppercase">
                <th className="py-4">Size</th>
                <th className="py-4">Bust (cm)</th>
                <th className="py-4">Waist (cm)</th>
                <th className="py-4">Hip (cm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="border-b border-hairline">
                  <td className="py-4 font-body">{row.size}</td>
                  <td className="py-4 text-graphite">{row.bust}</td>
                  <td className="py-4 text-graphite">{row.waist}</td>
                  <td className="py-4 text-graphite">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mx-auto mt-16 max-w-3xl grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg">Bust</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Measure around the fullest part of your bust, keeping the tape parallel to the floor.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg">Waist</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Measure around your natural waistline, at the narrowest point above your navel.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg">Hip</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              Measure around the fullest part of your hips, roughly 20cm below your waistline.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl border border-hairline bg-bone p-8 text-center">
          <h3 className="font-display text-xl">Still Unsure?</h3>
          <p className="mt-2 text-sm text-stone">
            Book a complimentary virtual or in-atelier fitting consultation and our team will help
            you find the right size — or arrange a made-to-measure piece.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block border border-charcoal px-8 py-3 text-xs tracking-widest2 uppercase transition hover:bg-charcoal hover:text-white"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </SiteShell>
  );
}
