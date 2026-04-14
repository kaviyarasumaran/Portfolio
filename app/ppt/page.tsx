import { PptViewer } from "@/components/ppt-viewer";
import Link from "next/link";

export default function PptPage() {
  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">Presentation</div>
          <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            AI SaaS & Micro SaaS
          </h1>
          <div className="mt-2 text-sm text-white/65">Present the PPTX directly on this page.</div>
          <div className="mt-4">
            <Link
              href="/game"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
            >
              Take the challenge
            </Link>
          </div>
        </div>

        <PptViewer src="/aisaas.pptx" pdfSrc="/aisaas.pdf" title="AI SaaS PPTX" />
      </div>
    </main>
  );
}
