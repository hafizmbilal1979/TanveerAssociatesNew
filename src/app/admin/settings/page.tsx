import { requireAdmin } from "@/lib/admin";
import { saveSettings } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { getSettingMap } from "@/lib/utils";

export default async function AdminSettingsPage() {
  await requireAdmin("settings");
  const settings = getSettingMap(await prisma.siteSetting.findMany());

  return (
    <div>
      <h1 className="display text-4xl">Settings</h1>
      <p className="mt-2 text-[var(--ink-soft)]">Site-wide content and contact details.</p>
      <form action={saveSettings} className="admin-card mt-8 max-w-3xl">
        <div className="field">
          <label>Site name</label>
          <input name="site_name" required defaultValue={settings.site_name || ""} />
        </div>
        <div className="field">
          <label>Tagline</label>
          <input name="tagline" defaultValue={settings.tagline || ""} />
        </div>
        <div className="field">
          <label>About</label>
          <textarea name="about" className="min-h-[220px]" defaultValue={settings.about || ""} />
        </div>
        <div className="field">
          <label>Address</label>
          <input name="address" defaultValue={settings.address || ""} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="field">
            <label>Phone</label>
            <input name="phone" defaultValue={settings.phone || ""} />
          </div>
          <div className="field">
            <label>ISDN</label>
            <input name="isdn" defaultValue={settings.isdn || ""} />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" defaultValue={settings.email || ""} />
        </div>
        <button className="btn btn-primary">Save settings</button>
      </form>
    </div>
  );
}

