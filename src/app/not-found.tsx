import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] flex-col items-center justify-center pt-[88px] text-center">
        <Logo variant="monogram" className="h-16 w-auto opacity-40" />
        <h1 className="mt-8 font-display text-5xl tracking-wide">404</h1>
        <p className="mt-3 max-w-sm text-sm text-stone">
          The page you&apos;re looking for has been moved, renamed, or
          doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block border border-charcoal px-8 py-3 text-xs tracking-widest2 uppercase transition hover:bg-charcoal hover:text-white"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
