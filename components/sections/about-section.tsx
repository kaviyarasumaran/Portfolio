"use client";

import { motion } from "framer-motion";
import { Bot, Layers, ShieldCheck } from "lucide-react";

import { SectionWrapper } from "@/components/section-wrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { profile } from "@/lib/data";

const steps = [
  {
    title: "Product UI",
    desc: "Dashboard-grade components with strong hierarchy and polish."
  },
  {
    title: "SaaS Architecture",
    desc: "Multi-tenant patterns, RBAC, billing-aware flows."
  },
  {
    title: "AI Integrations",
    desc: "RAG, assistants, and UX that stays trustworthy in production."
  }
] as const;

export function AboutSection() {
  return (
    <SectionWrapper
      id="about"
      eyebrow="About"
      title="A developer portfolio with product-level UI."
      subtitle="I focus on SaaS-first UX, multi-tenant architecture, and AI integrations that feel natural — not bolted on."
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <Card className="shadow-glow">
            <CardHeader>
              <div className="text-sm font-semibold text-white">Summary</div>
              <div className="mt-2 text-sm leading-relaxed text-white/70">{profile.summary}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-medium uppercase tracking-wide text-white/50">What I optimize for</div>
              <div className="mt-4 space-y-4">
                {steps.map((s, idx) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.05 }}
                    className="relative pl-6"
                  >
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
                    <div className="text-sm font-medium text-white/90">{s.title}</div>
                    <div className="mt-1 text-sm text-white/65">{s.desc}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="group transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
              <CardContent className="p-5">
                <Layers className="h-5 w-5 text-indigo-300" />
                <div className="mt-3 text-sm font-semibold text-white">Experience</div>
                <div className="mt-2 text-sm text-white/70">3 years building React + Next.js products.</div>
              </CardContent>
            </Card>
            <Card className="group transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
              <CardContent className="p-5">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <div className="mt-3 text-sm font-semibold text-white">Skills</div>
                <div className="mt-2 text-sm text-white/70">TypeScript, Redux, React Query, Node, FastAPI.</div>
              </CardContent>
            </Card>
            <Card className="group transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
              <CardContent className="p-5">
                <Bot className="h-5 w-5 text-violet-300" />
                <div className="mt-3 text-sm font-semibold text-white">Focus</div>
                <div className="mt-2 text-sm text-white/70">AI UX, SaaS systems, multi-tenant foundations.</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="text-sm font-semibold text-white">Highlights</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {profile.highlights.map((h) => (
                <div
                  key={h}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75 backdrop-blur-xl"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

