"use client";

import { Badge } from "@/components/ui/badge";

export function ResultBoard({
  techVotes
}: {
  techVotes: Record<string, number>;
}) {
  const sorted = Object.entries(techVotes).sort((a, b) => (b[1] - a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="text-xs font-medium uppercase tracking-wide text-white/50">Votes</div>
        <div className="mt-4 grid gap-2">
          {sorted.map(([tech, count]) => (
            <div key={tech} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-sm text-white/80">{tech}</div>
              <Badge className="text-white/70">{count}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
