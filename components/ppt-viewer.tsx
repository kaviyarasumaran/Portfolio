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

function defaultPdfSrc(pptxSrc: string) {
  if (pptxSrc.toLowerCase().endsWith(".pptx")) return pptxSrc.slice(0, -5) + ".pdf";
  return null;
}

export function PptViewer({
  src,
  pdfSrc,
  title,
  className
}: {
  src: string;
  pdfSrc?: string;
  title?: string;
  className?: string;
}) {
  const [origin, setOrigin] = React.useState("");
  const [pdfAvailable, setPdfAvailable] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const effectivePdfSrc = React.useMemo(() => pdfSrc ?? defaultPdfSrc(src), [pdfSrc, src]);
  const absolutePdf = React.useMemo(
    () => (origin && effectivePdfSrc ? toAbsoluteUrl(effectivePdfSrc, origin) : ""),
    [effectivePdfSrc, origin]
  );

  React.useEffect(() => {
    let canceled = false;
    async function check() {
      if (!absolutePdf || !isHttpUrl(absolutePdf)) {
        setPdfAvailable(false);
        return;
      }
      setPdfAvailable(null);
      try {
        const res = await fetch(absolutePdf, { method: "HEAD" });
        const ok = res.ok;
        const contentType = res.headers.get("content-type") ?? "";
        const looksLikePdf = contentType.toLowerCase().includes("application/pdf");
        if (!canceled) setPdfAvailable(ok && looksLikePdf);
      } catch {
        if (!canceled) setPdfAvailable(false);
      }
    }
    check();
    return () => {
      canceled = true;
    };
  }, [absolutePdf]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70 backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">PPTX Viewer</div>
          </div>
          <a
            href={src}
            download
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
          >
            Download PPTX
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-glow">
        {pdfAvailable === null ? (
          <div className="p-6 text-sm text-white/70">Loading PDF…</div>
        ) : pdfAvailable ? (
          <iframe
            title={title ?? "PPT Viewer"}
            src={effectivePdfSrc ?? ""}
            className="h-[78vh] w-full bg-black"
            loading="lazy"
          />
        ) : (
          <div className="space-y-3 p-6 text-sm text-white/70">
            <div>PDF not found.</div>
            <div className="text-xs text-white/55">
              Export your PPTX to PDF and place it in <code className="text-white/80">public/</code> with the same name (e.g.{" "}
              <code className="text-white/80">{defaultPdfSrc(src) ?? "/presentation.pdf"}</code>).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
