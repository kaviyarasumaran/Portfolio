"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { Modal } from "@/components/modal";
import { ProjectCard } from "@/components/project-card";
import { SectionWrapper } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { type Project, type ProjectCategory, projects } from "@/lib/data";

const filters: ProjectCategory[] = ["All", "SaaS", "AI", "Mobile"];

export function ProjectsSection() {
  const [filter, setFilter] = React.useState<ProjectCategory>("All");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<Project | null>(null);

  const filtered = React.useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.category.includes(filter));
  }, [filter]);

  function onOpen(p: Project) {
    setActive(p);
    setOpen(true);
  }

  return (
    <SectionWrapper
      id="projects"
      eyebrow="Projects"
      title="Interactive, product-grade builds."
      subtitle="Filtering, layout animations, and modal details — designed like a SaaS showcase."
    >
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm transition backdrop-blur-xl",
              filter === f
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <ProjectCard project={p} onOpen={onOpen} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)} title={active?.title}>
        {active ? (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-white/70">{active.blurb}</p>
            <div className="flex flex-wrap gap-1.5">
              {active.tags.map((t) => (
                <Badge key={t} className="text-white/70">
                  {t}
                </Badge>
              ))}
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-white/50">Key contributions</div>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/70">
                {active.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
              {active.links.demo ? (
                <a
                  href={active.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  Live Demo
                </a>
              ) : null}
              {active.links.extra?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              {active.links.github ? (
                <a
                  href={active.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </SectionWrapper>
  );
}
