"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/date";
import type { BlogPost } from "@/lib/data";

function renderInlineLinks(text: string) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const [full, label, href] = match;
    const start = match.index;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    parts.push(
      <a
        key={`${href}-${start}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-sky-300/90 underline decoration-sky-300/40 underline-offset-4 transition hover:text-sky-200 hover:decoration-sky-200/60"
      >
        {label}
      </a>
    );
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderMarkdown(markdown: string, title: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.trimEnd();

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      const h = line.replace(/^#\s+/, "").trim();
      if (h && h !== title) {
        nodes.push(
          <h2 key={`h1-${i}`} className="text-xl font-semibold tracking-tight text-white">
            {h}
          </h2>
        );
      }
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const h = line.replace(/^##\s+/, "").trim();
      nodes.push(
        <h2 key={`h2-${i}`} className="text-xl font-semibold tracking-tight text-white">
          {h}
        </h2>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const h = line.replace(/^###\s+/, "").trim();
      nodes.push(
        <h3 key={`h3-${i}`} className="text-base font-semibold tracking-tight text-white">
          {h}
        </h3>
      );
      i += 1;
      continue;
    }

    const ulMatch = line.match(/^\-\s+(.*)$/);
    if (ulMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const l = (lines[i] ?? "").trimEnd();
        const m = l.match(/^\-\s+(.*)$/);
        if (!m) break;
        items.push(m[1] ?? "");
        i += 1;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-disc space-y-2 pl-5 text-sm text-white/70">
          {items.map((it) => (
            <li key={it}>{renderInlineLinks(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const l = (lines[i] ?? "").trimEnd();
        const m = l.match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        items.push(m[1] ?? "");
        i += 1;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="list-decimal space-y-2 pl-5 text-sm text-white/70">
          {items.map((it) => (
            <li key={it}>{renderInlineLinks(it)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph: merge consecutive non-blank, non-block lines
    const para: string[] = [];
    while (i < lines.length) {
      const l = (lines[i] ?? "").trimEnd();
      const t = l.trim();
      if (!t) break;
      if (t.startsWith("# ") || t.startsWith("## ") || t.startsWith("### ")) break;
      if (/^\-\s+/.test(t)) break;
      if (/^\d+\.\s+/.test(t)) break;
      para.push(t);
      i += 1;
    }
    const text = para.join(" ");
    nodes.push(
      <p key={`p-${i}`} className={cn("text-sm leading-relaxed text-white/70")}>
        {renderInlineLinks(text)}
      </p>
    );
  }

  return nodes;
}

export function BlogDetail({ post }: { post: BlogPost }) {
  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="flex items-center justify-between gap-3">
            <Link href="/blog" className="text-sm text-white/65 transition hover:text-white">
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px]">{post.category}</span>
              <span className="h-4 w-px bg-white/15" />
              <span>{post.readingTime}</span>
            </div>
          </div>

          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-pretty text-base leading-relaxed text-white/70">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <Badge key={t} className="text-white/70">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
            {post.contentMarkdown
              ? renderMarkdown(post.contentMarkdown, post.title)
              : (post.content ?? []).map((block, idx) => {
                  if (block.type === "h2") {
                    return (
                      <h2 key={idx} className="text-xl font-semibold tracking-tight text-white">
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === "ul") {
                    return (
                      <ul key={idx} className="list-disc space-y-2 pl-5 text-sm text-white/70">
                        {block.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className={cn("text-sm leading-relaxed text-white/70")}>
                      {block.text}
                    </p>
                  );
                })}
          </div>

          <div className="mt-8 text-xs text-white/45">
            Published {formatDate(post.date)}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
