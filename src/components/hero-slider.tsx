"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  linkUrl: string | null;
};

export function HeroSlider({
  slides,
  brand,
  tagline,
}: {
  slides: Slide[];
  brand: string;
  tagline: string;
}) {
  const [index, setIndex] = useState(0);
  const safe = slides.length ? slides : [];

  useEffect(() => {
    if (safe.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % safe.length), 5200);
    return () => clearInterval(t);
  }, [safe.length]);

  const current = safe[index];

  return (
    <section className="relative min-h-[72svh] overflow-hidden bg-[var(--ink)] text-[var(--paper)] md:min-h-[78svh]">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.title || brand} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,14,13,0.82)_12%,rgba(12,14,13,0.45)_55%,rgba(12,14,13,0.25)_100%)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container-site flex min-h-[72svh] flex-col justify-end pb-8 pt-28 md:min-h-[78svh] md:pb-10 md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="eyebrow text-[color-mix(in_oklab,var(--bronze)_70%,white)]"
        >
          Est. 1992 · Karachi
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.65 }}
          className="display mt-3 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)] text-[var(--paper)]"
        >
          {brand}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.55 }}
          className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-[color-mix(in_oklab,var(--paper)_82%,transparent)]"
        >
          {current?.subtitle || tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.55 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <Link href="/projects" className="btn btn-primary">
            View projects
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Start a conversation
          </Link>
        </motion.div>

        {safe.length > 1 && (
          <div className="mt-6 flex gap-2">
            {safe.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 transition-all ${i === index ? "w-10 bg-[var(--bronze)]" : "w-5 bg-white/35"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
