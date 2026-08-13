import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteShell } from "@/components/layout/site-shell";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <SiteShell>
      <div className="container-site py-14">
        <h1 className="mb-10 font-display text-4xl tracking-wide">My Account</h1>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[224px_1fr]">
          <DashboardSidebar />
          <div>{children}</div>
        </div>
      </div>
    </SiteShell>
  );
}
