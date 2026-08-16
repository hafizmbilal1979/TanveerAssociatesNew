import { requireAdmin } from "@/lib/admin";
import { toggleUser, upsertUser } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/permissions";

export default async function AdminUsersPage() {
  await requireAdmin("users");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="display text-4xl">User management</h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        Role-based access: Admin (full), Editor (content/homepage), Messages (inbox only).
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertUser} className="admin-card">
          <h2 className="display mb-4 text-3xl">Add user</h2>
          <div className="field">
            <label>Name</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required />
          </div>
          <div className="field">
            <label>Role</label>
            <select name="role" defaultValue="editor">
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required minLength={8} />
          </div>
          <label className="mb-4 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked /> Active
          </label>
          <button className="btn btn-primary">Create user</button>
        </form>

        <div className="admin-card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-[var(--ink-soft)]">{u.email}</div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-[var(--bronze-deep)]">Edit</summary>
                      <form action={upsertUser} className="mt-2 grid gap-2">
                        <input type="hidden" name="id" value={u.id} />
                        <input name="name" defaultValue={u.name} required />
                        <input name="email" type="email" defaultValue={u.email} required />
                        <select name="role" defaultValue={u.role}>
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <input name="password" type="password" placeholder="New password (optional)" minLength={8} />
                        <label className="inline-flex items-center gap-2 text-xs">
                          <input type="checkbox" name="isActive" defaultChecked={u.isActive} /> Active
                        </label>
                        <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">Save</button>
                      </form>
                    </details>
                  </td>
                  <td className="capitalize">{u.role}</td>
                  <td>
                    <span className={`badge ${u.isActive ? "badge-on" : "badge-off"}`}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <form
                      action={async () => {
                        "use server";
                        await toggleUser(u.id, !u.isActive);
                      }}
                    >
                      <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
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
