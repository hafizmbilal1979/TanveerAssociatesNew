import { requireAdmin } from "@/lib/admin";
import {
  deleteHomeSection,
  toggleHomeSection,
  upsertHomeSection,
} from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminHomeSectionsPage() {
  await requireAdmin("home");
  const sections = await prisma.homeSection.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="display text-4xl">Home page sections</h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        Add, edit, enable/disable or delete homepage content blocks. Hero slides are managed under Sliders.
        Featured projects use the Featured flag on Projects. Services list uses enabled Categories.
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertHomeSection} className="admin-card">
          <h2 className="display mb-4 text-3xl">Add section</h2>
          <div className="field">
            <label>Type</label>
            <select name="type" defaultValue="custom">
              <option value="practice">Practice / about teaser</option>
              <option value="featured">Featured projects</option>
              <option value="services">Services grid</option>
              <option value="custom">Custom content</option>
            </select>
          </div>
          <div className="field">
            <label>Key (optional unique id)</label>
            <input name="key" placeholder="e.g. practice" />
          </div>
          <div className="field">
            <label>Eyebrow</label>
            <input name="eyebrow" placeholder="Practice" />
          </div>
          <div className="field">
            <label>Title</label>
            <input name="title" required />
          </div>
          <div className="field">
            <label>Body</label>
            <textarea name="body" className="min-h-[140px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="field">
              <label>CTA label</label>
              <input name="ctaLabel" placeholder="About the firm" />
            </div>
            <div className="field">
              <label>CTA URL</label>
              <input name="ctaUrl" placeholder="/about" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="field">
              <label>Background</label>
              <select name="bgStyle" defaultValue="paper">
                <option value="paper">Paper</option>
                <option value="stone">Stone</option>
                <option value="ink">Ink</option>
              </select>
            </div>
            <div className="field">
              <label>Sort order</label>
              <input name="sortOrder" type="number" defaultValue={0} />
            </div>
          </div>
          <label className="mb-4 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isEnabled" defaultChecked /> Enabled
          </label>
          <button className="btn btn-primary">Save section</button>
        </form>

        <div className="grid gap-4">
          {sections.map((s) => (
            <div key={s.id} className="admin-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                    {s.type} · {s.key} · order {s.sortOrder}
                  </p>
                  <h3 className="display mt-1 text-2xl">{s.title}</h3>
                  {s.eyebrow && <p className="text-sm text-[var(--bronze-deep)]">{s.eyebrow}</p>}
                  <span className={`badge mt-2 ${s.isEnabled ? "badge-on" : "badge-off"}`}>
                    {s.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await toggleHomeSection(s.id, !s.isEnabled);
                    }}
                  >
                    <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                      {s.isEnabled ? "Disable" : "Enable"}
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await deleteHomeSection(s.id);
                    }}
                  >
                    <button className="btn btn-line !px-3 !py-2 text-[0.7rem] text-red-700">Delete</button>
                  </form>
                </div>
              </div>

              <form action={upsertHomeSection} className="mt-4 border-t border-[var(--line)] pt-4">
                <input type="hidden" name="id" value={s.id} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="field">
                    <label>Type</label>
                    <select name="type" defaultValue={s.type}>
                      <option value="practice">Practice</option>
                      <option value="featured">Featured</option>
                      <option value="services">Services</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Key</label>
                    <input name="key" defaultValue={s.key} required />
                  </div>
                </div>
                <div className="field">
                  <label>Eyebrow</label>
                  <input name="eyebrow" defaultValue={s.eyebrow || ""} />
                </div>
                <div className="field">
                  <label>Title</label>
                  <input name="title" defaultValue={s.title} required />
                </div>
                <div className="field">
                  <label>Body</label>
                  <textarea name="body" defaultValue={s.body || ""} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="field">
                    <label>CTA label</label>
                    <input name="ctaLabel" defaultValue={s.ctaLabel || ""} />
                  </div>
                  <div className="field">
                    <label>CTA URL</label>
                    <input name="ctaUrl" defaultValue={s.ctaUrl || ""} />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="field">
                    <label>Background</label>
                    <select name="bgStyle" defaultValue={s.bgStyle}>
                      <option value="paper">Paper</option>
                      <option value="stone">Stone</option>
                      <option value="ink">Ink</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Sort order</label>
                    <input name="sortOrder" type="number" defaultValue={s.sortOrder} />
                  </div>
                  <label className="mt-6 inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isEnabled" defaultChecked={s.isEnabled} /> Enabled
                  </label>
                </div>
                <button className="btn btn-primary">Update section</button>
              </form>
            </div>
          ))}
          {!sections.length && (
            <p className="admin-card text-sm text-[var(--ink-soft)]">No homepage sections yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
