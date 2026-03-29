"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { SectionWrapper } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/date";
import type { BlogPost } from "@/lib/data";

const categories = ["All", "AI UX", "Next.js", "SaaS", "Frontend", "Architecture"] as const;
type Filter = (typeof categories)[number];

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = React.useState<Filter>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const base = filter === "All" ? posts : posts.filter((p) => p.category === filter);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filter, posts, query]);

  return (
    <main className="relative">
      <SectionWrapper
        id="blog"
        eyebrow="Blog"
        title="Notes from shipping real products."
        subtitle="UI-first writing — clean cards, categories, and detail views. No backend required."
        className="pt-10"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm transition backdrop-blur-xl",
                  filter === c
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30 sm:w-[280px]"
            />
            <Link
              href="/blog/new"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
            >
              Create
            </Link>
          </div>
        </div>

        <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Link href={`/blog/${p.slug}`} className="block">
                  <Card className="group cursor-pointer transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px]">
                          {p.category}
                        </span>
                        <span>{p.readingTime}</span>
                      </div>
                      <div className="mt-4 text-sm font-semibold text-white">{p.title}</div>
                      <div className="mt-2 text-sm text-white/65">{p.excerpt}</div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 3).map((t) => (
                          <Badge key={t} className="text-white/70">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-5 text-xs text-white/45">{formatDate(p.date)}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
            No posts match your search.
          </div>
        ) : null}
      </SectionWrapper>
    </main>
  );
}
