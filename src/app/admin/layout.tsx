import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user?.id || !["ADMIN", "SUPER_ADMIN"].includes(role ?? "")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bone">
      <AdminSidebar />
      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
