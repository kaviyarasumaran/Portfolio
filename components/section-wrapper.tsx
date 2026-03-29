"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/cn";

export function SectionWrapper({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-16 sm:py-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          {eyebrow ? (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
              {eyebrow}
            </div>
          ) : null}
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p> : null}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

