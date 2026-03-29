"use client";

import { SectionWrapper } from "@/components/section-wrapper";
import { Timeline } from "@/components/timeline";
import { experience } from "@/lib/data";

export function ExperienceSection() {
  return (
    <SectionWrapper
      id="experience"
      eyebrow="Experience"
      title="Timeline that tells a product story."
      subtitle="Scroll-triggered motion and a clear vertical narrative for impact."
    >
      <Timeline items={experience} />
    </SectionWrapper>
  );
}

