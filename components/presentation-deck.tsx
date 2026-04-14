"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type Slide = {
  title: string;
  kicker?: string;
  bullets: string[];
};

export function PresentationDeck({
  title,
  slides,
  cta
}: {
  title: string;
  slides: Slide[];
  cta?: { label: string; href: string };
}) {
  const [index, setIndex] = React.useState(0);

  const progress = slides.length === 0 ? 0 : Math.round(((index + 1) / slides.length) * 100);

  const goTo = React.useCallback(
    (next: number) => setIndex(Math.min(slides.length - 1, Math.max(0, next))),
    [slides.length]
  );

  const next = React.useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = React.useCallback(() => goTo(index - 1), [goTo, index]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        goTo(slides.length - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, prev, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[Math.min(index, slides.length - 1)]!;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">Deck</div>
          <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-white/55">
            Slide {index + 1} / {slides.length}
          </div>
          <div className="w-40">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <aside className="hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
            <div className="text-xs font-medium uppercase tracking-wide text-white/50">Slides</div>
            <div className="mt-3 space-y-1">
              {slides.map((s, i) => (
                <button
                  key={`${s.title}-${i}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2 text-left text-sm transition backdrop-blur-xl",
                    i === index
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate">{s.title}</span>
                    <span className="shrink-0 text-[11px] text-white/40">{i + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-xs text-white/45">
            Keyboard: ← →, Space, PgUp/PgDn
          </div>
        </aside>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-glow backdrop-blur-2xl sm:p-10">
            <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_20%,rgba(99,102,241,.42),transparent_60%),radial-gradient(circle_at_80%_35%,rgba(56,189,248,.28),transparent_55%)]" />
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="min-h-[56vh]"
                >
                  {current.kicker ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
                      {current.kicker}
                    </div>
                  ) : null}

                  <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {current.title}
                  </h2>

                  <ul className="mt-6 list-disc space-y-3 pl-5 text-base text-white/70 sm:text-lg">
                    {current.bullets.map((b) => (
                      <li key={b} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={prev} variant="secondary" size="md" disabled={index === 0}>
                <ArrowLeft className="h-4 w-4" /> Prev
              </Button>
              <Button onClick={next} variant="primary" size="md" disabled={index === slides.length - 1}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {cta ? (
              <ButtonLink href={cta.href} variant="ghost" size="md" className="justify-center">
                {cta.label} <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
