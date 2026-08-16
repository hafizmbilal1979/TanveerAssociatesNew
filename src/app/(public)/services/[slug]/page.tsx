import { notFound } from "next/navigation";
import { ProjectGrid } from "@/components/project-grid";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.name || "Services" };
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findFirst({
    where: { slug, isEnabled: true },
    include: {
      projects: {
        where: { isEnabled: true },
        include: { category: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  if (!category) notFound();

  return (
    <div className="bg-[var(--ink)] pt-24 text-[var(--paper)]">
      <section className="container-site pb-8">
        <p className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]">Services</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.4rem)]">{category.name}</h1>
        {category.description && (
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-white/75">{category.description}</p>
        )}
      </section>
      <section className="bg-[var(--paper)] py-10 text-[var(--ink)] md:py-12">
        <div className="container-site">
          <ProjectGrid projects={category.projects} />
        </div>
      </section>
    </div>
  );
}
