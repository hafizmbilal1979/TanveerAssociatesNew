"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type NavItem = { href: string; label: string };

export function AdminNav({
  email,
  role,
  links,
}: {
  email?: string | null;
  role?: string | null;
  links: NavItem[];
}) {
  return (
    <aside className="admin-nav">
      <p className="display text-2xl">TAA Admin</p>
      <p className="mt-2 text-xs text-white/50">{email}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--bronze)]">{role}</p>
      <nav className="mt-8 grid gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 grid gap-2">
        <Link href="/" className="btn btn-ghost text-[0.7rem]">
          View site
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="btn btn-ghost text-[0.7rem]">
          Sign out
        </button>
      </div>
    </aside>
  );
}
