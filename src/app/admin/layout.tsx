import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { navForRole, normalizeRole } from "@/lib/permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  const role = normalizeRole((session.user as { role?: string }).role);
  const links = navForRole(role).map(({ href, label }) => ({ href, label }));

  return (
    <div className="admin-shell">
      <AdminNav email={session.user?.email} role={role} links={links} />
      <div className="admin-main flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <p className="mt-8 text-center text-[0.68rem] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
          Powered By Arc Edge
        </p>
      </div>
    </div>
  );
}
