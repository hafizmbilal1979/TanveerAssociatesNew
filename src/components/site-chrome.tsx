import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettingMap } from "@/lib/utils";

export async function SiteHeader() {
  const [categories, projects, settingsRows] = await Promise.all([
    prisma.category.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.project.findMany({
      where: { isEnabled: true },
      select: { id: true, title: true, slug: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    }),
    prisma.siteSetting.findMany(),
  ]);
  const settings = getSettingMap(settingsRows);
  const name = settings.site_name || "Tanveer Ahmad Associates";

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-site flex items-center justify-between gap-4 py-3 md:py-4">
        <Link href="/" className="display text-[1.35rem] md:text-[1.65rem] text-[var(--paper)]">
          {name}
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-[0.74rem] uppercase tracking-[0.16em] text-[color-mix(in_oklab,var(--paper)_88%,transparent)]">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>

          {/* Projects dropdown — pt-2 bridge keeps hover alive */}
          <div className="relative group">
            <Link href="/projects" className="inline-flex items-center hover:text-white">
              Projects
            </Link>
            <div className="pointer-events-none absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="max-h-[320px] min-w-[260px] overflow-y-auto border border-white/10 bg-[var(--ink)]/98 p-2 shadow-xl">
                <Link
                  href="/projects"
                  className="block border-b border-white/10 px-3 py-2 text-[0.68rem] text-[var(--bronze)] hover:text-white"
                >
                  All projects
                </Link>
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="block px-3 py-2 normal-case tracking-normal text-[0.8rem] text-white/85 hover:bg-white/5 hover:text-white"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Services dropdown — pt-2 bridge keeps hover alive */}
          <div className="relative group">
            <span className="inline-flex cursor-default items-center hover:text-white">Services</span>
            <div className="pointer-events-none absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="min-w-[220px] border border-white/10 bg-[var(--ink)]/98 p-2 shadow-xl">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/services/${c.slug}`}
                    className="block px-3 py-2 hover:bg-white/5 hover:text-white"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/team" className="hover:text-white">
            Team
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </nav>

        <Link href="/contact" className="btn btn-ghost !px-3 !py-2 text-[0.68rem]">
          Enquire
        </Link>
      </div>

      <div className="container-site flex gap-4 overflow-x-auto pb-2 text-[0.66rem] uppercase tracking-[0.14em] text-white/80 lg:hidden">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/team">Team</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const settings = getSettingMap(await prisma.siteSetting.findMany());
  return (
    <footer className="bg-[var(--ink)] text-[var(--stone)]">
      <div className="container-site grid gap-6 py-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-10">
        <div>
          <p className="display text-3xl text-[var(--paper)]">
            {settings.site_name || "Tanveer Ahmad Associates"}
          </p>
          <p className="mt-3 max-w-md text-[0.92rem] leading-relaxed text-[color-mix(in_oklab,var(--stone)_80%,transparent)]">
            {settings.tagline || "Architecture shaped by craft, clarity, and client partnership."}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3 text-[color-mix(in_oklab,var(--bronze)_80%,white)]">Navigate</p>
          <div className="grid gap-1.5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/team">Team</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-3 text-[color-mix(in_oklab,var(--bronze)_80%,white)]">Studio</p>
          <div className="grid gap-1.5 text-sm leading-relaxed">
            <p>{settings.address}</p>
            <p>Tel. {settings.phone}</p>
            <p>{settings.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-1 py-3 text-[0.68rem] tracking-[0.12em] uppercase text-white/45 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Tanveer Ahmad Associates</span>
          <span>Powered By Arc Edge</span>
          <span>Karachi · Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
