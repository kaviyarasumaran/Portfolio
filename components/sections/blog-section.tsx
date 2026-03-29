"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionWrapper } from "@/components/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
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
    </SectionWrapper>
  );
}
