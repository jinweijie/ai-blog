import { getBlogSettings } from "@/lib/settings";
import { updateBlogSettings } from "@/lib/actions/settings";
import FormSubmitButton from "@/components/FormSubmitButton";

export default async function SettingsPage() {
  const settings = await getBlogSettings();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="section-title">Blog settings</h2>
        <p className="section-subtitle">Customize title, subtitle, and reading style.</p>
      </div>
      <form action={updateBlogSettings} className="card space-y-4 p-6">
        <input type="hidden" name="id" value={settings.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="siteTitle">Site title</label>
            <input id="siteTitle" name="siteTitle" defaultValue={settings.siteTitle} className="w-full" />
          </div>
          <div className="space-y-1">
            <label htmlFor="siteSubtitle">Subtitle</label>
            <input id="siteSubtitle" name="siteSubtitle" defaultValue={settings.siteSubtitle} className="w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="accent">Accent</label>
            <select id="accent" name="accent" defaultValue={settings.accent} className="w-full">
              <option value="slate">Slate</option>
              <option value="indigo">Indigo</option>
              <option value="emerald">Emerald</option>
              <option value="amber">Amber</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="fontPair">Font pair</label>
            <select id="fontPair" name="fontPair" defaultValue={settings.fontPair} className="w-full">
              <option value="serif">Serif + Sans</option>
              <option value="sans">Sans + Serif</option>
            </select>
          </div>
        </div>
        <FormSubmitButton label="Save settings" pendingLabel="Saving..." />
      </form>
    </section>
  );
}
