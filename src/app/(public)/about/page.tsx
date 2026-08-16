import { prisma } from "@/lib/prisma";
import { getSettingMap } from "@/lib/utils";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const settings = getSettingMap(await prisma.siteSetting.findMany());
  return (
    <div className="bg-[var(--ink)] pt-24 text-[var(--paper)]">
      <section className="container-site pb-8">
        <p className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]">About</p>
        <h1 className="display mt-3 max-w-4xl text-[clamp(2.4rem,6vw,4.4rem)]">Built on rapport, rigor, and lasting craft.</h1>
      </section>
      <section className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="container-site grid gap-6 py-10 md:grid-cols-[0.9fr_1.1fr] md:py-12">
          <div>
            <p className="eyebrow">Since 1992</p>
            <h2 className="display mt-2 text-4xl">The practice</h2>
          </div>
          <div className="space-y-4 whitespace-pre-line text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
            {settings.about}
          </div>
        </div>
        <div className="container-site border-t border-[var(--line)] py-8 md:py-10">
          <p className="eyebrow">Leadership</p>
          <h2 className="display mt-2 text-4xl">Principal Architect</h2>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">{settings.principal}</p>
        </div>
      </section>
    </div>
  );
}
