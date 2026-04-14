"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

function toAbsoluteUrl(src: string, origin: string) {
  if (src.startsWith("/")) return `${origin}${src}`;
  return src;
}

function isHttpUrl(src: string) {
  try {
    const u = new URL(src);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function PptViewer({
  src,
  title,
  className
}: {
  src: string;
  title?: string;
  className?: string;
}) {
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const absolute = React.useMemo(() => (origin ? toAbsoluteUrl(src, origin) : ""), [origin, src]);
  const embedUrl = React.useMemo(() => {
    if (!absolute || !isHttpUrl(absolute)) return "";
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absolute)}`;
  }, [absolute]);

  const isLocalhost = React.useMemo(() => origin.includes("localhost") || origin.includes("127.0.0.1"), [origin]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70 backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">PPTX Viewer</div>
            <div className="mt-1 text-xs text-white/55">
              Uses Microsoft Office web viewer. Works best after deployment (public URL).
            </div>
          </div>
          <a
            href={src}
            download
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
          >
            Download PPTX
          </a>
        </div>
        {isLocalhost ? (
          <div className="mt-3 text-xs text-white/55">
            Note: you’re on <code className="text-white/80">localhost</code>, so the Office viewer may not load the file. Deploying this site
            will make the PPTX URL publicly reachable.
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-glow">
        {embedUrl ? (
          <iframe
            title={title ?? "PPTX Viewer"}
            src={embedUrl}
            className="h-[78vh] w-full bg-black"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="p-6 text-sm text-white/70">
            Viewer not ready yet. Refresh the page once it finishes loading.
          </div>
        )}
      </div>
    </div>
  );
}

