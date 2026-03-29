"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/data";

export function ProjectCard({
  project,
  onOpen
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  const router = useRouter();

  const primaryUrl = project.links.demo ?? project.links.github ?? null;

  function navigatePrimary() {
    if (!primaryUrl) {
      onOpen(project);
      return;
    }
    if (primaryUrl.startsWith("/")) {
      router.push(primaryUrl);
      return;
    }
    window.open(primaryUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl",
        "cursor-pointer hover:border-white/20 hover:bg-white/[0.06]"
      )}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title}`}
      onClick={navigatePrimary}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigatePrimary();
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(circle_at_20%_20%,rgba(99,102,241,.38),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(56,189,248,.22),transparent_55%)]"
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{project.blurb}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {project.category.slice(0, 2).map((c) => (
              <Badge key={c} className="bg-white/5">
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 5).map((t) => (
            <Badge key={t} className="text-white/70">
              {t}
            </Badge>
          ))}
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="mt-2 space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-white/50">Highlights</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
              {project.highlights.slice(0, 3).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(project);
                }}
              >
                View Details <ExternalLink className="h-4 w-4 text-white/70" />
              </Button>
              {project.links.demo ? (
                <Link
                  href={project.links.demo}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  Live <Globe className="h-4 w-4" />
                </Link>
              ) : null}
              {project.links.github ? (
                <Link
                  href={project.links.github}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  GitHub <Github className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
