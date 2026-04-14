import { PresentationDeck, type Slide } from "@/components/presentation-deck";

const slides: Slide[] = [
  {
    kicker: "Student Interaction • April 15, 2026",
    title: "AI + Micro SaaS: Build small. Ship fast. Learn deeper.",
    bullets: [
      "Goal: understand how AI features become real products (not demos).",
      "We’ll turn a simple problem into a Micro SaaS plan with an AI workflow.",
      "You’ll leave with a build path: UI → backend → RAG → multi-tenant → deploy."
    ]
  },
  {
    kicker: "What we’re building",
    title: "Micro SaaS, explained in one sentence",
    bullets: [
      "A small product that solves one painful problem for a specific user group.",
      "Clear value + simple pricing + reliable delivery beats “everything app”.",
      "AI is a feature multiplier when it saves time, reduces mistakes, or unlocks new workflows."
    ]
  },
  {
    kicker: "Picking the right idea",
    title: "Great Micro SaaS problems have these signals",
    bullets: [
      "The user repeats the task weekly/daily (habit + urgency).",
      "The task is annoying or error‑prone (AI can reduce friction).",
      "There’s a measurable outcome (time saved, accuracy improved, revenue protected).",
      "The target user is easy to define (students, tutors, small teams, niche businesses)."
    ]
  },
  {
    kicker: "Concepts",
    title: "System Design → SaaS Architecture",
    bullets: [
      "System design: define inputs/outputs, bottlenecks, failure modes, and scalability targets.",
      "SaaS architecture: auth, billing, data model, environments, and deployment pipelines.",
      "Multi-tenant design: isolate data per tenant; build for org/team accounts from day one."
    ]
  },
  {
    kicker: "Security & access",
    title: "RBAC: permissions that stay sane",
    bullets: [
      "Role-Based Access Control maps roles (Admin/Member/Viewer) to permissions (create/read/update/delete).",
      "RBAC prevents “who can do what?” bugs as features grow.",
      "Rule of thumb: start simple, then expand permissions only when needed."
    ]
  },
  {
    kicker: "AI/LLM Integration",
    title: "Where AI actually helps in products",
    bullets: [
      "Assist: drafting, summarizing, rewriting, explaining, extracting key fields.",
      "Automate: trigger workflows (routing, tagging, follow-ups) with guardrails.",
      "Search: ask questions over your docs/data (RAG) with citations in the UI.",
      "Decide: guided flows that keep humans in control for high-stakes actions."
    ]
  },
  {
    kicker: "Knowledge Base Systems",
    title: "RAG: make your product “know” your data",
    bullets: [
      "Ingest: docs → chunks → embeddings → vector store (plus metadata).",
      "Retrieve: user question → relevant chunks → context window.",
      "Generate: answer + cite sources + show confidence/limits in the UI.",
      "Multi-tenant RAG: retrieval must be tenant-filtered to avoid data leakage."
    ]
  },
  {
    kicker: "UI focus",
    title: "Applied AI UX (trust > magic)",
    bullets: [
      "Show sources, show what will happen, and allow user edits before saving.",
      "Use clear states: loading, partial results, errors, and retry.",
      "Design guardrails: confirmations for destructive actions, rate limits, and safe defaults."
    ]
  },
  {
    kicker: "Bonus",
    title: "Geospatial UI: when location becomes the interface",
    bullets: [
      "Maps are not decoration: they’re a query surface (filter, cluster, select, compare).",
      "Key UX: clear zoom behavior, clustering, and “what changed?” feedback on filters.",
      "Useful for: delivery, field work, real estate, events, campus tools, fleet dashboards."
    ]
  },
  {
    kicker: "Blueprint",
    title: "A simple build plan you can follow",
    bullets: [
      "UI: Next.js + TypeScript + good components, with real empty/loading/error states.",
      "Backend: API routes or a service (Node/FastAPI) with auth and audit logs.",
      "Data: Postgres + tenant_id everywhere; indexes for your main queries.",
      "AI: start with 1 workflow; add RAG only when “knowledge” is essential.",
      "Deploy: Dockerize; ship to a simple hosting setup; measure and iterate."
    ]
  },
  {
    kicker: "Wrap-up",
    title: "What you should do next (today)",
    bullets: [
      "Pick one user + one painful workflow + one measurable outcome.",
      "Sketch 3 screens: input → result → history/audit (that’s already a product).",
      "Decide your AI feature: Assist vs Automate vs Search.",
      "Ship a tiny v1, get feedback, then expand with multi-tenant + RBAC."
    ]
  }
];

export default function WorkshopPage() {
  return (
    <PresentationDeck
      title="AI + Micro SaaS — Student Interaction"
      slides={slides}
      cta={{ label: "Take the challenge", href: "/challenge" }}
    />
  );
}
