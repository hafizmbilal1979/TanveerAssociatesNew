import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  await requireAdmin("projects");
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="display mb-6 text-4xl">Add project</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}

