import type { Metadata } from "next";
import { cinzel, poppins } from "@/lib/fonts";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "HEBA BAATTIYA — Couture Evening & Bridal Wear",
    template: "%s — HEBA BAATTIYA",
  },
  description:
    "HEBA BAATTIYA is a couture house designing evening, cocktail, and bridal wear for women who dress with intention. Made-to-measure and ready-to-wear pieces, finished by hand.",
  keywords: [
    "Heba Baattiya",
    "couture",
    "evening dresses",
    "bridal gowns",
    "luxury fashion",
    "Saudi Arabia fashion designer",
  ],
  openGraph: {
    title: "HEBA BAATTIYA — Couture Evening & Bridal Wear",
    description:
      "Timeless couture for women who dress with intention. Designed and finished by hand.",
    type: "website",
    siteName: "HEBA BAATTIYA",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEBA BAATTIYA",
    description: "Timeless couture for women who dress with intention.",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable}`}>
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
