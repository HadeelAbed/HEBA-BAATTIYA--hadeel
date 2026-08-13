import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const session = await auth();
  const user = session?.user?.id ? await getUserById(session.user.id) : null;
  if (!user) return null;

  return <ProfileForm user={user} />;
}
