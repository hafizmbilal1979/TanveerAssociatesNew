import { ProjectGrid } from "@/components/project-grid";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isEnabled: true },
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="bg-[var(--ink)] pt-24 text-[var(--paper)]">
      <section className="container-site pb-8">
        <p className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]">Portfolio</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.4rem)]">Projects</h1>
      </section>
      <section className="bg-[var(--paper)] py-10 text-[var(--ink)] md:py-12">
        <div className="container-site">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </div>
  );
}
