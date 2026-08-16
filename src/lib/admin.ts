import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { can, normalizeRole, type Permission, type Role } from "@/lib/permissions";

export type AdminSession = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role: Role;
  };
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const id = (session.user as { id?: string }).id;
  if (!id) return null;
  return {
    user: {
      id,
      email: session.user.email,
      name: session.user.name,
      role: normalizeRole((session.user as { role?: string }).role),
    },
  };
}

export async function requireAdmin(permission: Permission = "dashboard") {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!can(session.user.role, permission)) redirect("/admin");
  return session;
}
