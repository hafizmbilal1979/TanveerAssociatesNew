"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertProject, deleteProjectImage, toggleProjectImage } from "@/lib/actions";

type Category = { id: string; name: string };
type ImageRow = { id: string; path: string; isEnabled: boolean };
type Project = {
  id?: string;
  title?: string;
  clientName?: string | null;
  location?: string | null;
  year?: string | null;
  summary?: string | null;
  description?: string | null;
  categoryId?: string;
  isFeatured?: boolean;
  isEnabled?: boolean;
  sortOrder?: number;
  coverImage?: string | null;
  images?: ImageRow[];
};

export function ProjectForm({
  categories,
  project,
}: {
  categories: Category[];
  project?: Project;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      if (project?.id) formData.set("id", project.id);
      const res = await upsertProject(formData);
      router.push(`/admin/projects/${res.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <form action={onSubmit} className="admin-card">
        <div className="field">
          <label>Title</label>
          <input name="title" required defaultValue={project?.title || ""} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="field">
            <label>Client name</label>
            <input name="clientName" defaultValue={project?.clientName || ""} />
          </div>
          <div className="field">
            <label>Category</label>
            <select name="categoryId" required defaultValue={project?.categoryId || categories[0]?.id}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="field">
            <label>Location</label>
            <input name="location" defaultValue={project?.location || ""} />
          </div>
          <div className="field">
            <label>Year</label>
            <input name="year" defaultValue={project?.year || ""} />
          </div>
          <div className="field">
            <label>Sort order</label>
            <input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} />
          </div>
        </div>
        <div className="field">
          <label>Summary</label>
          <textarea name="summary" defaultValue={project?.summary || ""} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" className="min-h-[180px]" defaultValue={project?.description || ""} />
        </div>
        <div className="field">
          <label>Cover image</label>
          <input name="coverImage" type="file" accept="image/*" />
          {project?.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.coverImage} alt="" className="mt-2 h-28 w-40 object-cover" />
          )}
        </div>
        <div className="field">
          <label>Gallery images (multi)</label>
          <input name="gallery" type="file" accept="image/*" multiple />
        </div>
        <div className="mb-4 flex flex-wrap gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="isFeatured" defaultChecked={project?.isFeatured} /> Featured
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="isEnabled" defaultChecked={project?.isEnabled ?? true} /> Enabled
          </label>
        </div>
        {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Save project"}
        </button>
      </form>

      <div className="admin-card">
        <h2 className="display text-3xl">Gallery</h2>
        <div className="mt-4 grid gap-3">
          {(project?.images || []).map((img) => (
            <div key={img.id} className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.path} alt="" className="h-16 w-20 object-cover" />
              <span className={`badge ${img.isEnabled ? "badge-on" : "badge-off"}`}>
                {img.isEnabled ? "On" : "Off"}
              </span>
              <button
                className="btn btn-line !px-3 !py-2 text-[0.68rem]"
                type="button"
                onClick={async () => {
                  await toggleProjectImage(img.id, !img.isEnabled);
                  router.refresh();
                }}
              >
                Toggle
              </button>
              <button
                className="btn btn-line !px-3 !py-2 text-[0.68rem] text-red-700"
                type="button"
                onClick={async () => {
                  await deleteProjectImage(img.id);
                  router.refresh();
                }}
              >
                Delete
              </button>
            </div>
          ))}
          {!project?.images?.length && <p className="text-sm text-[var(--ink-soft)]">No gallery images yet.</p>}
        </div>
      </div>
    </div>
  );
}
