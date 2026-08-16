import { requireAdmin } from "@/lib/admin";
import { deleteSlider, toggleSlider, upsertSlider } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminSlidersPage() {
  await requireAdmin("sliders");
  const sliders = await prisma.slider.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="display text-4xl">Hero sliders</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Homepage full-bleed slides.</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertSlider} className="admin-card" encType="multipart/form-data">
          <h2 className="display mb-4 text-3xl">Add slide</h2>
          <div className="field">
            <label>Title</label>
            <input name="title" />
          </div>
          <div className="field">
            <label>Subtitle</label>
            <input name="subtitle" />
          </div>
          <div className="field">
            <label>Link URL</label>
            <input name="linkUrl" placeholder="/projects" />
          </div>
          <div className="field">
            <label>Image</label>
            <input name="image" type="file" accept="image/*" required />
          </div>
          <div className="field">
            <label>Sort order</label>
            <input name="sortOrder" type="number" defaultValue={0} />
          </div>
          <label className="mb-4 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isEnabled" defaultChecked /> Enabled
          </label>
          <button className="btn btn-primary">Save slide</button>
        </form>

        <div className="admin-card grid gap-4">
          {sliders.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-4 border-b border-[var(--line)] pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.title || "Slide"} className="h-20 w-32 object-cover" />
              <div className="min-w-[180px] flex-1">
                <p className="font-medium">{s.title || "Untitled"}</p>
                <p className="text-sm text-[var(--ink-soft)]">{s.subtitle}</p>
                <span className={`badge mt-2 ${s.isEnabled ? "badge-on" : "badge-off"}`}>
                  {s.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <form
                action={async () => {
                  "use server";
                  await toggleSlider(s.id, !s.isEnabled);
                }}
              >
                <button className="btn btn-line !px-3 !py-2 text-[0.7rem]">
                  {s.isEnabled ? "Disable" : "Enable"}
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteSlider(s.id);
                }}
              >
                <button className="btn btn-line !px-3 !py-2 text-[0.7rem] text-red-700">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

