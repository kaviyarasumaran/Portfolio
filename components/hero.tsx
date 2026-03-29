"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import * as React from "react";

import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { profile } from "@/lib/data";
import { useTypewriter } from "@/hooks/use-typewriter";

function FloatingTechPills() {
  const pills = [
    { label: "React", className: "from-indigo-500/30 to-sky-500/20" },
    { label: "TypeScript", className: "from-sky-500/25 to-indigo-500/20" },
    { label: "Node.js", className: "from-violet-500/25 to-sky-500/20" }
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {pills.map((p, idx) => (
        <motion.div
          key={p.label}
          className={cn(
            "absolute hidden items-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-br px-4 py-2 text-xs text-white/85 shadow-xl backdrop-blur-2xl sm:flex",
            p.className
          )}
          style={{
            top: `${18 + idx * 18}%`,
            left: idx % 2 === 0 ? "8%" : "72%"
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ duration: 6 + idx, repeat: Infinity, ease: "easeInOut", delay: 0.2 + idx * 0.12 }}
        >
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
          {p.label}
        </motion.div>
      ))}
    </div>
  );
}

function AnimatedBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[40%] bg-[radial-gradient(closest-side,rgba(99,102,241,.35),transparent),radial-gradient(closest-side,rgba(56,189,248,.28),transparent)] blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,15,25,0.1),rgba(11,15,25,1))]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}

export function Hero() {
  const typed = useTypewriter({ words: profile.roles });

  return (
    <section id="home" className="relative flex min-h-[92dvh] items-center">
      <AnimatedBackdrop />
      <FloatingTechPills />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-10 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Dark-first • Glassmorphism • Motion
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {profile.name}
              <span className="text-white/50"> — </span>
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                {profile.headline}
              </span>
            </h1>

            <div className="mt-5 text-white/70">
              <span className="text-sm uppercase tracking-[0.24em] text-white/50">Currently shipping</span>
              <div className="mt-2 flex items-center gap-2 text-base">
                <span className="font-medium text-white/90">{typed}</span>
                <span className="h-5 w-px bg-white/20" />
                <span className="text-white/60">SaaS-grade UI + AI workflows</span>
                <span className="ml-1 inline-block h-4 w-0.5 animate-pulse rounded-full bg-white/50" />
              </div>
            </div>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70">{profile.summary}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="#projects" variant="primary" size="lg" className="justify-center">
                View Projects <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonAnchor
                href="/resume.pdf"
                download
                onClick={(e) => e.stopPropagation()}
                variant="secondary"
                size="lg"
                className="justify-center"
              >
                Download Resume <Download className="h-4 w-4" />
              </ButtonAnchor>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {profile.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-glow backdrop-blur-2xl"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_20%,rgba(99,102,241,.45),transparent_60%),radial-gradient(circle_at_80%_35%,rgba(56,189,248,.32),transparent_55%)]" />
              <div className="relative">
                <div className="text-sm font-medium text-white/85">Dashboard-first UI</div>
                <div className="mt-2 text-sm text-white/65">
                  Modular components, micro-interactions, and motion that stays smooth under load.
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { k: "UI", v: "Glass + Grid" },
                    { k: "DX", v: "TypeScript" },
                    { k: "Perf", v: "No jank" },
                    { k: "AI", v: "RAG-ready" }
                  ].map((item) => (
                    <div
                      key={item.k}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm backdrop-blur-xl"
                    >
                      <div className="text-xs text-white/50">{item.k}</div>
                      <div className="mt-1 font-medium text-white/85">{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
