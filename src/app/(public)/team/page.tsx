import { prisma } from "@/lib/prisma";

export const metadata = { title: "Our Team" };

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    where: { isEnabled: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="bg-[var(--ink)] pt-24 text-[var(--paper)]">
      <section className="container-site pb-8">
        <p className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]">People</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.4rem)]">Our team</h1>
      </section>
      <section className="bg-[var(--paper)] py-10 text-[var(--ink)] md:py-12">
        <div className="container-site grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((m) => (
            <article key={m.id} className="border-t border-[var(--line)] pt-4">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} className="mb-4 aspect-[4/3] w-full object-cover" />
              ) : null}
              <p className="eyebrow">{m.role}</p>
              <h2 className="display mt-1 text-2xl md:text-3xl">{m.name}</h2>
              {m.education && <p className="mt-2 text-sm text-[var(--ink-soft)]">{m.education}</p>}
              {(m.experience || m.bio) && (
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{m.experience || m.bio}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
