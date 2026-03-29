"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Draft = {
  title: string;
  category: string;
  readingTime: string;
  tags: string;
  excerpt: string;
  content: string;
};

const storageKey = "blog:draft:v1";

export function BlogEditor() {
  const [draft, setDraft] = React.useState<Draft>({
    title: "",
    category: "SaaS",
    readingTime: "5 min",
    tags: "SaaS, UI, Architecture",
    excerpt: "",
    content: ""
  });
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Draft;
      setDraft((d) => ({ ...d, ...parsed }));
    } catch {
      // ignore
    }
  }, []);

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    setSavedAt(Date.now());
  }

  const tagList = draft.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);

  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/blog" className="text-sm text-white/65 transition hover:text-white">
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={save}>
                Save Draft
              </Button>
              <Link
                href="/blog"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
              >
                Done
              </Link>
            </div>
          </div>

          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">Create a blog post</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            UI-only editor with local draft persistence. Hook this to MDX / a CMS later.
          </p>
          {savedAt ? <div className="mt-2 text-xs text-white/50">Saved {new Date(savedAt).toLocaleTimeString()}.</div> : null}

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-6">
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm text-white/70">
                    Title
                    <input
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                      placeholder="Post title"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-white/70">
                      Category
                      <input
                        value={draft.category}
                        onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                        className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                        placeholder="SaaS"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-white/70">
                      Reading time
                      <input
                        value={draft.readingTime}
                        onChange={(e) => setDraft((d) => ({ ...d, readingTime: e.target.value }))}
                        className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                        placeholder="5 min"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm text-white/70">
                    Tags (comma separated)
                    <input
                      value={draft.tags}
                      onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                      className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                      placeholder="SaaS, UI, Performance"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-white/70">
                    Excerpt
                    <textarea
                      value={draft.excerpt}
                      onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                      className="min-h-[90px] rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                      placeholder="Short summary shown on cards…"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-white/70">
                    Content (markdown-ish)
                    <textarea
                      value={draft.content}
                      onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                      className="min-h-[220px] rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                      placeholder={"Write your post here...\n\n## Section\n- Bullet\n- Bullet"}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardContent className="p-6">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">Preview</div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      {draft.category || "Category"}
                    </span>
                    <span className="text-xs text-white/50">{draft.readingTime || "—"}</span>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-white">{draft.title || "Untitled post"}</div>
                  <div className="mt-2 text-sm text-white/65">{draft.excerpt || "Add an excerpt to show on cards."}</div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tagList.length ? (
                      tagList.map((t) => (
                        <Badge key={t} className="text-white/70">
                          {t}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-white/45">Add tags to preview badges.</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-xs font-medium uppercase tracking-wide text-white/50">Draft content</div>
                <pre className="mt-3 max-h-[360px] overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/70">
                  {draft.content || "Start writing to see your draft content here."}
                </pre>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

