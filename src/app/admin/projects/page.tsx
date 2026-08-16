import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { deleteProject, toggleProject } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  await requireAdmin("projects");
  const projects = await prisma.project.findMany({
    include: { category: true, images: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Projects</h1>
          <p className="mt-2 text-[var(--ink-soft)]">Add, edit, enable/disable project and client galleries.</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          Add project
        </Link>
      </div>

      <div className="admin-card mt-8 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Category</th>
              <th>Images</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="font-medium">{p.title}</div>
                  {p.isFeatured && <span className="badge mt-1">Featured</span>}
                </td>
                <td>{p.clientName || "—"}</td>
                <td>{p.category.name}</td>
                <td>{p.images.length}</td>
                <td>
                  <span className={`badge ${p.isEnabled ? "badge-on" : "badge-off"}`}>
                    {p.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/projects/${p.id}`} className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await toggleProject(p.id, !p.isEnabled);
                      }}
                    >
                      <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                        {p.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProject(p.id);
                      }}
                    >
                      <button className="btn btn-line !px-3 !py-2 text-[0.7rem] text-red-700">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

