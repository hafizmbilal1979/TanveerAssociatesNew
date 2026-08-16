import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  await requireAdmin("dashboard");
  const [projects, team, messages, categories] = await Promise.all([
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.category.count(),
  ]);

  const cards = [
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Categories", value: categories, href: "/admin/categories" },
    { label: "Team", value: team, href: "/admin/team" },
    { label: "Unread messages", value: messages, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="display text-4xl">Dashboard</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Manage portfolio content, clients, and site settings.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="admin-card hover:border-[var(--ink)]">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-soft)]">{c.label}</p>
            <p className="display mt-3 text-5xl">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

