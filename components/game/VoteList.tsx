"use client";

import { cn } from "@/lib/cn";

export function VoteList({
  techs,
  value,
  onChange
}: {
  techs: string[];
  value: string | null;
  onChange: (tech: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {techs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            "rounded-2xl border px-4 py-4 text-left text-sm transition backdrop-blur-xl",
            value === t
              ? "border-white/20 bg-white/10 text-white"
              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

