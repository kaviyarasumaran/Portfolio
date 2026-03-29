"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

export type TimelineItem = {
  company: string;
  role: string;
  period: string;
  points: readonly string[];
};

export function Timeline({ items, className }: { items: readonly TimelineItem[]; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div aria-hidden className="absolute left-4 top-0 h-full w-px bg-white/10 sm:left-5" />
      <div className="space-y-6">
        {items.map((it, idx) => (
          <motion.div
            key={`${it.company}-${it.role}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.04 }}
            className="relative pl-12 sm:pl-14"
          >
            <div className="absolute left-2 top-4 h-4 w-4 rounded-full border border-white/20 bg-gradient-to-r from-indigo-400/50 to-sky-400/40 shadow-glow sm:left-3" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{it.company}</div>
                <div className="text-xs text-white/50">{it.period}</div>
              </div>
              <div className="mt-1 text-sm text-white/75">{it.role}</div>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-white/70">
                {it.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

