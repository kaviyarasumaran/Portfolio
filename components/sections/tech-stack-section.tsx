"use client";

import { SectionWrapper } from "@/components/section-wrapper";
import { TechGrid } from "@/components/tech-grid";
import { Badge } from "@/components/ui/badge";
import { concepts, techStack } from "@/lib/data";

export function TechStackSection() {
  return (
    <SectionWrapper
      id="tech"
      eyebrow="Tech Stack"
      title="Tools I ship with."
      subtitle="A mix of frontend precision, backend pragmatism, and DevOps discipline — optimized for production."
    >
      <div className="space-y-10">
        <TechGrid items={techStack} />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white">Concepts</div>
            <div className="text-xs text-white/50">{concepts.length} areas</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {concepts.map((c) => (
              <Badge key={c} className="text-white/70">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
