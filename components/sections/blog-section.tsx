"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Presentation } from "lucide-react";
import Link from "next/link";

import { SectionWrapper } from "@/components/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { blogPosts } from "@/lib/data";

export function BlogSection() {
  return (
    <SectionWrapper
      id="blog"
      eyebrow="Blog (UI)"
      title="Writing, but kept intentionally lightweight."
      subtitle="Mock cards only — no backend required."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((p, idx) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.04 }}
          >
            <Link href={`/blog/${p.slug}`} className="block">
              <Card className="group cursor-pointer transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px]">
                      {p.category}
                    </span>
                    <span>{p.readingTime}</span>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white">{p.title}</div>
                  <div className="mt-2 text-sm text-white/65">{p.excerpt}</div>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm text-white/70 transition group-hover:text-white">
                    Read <ArrowUpRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
        >
          View all posts
        </Link>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <Card className="overflow-hidden">
            <CardContent className="relative p-6">
              <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_20%,rgba(99,102,241,.35),transparent_60%),radial-gradient(circle_at_80%_35%,rgba(56,189,248,.22),transparent_55%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
                  <Presentation className="h-3.5 w-3.5 text-sky-300" />
                  Tomorrow: AI + Micro SaaS • Student interaction
                </div>
                <div className="mt-4 text-lg font-semibold text-white">One-page deck (PPT-style)</div>
                <div className="mt-2 text-sm text-white/65">
                  System design, SaaS architecture, multi-tenant + RBAC, RAG + knowledge base systems, applied AI UX — in a clean slide flow.
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href="/ppt" variant="primary" size="md" className="justify-center">
                    Open deck <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink href="/challenge" variant="secondary" size="md" className="justify-center">
                    Take the challenge <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
            <div className="text-xs font-medium uppercase tracking-wide text-white/50">Presenter Notes</div>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Use ← → / Space to navigate slides.</li>
              <li>End with “Take the challenge” and switch to the game page.</li>
              <li>Share the game plan later and I’ll implement it.</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
