import { requireAdmin } from "@/lib/admin";
import { deleteCategory, toggleCategory, upsertCategory } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  await requireAdmin("categories");
  const categories = await prisma.category.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="display text-4xl">Categories</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Service categories for projects.</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={upsertCategory} className="admin-card">
          <h2 className="display mb-4 text-3xl">Add category</h2>
          <div className="field">
            <label>Name</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" />
          </div>
          <div className="field">
            <label>Sort order</label>
            <input name="sortOrder" type="number" defaultValue={0} />
          </div>
          <label className="mb-4 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isEnabled" defaultChecked /> Enabled
          </label>
          <button className="btn btn-primary">Save</button>
        </form>

        <div className="admin-card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Projects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-[var(--ink-soft)]">{c.slug}</div>
                  </td>
                  <td>{c._count.projects}</td>
                  <td>
                    <span className={`badge ${c.isEnabled ? "badge-on" : "badge-off"}`}>
                      {c.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <form
                      action={async () => {
                        "use server";
                        await toggleCategory(c.id, !c.isEnabled);
                      }}
                      className="inline"
                    >
                      <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                        {c.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCategory(c.id);
                      }}
                      className="inline"
                    >
                      <button className="btn btn-line !px-3 !py-2 text-[0.7rem] text-red-700">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

