"use client";

import { SectionWrapper } from "@/components/section-wrapper";
import { TechGrid } from "@/components/tech-grid";
import { techStack } from "@/lib/data";

export function TechStackSection() {
  return (
    <SectionWrapper
      id="tech"
      eyebrow="Tech Stack"
      title="Tools I ship with."
      subtitle="A mix of frontend precision, backend pragmatism, and DevOps discipline — optimized for production."
    >
      <TechGrid items={techStack} />
    </SectionWrapper>
  );
}

