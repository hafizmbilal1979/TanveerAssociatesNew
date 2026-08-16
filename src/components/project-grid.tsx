"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ProjectCard = {
  id: string;
  title: string;
  slug: string;
  clientName: string | null;
  coverImage: string | null;
  category?: { name: string; slug: string } | null;
};

export function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: (i % 3) * 0.05 }}
        >
          <Link href={`/projects/${p.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--stone-deep)]">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              ) : null}
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">{p.category?.name || "Project"}</p>
                <h3 className="display mt-1 text-2xl md:text-3xl">{p.title}</h3>
                {p.clientName ? (
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">Client · {p.clientName}</p>
                ) : null}
              </div>
              <span className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--bronze-deep)]">View</span>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
