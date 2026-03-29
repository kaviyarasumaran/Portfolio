"use client";

import { Github, Linkedin, Mail } from "lucide-react";

import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  return (
    <SectionWrapper
      id="contact"
      eyebrow="Contact"
      title="Let’s build something sharp."
      subtitle="Minimal form UI (no backend). Replace links + add form handling when you’re ready."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardContent className="p-6">
            <form className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-white/70">
                  Name
                  <input
                    className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                    placeholder="Your name"
                  />
                </label>
                <label className="grid gap-2 text-sm text-white/70">
                  Email
                  <input
                    type="email"
                    className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                    placeholder="you@domain.com"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm text-white/70">
                Message
                <textarea
                  className="min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                  placeholder="What are we building?"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" /> kaviyarasukasii@gmail.com
                  </span>
                </div>
                <Button type="button" variant="primary">
                  Send message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-5">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-white">Social</div>
              <div className="mt-4 grid gap-2">
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  LinkedIn <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  GitHub <Github className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-glow">
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-white">CTA</div>
              <div className="mt-2 text-sm text-white/70">
                Want this as a real product site? I can add analytics, MDX blog, and a contact pipeline.
              </div>
              <div className="mt-4">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
                >
                  Explore projects
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}

