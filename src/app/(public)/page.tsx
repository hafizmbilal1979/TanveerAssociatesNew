import Link from "next/link";
import { HeroSlider } from "@/components/hero-slider";
import { ProjectGrid } from "@/components/project-grid";
import { prisma } from "@/lib/prisma";
import { getSettingMap } from "@/lib/utils";

function sectionBg(bgStyle: string) {
  if (bgStyle === "stone") return "bg-[var(--stone)] text-[var(--ink)]";
  if (bgStyle === "ink") return "bg-[var(--ink)] text-[var(--paper)]";
  return "bg-[var(--paper)] text-[var(--ink)]";
}

export default async function HomePage() {
  const [sliders, featured, categories, settingsRows, sections] = await Promise.all([
    prisma.slider.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({
      where: { isEnabled: true, isFeatured: true },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.category.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany(),
    prisma.homeSection.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  const settings = getSettingMap(settingsRows);
  const brand = settings.site_name || "Tanveer Ahmad Associates";

  return (
    <>
      <HeroSlider
        slides={sliders}
        brand={brand}
        tagline={settings.tagline || "Architecture shaped by craft, clarity, and client partnership."}
      />

      {sections.map((section) => {
        const wrap = sectionBg(section.bgStyle);
        if (section.type === "featured") {
          return (
            <section key={section.id} className={`${wrap} py-10 md:py-12`}>
              <div className="container-site">
                <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
                    <h2 className="display mt-2 text-4xl md:text-5xl">{section.title}</h2>
                    {section.body && (
                      <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">{section.body}</p>
                    )}
                  </div>
                  {section.ctaLabel && section.ctaUrl && (
                    <Link href={section.ctaUrl} className="btn btn-line">
                      {section.ctaLabel}
                    </Link>
                  )}
                </div>
                <ProjectGrid projects={featured} />
              </div>
            </section>
          );
        }

        if (section.type === "services") {
          return (
            <section key={section.id} className={`${wrap} py-10 md:py-12`}>
              <div className="container-site">
                {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
                <h2 className="display mt-2 max-w-3xl text-4xl md:text-5xl">{section.title}</h2>
                {section.body && (
                  <p className="mt-3 max-w-2xl text-sm text-[var(--ink-soft)]">{section.body}</p>
                )}
                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {categories.map((c, i) => (
                    <Link
                      key={c.id}
                      href={`/services/${c.slug}`}
                      className="group border-t border-[var(--line)] pt-4 transition hover:border-[var(--ink)]"
                    >
                      <p className="text-xs tracking-[0.2em] text-[var(--bronze-deep)]">0{i + 1}</p>
                      <h3 className="display mt-2 text-3xl">{c.name}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
                        {c.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // practice + custom
        return (
          <section key={section.id} className={`${wrap} py-10 md:py-12`}>
            <div className="container-site grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div>
                {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
                <h2 className="display mt-2 text-4xl md:text-5xl">{section.title}</h2>
              </div>
              {section.body && (
                <p className="max-w-xl whitespace-pre-line text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
                  {section.body}
                </p>
              )}
            </div>
            {section.ctaLabel && section.ctaUrl && (
              <div className="container-site mt-6">
                <Link href={section.ctaUrl} className="btn btn-line">
                  {section.ctaLabel}
                </Link>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
