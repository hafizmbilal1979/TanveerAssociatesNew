import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("projects");
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <h1 className="display mb-6 text-4xl">Edit project</h1>
      <ProjectForm categories={categories} project={project} />
    </div>
  );
}
