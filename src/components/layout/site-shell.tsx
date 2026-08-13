import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function SiteShell({
  children,
  transparentNav = false,
}: {
  children: React.ReactNode;
  transparentNav?: boolean;
}) {
  return (
    <>
      <Navbar transparentOnTop={transparentNav} />
      <main className={transparentNav ? "" : "pt-[88px]"}>{children}</main>
      <Footer />
    </>
  );
}
