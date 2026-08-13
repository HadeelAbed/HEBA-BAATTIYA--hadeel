import { auth } from "@/lib/auth";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export function isAdminRole(role: string | null | undefined) {
  return ADMIN_ROLES.includes(role ?? "");
}

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user || !isAdminRole((session.user as { role?: string }).role)) {
    return null;
  }
  return session;
}
