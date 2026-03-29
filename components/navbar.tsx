"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/cn";

const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "tech", label: "Tech" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" }
] as const;

export function Navbar() {
  const [active, setActive] = React.useState<(typeof items)[number]["id"]>("home");
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 16));

  React.useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible?.target) return;
        setActive(visible.target.id as (typeof items)[number]["id"]);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.2, 0.3, 0.4] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-colors",
        scrolled ? "border-white/10 bg-bg/70 backdrop-blur-2xl" : "bg-transparent"
      )}
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="#home" className="group inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm backdrop-blur-xl">
            K
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            <span className="text-white/70 group-hover:text-white">kavii</span>
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">.dev</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`#${it.id}`}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition",
                active === it.id ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#projects"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            View Work
          </Link>
          <Link
            href="#contact"
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-3 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
          >
            Let’s Talk
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
