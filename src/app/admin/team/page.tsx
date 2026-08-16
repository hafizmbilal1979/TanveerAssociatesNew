import { requireAdmin } from "@/lib/admin";
import { deleteTeam, toggleTeam, upsertTeam } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminTeamPage() {
  await requireAdmin("team");
  const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="display text-4xl">Team</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Manage team members shown on the public site.</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertTeam} className="admin-card" encType="multipart/form-data">
          <h2 className="display mb-4 text-3xl">Add member</h2>
          <div className="field">
            <label>Name</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Role</label>
            <input name="role" required />
          </div>
          <div className="field">
            <label>Education</label>
            <input name="education" />
          </div>
          <div className="field">
            <label>Experience</label>
            <textarea name="experience" />
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea name="bio" />
          </div>
          <div className="field">
            <label>Photo</label>
            <input name="photo" type="file" accept="image/*" />
          </div>
          <div className="field">
            <label>Sort order</label>
            <input name="sortOrder" type="number" defaultValue={0} />
          </div>
          <label className="mb-4 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isEnabled" defaultChecked /> Enabled
          </label>
          <button className="btn btn-primary">Save member</button>
        </form>

        <div className="admin-card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium">{m.name}</td>
                  <td>{m.role}</td>
                  <td>
                    <span className={`badge ${m.isEnabled ? "badge-on" : "badge-off"}`}>
                      {m.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <form
                      action={async () => {
                        "use server";
                        await toggleTeam(m.id, !m.isEnabled);
                      }}
                      className="inline"
                    >
                      <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                        {m.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteTeam(m.id);
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

