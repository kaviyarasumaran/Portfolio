import * as React from "react";

import { cn } from "@/lib/cn";

export function Tooltip({
  content,
  children,
  className
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs text-white/90 shadow-xl backdrop-blur-xl group-hover:block">
        {content}
      </span>
    </span>
  );
}

