"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/cn";

export function QuestionCard({
  index,
  question,
  options,
  value,
  onChange,
  disabled
}: {
  index: number;
  question: string;
  options: string[];
  value: string | null;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl", disabled ? "opacity-80" : "")}>
      <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-white/50">
        <div>Question {index + 1}</div>
        {value ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">
            <Check className="h-3.5 w-3.5 text-emerald-300" />
            Answered
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-base font-semibold text-white">{question}</div>
      <div className="mt-4 grid gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => (disabled ? undefined : onChange(opt))}
            disabled={disabled}
            className={cn(
              "flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-70",
              value === opt
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <span className="leading-relaxed">{opt}</span>
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                value === opt
                  ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                  : "border-white/10 bg-white/5 text-white/30"
              )}
              aria-hidden
            >
              {value === opt ? <Check className="h-3.5 w-3.5" /> : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
