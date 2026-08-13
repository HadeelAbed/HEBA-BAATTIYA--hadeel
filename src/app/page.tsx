import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { getSiteContent } from "@/lib/queries";

export const metadata: Metadata = {
  title: "HEBA BAATTIYA — Couture Evening & Bridal Wear",
  description:
    "Timeless couture for women who dress with intention. Evening gowns, cocktail dresses, and bridal wear, designed and finished by hand.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const heroContent = await getSiteContent("homepage_hero");

  return (
    <>
      <Navbar transparentOnTop />
      <main>
        <Hero {...(heroContent ?? {})} />
      </main>
      <Footer />
    </>
  );
}
