import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  return { title: project?.title || "Project" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, isEnabled: true },
    include: {
      category: true,
      images: { where: { isEnabled: true }, orderBy: { sortOrder: "asc" } },
    },
  });
  if (!project) notFound();

  return (
    <div className="bg-[var(--ink)] pt-24 text-[var(--paper)]">
      <section className="container-site pb-6">
        <Link href="/projects" className="text-xs uppercase tracking-[0.16em] text-white/60">
          ← All projects
        </Link>
        <p className="eyebrow mt-4 text-[color-mix(in_oklab,var(--bronze)_70%,white)]">{project.category.name}</p>
        <h1 className="display mt-2 text-[clamp(2.2rem,5.5vw,4rem)]">{project.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/70">
          {project.clientName && <span>Client · {project.clientName}</span>}
          {project.location && <span>{project.location}</span>}
          {project.year && <span>{project.year}</span>}
        </div>
      </section>

      {project.coverImage && (
        <div className="relative h-[42vw] max-h-[520px] min-h-[240px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}

      <section className="bg-[var(--paper)] py-10 text-[var(--ink)] md:py-12">
        <div className="container-site grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="display mt-2 text-3xl">Project notes</h2>
          </div>
          <div className="space-y-3 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
            {project.summary && <p>{project.summary}</p>}
            {project.description && <p className="whitespace-pre-line">{project.description}</p>}
          </div>
        </div>

        <div className="container-site mt-8 grid gap-3 md:grid-cols-2">
          {project.images.map((img) => (
            <div key={img.id} className="overflow-hidden bg-[var(--stone-deep)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.path} alt={img.alt || project.title} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
