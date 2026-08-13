import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "monogram";
  theme?: "dark" | "light"; // dark = black logo (for light bg), light = white logo (for dark bg)
  className?: string;
  href?: string;
  priority?: boolean;
}

const SOURCES = {
  full: { dark: "/logo/hb-logo-transparent.png", light: "/logo/hb-logo-full-white.png" },
  monogram: { dark: "/logo/hb-monogram-transparent.png", light: "/logo/hb-monogram-white.png" },
};

const ASPECT = {
  full: 621 / 311,
  monogram: 324 / 205,
};

export function Logo({
  variant = "full",
  theme = "dark",
  className,
  href = "/",
  priority = false,
}: LogoProps) {
  const src = SOURCES[variant][theme];
  const aspect = ASPECT[variant];

  const content = (
    <span className={cn("relative inline-block", className)} style={{ aspectRatio: aspect }}>
      <Image
        src={src}
        alt="HEBA BAATTIYA"
        fill
        priority={priority}
        className="object-contain"
        sizes="(max-width: 768px) 140px, 200px"
      />
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="HEBA BAATTIYA — Home" className="inline-flex">
      {content}
    </Link>
  );
}
