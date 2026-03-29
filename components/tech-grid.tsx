"use client";

import { motion } from "framer-motion";

import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import type { TechCategory, TechItem } from "@/lib/data";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
};

const levelStyles: Record<TechItem["level"], string> = {
  Core: "from-indigo-400/30 to-sky-400/20",
  Advanced: "from-violet-400/30 to-indigo-400/20",
  Working: "from-sky-400/25 to-violet-400/15"
};

export function TechGrid({ items }: { items: TechItem[] }) {
  const byCategory = items.reduce<Record<TechCategory, TechItem[]>>(
    (acc, t) => {
      acc[t.category].push(t);
      return acc;
    },
    { Frontend: [], Backend: [], DevOps: [] }
  );

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {(Object.keys(byCategory) as TechCategory[]).map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight text-white">{category}</div>
            <div className="text-xs text-white/50">{byCategory[category].length} tools</div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {byCategory[category].map((t) => (
              <motion.div key={t.name} variants={item}>
                <Tooltip
                  content={
                    <div className="max-w-[220px]">
                      <div className="font-medium text-white">{t.name}</div>
                      <div className="mt-1 text-white/70">{t.description}</div>
                      <div className="mt-2 text-[11px] uppercase tracking-wide text-white/50">Level: {t.level}</div>
                    </div>
                  }
                >
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 backdrop-blur-xl transition will-change-transform hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
                    )}
                    tabIndex={0}
                    role="button"
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                        "[background:radial-gradient(circle_at_20%_20%,rgba(99,102,241,.35),transparent_50%),radial-gradient(circle_at_90%_30%,rgba(56,189,248,.24),transparent_55%)]"
                      )}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-white/90">{t.name}</div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border border-white/10 bg-gradient-to-br px-2 py-0.5 text-[10px] text-white/80",
                          levelStyles[t.level]
                        )}
                      >
                        {t.level}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
