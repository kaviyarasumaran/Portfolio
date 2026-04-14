export type TechCategory = "Frontend" | "Backend" | "DevOps" | "AI Agent Tech";

export type TechItem = {
  name: string;
  level: "Core" | "Advanced" | "Working";
  category: TechCategory;
  description: string;
};

export type ProjectCategory = "All" | "SaaS" | "AI" | "Mobile";

export type Project = {
  id: string;
  title: string;
  blurb: string;
  category: Exclude<ProjectCategory, "All">[];
  tags: string[];
  highlights: string[];
  links: {
    github?: string;
    demo?: string;
    details?: string;
    extra?: { label: string; href: string }[];
  };
};

export const profile = {
  name: "Kaviii",
  headline: "Frontend Engineer | AI Builder",
  roles: ["Frontend Engineer", "AI Builder", "SaaS Architect", "Next.js Specialist"],
  summary:
    "I build modern web products with a dashboard-grade UI, strong performance, and AI-first experiences — from multi-tenant SaaS platforms to mobile commerce apps.",
  highlights: [
    "3+ years across React, Next.js, React Native, Node.js",
    "Multi-tenant SaaS: RAG search, RBAC, Stripe billing",
    "Platform engineering: MuleSoft Anypoint-like systems",
    "Production delivery: Docker, AWS, CI/CD"
  ]
} as const;

export const techStack: TechItem[] = [
  {
    name: "React",
    level: "Core",
    category: "Frontend",
    description: "Component architecture, state patterns, performance tuning."
  },
  { name: "Next.js", level: "Advanced", category: "Frontend", description: "App Router, SSR, routing, DX." },
  { name: "TypeScript", level: "Core", category: "Frontend", description: "Types at scale, strictness, APIs." },
  { name: "Redux", level: "Advanced", category: "Frontend", description: "Predictable state, complex flows." },
  { name: "React Query", level: "Advanced", category: "Frontend", description: "Server state, caching, mutations." },
  { name: "Node.js", level: "Advanced", category: "Backend", description: "APIs, integrations, background jobs." },
  { name: "FastAPI", level: "Working", category: "Backend", description: "High-performance APIs and services." },
  { name: "LangGraph", level: "Working", category: "AI Agent Tech", description: "Agent graphs, tool routing, memory." },
  { name: "n8n", level: "Working", category: "AI Agent Tech", description: "Workflow automation, triggers, integrations." },
  { name: "Docker", level: "Advanced", category: "DevOps", description: "Containerized dev/prod workflows." },
  { name: "AWS", level: "Working", category: "DevOps", description: "Deployment patterns and cloud primitives." },
  { name: "CI/CD", level: "Advanced", category: "DevOps", description: "Pipelines, automation, release flows." }
];

export const concepts = [
  "System Design",
  "SaaS Architecture",
  "Multi-tenant Design",
  "RBAC",
  "AI/LLM Integration",
  "Knowledge Base Systems",
  "RAG",
  "Geospatial UI",
  "Applied AI UX"
] as const;

export const projects: Project[] = [
  {
    id: "decisionvault",
    title: "DecisionVault",
    blurb: "Multi-tenant SaaS built with React + Radix UI, featuring RAG search, RBAC, and Stripe billing.",
    category: ["SaaS", "AI"],
    tags: ["React", "Radix UI", "RAG", "RBAC", "Stripe", "Postgres"],
    highlights: [
      "Tenant-aware architecture with role-based access",
      "RAG-powered search and knowledge retrieval",
      "Subscription + billing flows with Stripe"
    ],
    links: { details: "/#projects", demo: "https://decision-vault-api-ujco.vercel.app/" }
  },
  {
    id: "zentis-ai",
    title: "Zentis AI",
    blurb: "SaaS ERP built with React + MUI, enhanced with AI-assisted workflows and a dashboard-first UX.",
    category: ["SaaS", "AI"],
    tags: ["React", "MUI", "TypeScript", "SaaS", "ERP", "LLM"],
    highlights: [
      "Dashboard-first ERP modules with clean information hierarchy",
      "AI-assisted flows built to stay trustworthy in production UX",
      "Performance-first UI states: skeletons, optimistic actions, smooth motion"
    ],
    links: { details: "/#projects", demo: "https://zentis.ai/" }
  },
  {
    id: "mulesoft-replica",
    title: "MuleSoft Replica Platform",
    blurb: "An Anypoint-style integration platform built with React + Chakra UI: connectors, flows, and monitoring with a dashboard feel.",
    category: ["SaaS"],
    tags: ["React", "Chakra UI", "Node.js", "Workflow", "Observability"],
    highlights: ["Connector catalog + flow builder UI", "Auth + governance controls", "Monitoring dashboards and logs"],
    links: { details: "/#projects" }
  },
  {
    id: "commerce-mobile",
    title: "Commerce Mobile App",
    blurb: "React Native commerce experience with performance-first UI patterns and clean, scalable architecture.",
    category: ["Mobile"],
    tags: ["React Native", "TypeScript", "Payments", "Performance"],
    highlights: ["Optimized lists + skeleton states", "Checkout experience + integrations", "Shared UI primitives"],
    links: {
      details: "/#projects",
      demo: "https://ayul.in/",
      extra: [{ label: "Instagram Reels", href: "https://www.instagram.com/ayul.life/reels/" }]
    }
  }
];

export const experience = [
  {
    company: "Product Teams",
    role: "Frontend Engineer",
    period: "2023 — Present",
    points: [
      "Shipped dashboard-grade UIs with motion, micro-interactions, and strong information hierarchy.",
      "Built multi-tenant foundations and reusable components for SaaS teams.",
      "Integrated AI workflows (RAG, assistants) with production UX constraints."
    ]
  },
  {
    company: "Platform Engineering",
    role: "Full-stack Engineer",
    period: "2022 — 2023",
    points: [
      "Built integration platform primitives (connectors, flows, monitoring) with a focus on usability.",
      "Designed APIs and workflows with TypeScript and Node.js.",
      "Improved developer experience with CI/CD and containerized environments."
    ]
  }
] as const;

export type BlogPost = {
  slug: string;
  title: string;
  category: "AI UX" | "Next.js" | "SaaS" | "Frontend" | "Architecture";
  readingTime: string;
  date: string; // ISO
  excerpt: string;
  tags: string[];
  contentMarkdown?: string;
  content?: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
  >;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-ai-ux-for-saas-products",
    title: "Designing AI UX for SaaS Products",
    category: "AI UX",
    readingTime: "6 min",
    date: "2026-02-10",
    excerpt:
      "AI can make SaaS products feel smarter and faster — but only when the experience stays clear, trustworthy, and easy to control.",
    tags: ["AI UX", "SaaS", "Product", "Workflows"],
    contentMarkdown: `# Designing AI UX for SaaS Products

AI can make SaaS products feel smarter, faster, and more personalized—but only when the experience stays clear, trustworthy, and easy to control. The best AI UX in SaaS does not just “add intelligence”; it reduces friction in real workflows and helps users understand what the system is doing. [equal](https://www.equal.design/blog/how-ai-is-changing-product-design-for-saas-platforms-2025)

## The real job of AI UX

In SaaS, users usually come to complete a job quickly, not to admire clever automation. That means AI should improve task success, shorten decisions, and remove repetitive work instead of adding novelty for its own sake. [uxplanet](https://uxplanet.org/ux-design-for-saas-interfaces-in-2025-whats-the-difference-de918a00cc5c)

A good rule: if AI does not save time, increase confidence, or improve outcomes, it probably does not belong in the product. [letsgroto](https://www.letsgroto.com/blog/integrating-ai-into-saas-ux-best-practices-and-strategies)

## Where AI fits best

AI works especially well in SaaS when it helps with prediction, recommendation, summarization, search, and workflow automation. Common high-value patterns include smart defaults, auto-fill, contextual suggestions, adaptive dashboards, and conversational assistants. [medium.muz](https://medium.muz.li/designing-for-saas-platforms-best-ux-practices-in-2025-83f99e0507e3)

It is usually safer to start with low-risk assistance, such as recommendations or draft generation, before moving into higher-stakes automation. This progressive approach helps users build trust gradually. [userpilot](https://userpilot.com/blog/ai-ux-design/)

## Design principles that matter

### 1. Make AI visible

Users should know when AI is influencing an outcome, what it is doing, and why it made a suggestion. Clear labels and short explanations reduce confusion and make the interface feel dependable. [payan](https://payan.design/blog/ai-in-ux-design-for-saas)

### 2. Keep human control

AI should assist, not trap users. Good SaaS UX gives users ways to edit, override, retry, or turn off automation so they remain in charge. This is especially important when decisions affect money, compliance, operations, or customer relationships. [letsgroto](https://www.letsgroto.com/blog/integrating-ai-into-saas-ux-best-practices-and-strategies)

### 3. Design for uncertainty

AI is probabilistic, so it will sometimes be wrong. The interface should handle this gracefully with fallback states, editable outputs, and easy feedback loops like “show another,” “regenerate,” or “was this helpful?”. That way, mistakes become recoverable moments instead of dead ends. [userpilot](https://userpilot.com/blog/ai-ux-design/)

### 4. Personalize without overwhelming

Adaptive interfaces can feel powerful when they adjust to user context, role, or behavior. But personalization should simplify the product, not make it feel unpredictable or inconsistent. [invimatic](https://www.invimatic.com/blog/saas-innovation-ux-ui-trends-2025/)

## A practical SaaS flow

A strong AI workflow in SaaS often looks like this:

1. The user enters a goal or starts a task.
2. The AI suggests a useful next step or pre-fills likely inputs.
3. The interface explains the suggestion in one line.
4. The user edits, accepts, or rejects it.
5. The product learns from the interaction and improves future suggestions. [payan](https://payan.design/blog/ai-in-ux-design-for-saas)

This pattern works because it combines speed with control. [letsgroto](https://www.letsgroto.com/blog/integrating-ai-into-saas-ux-best-practices-and-strategies)

## Common mistakes

The biggest mistake is treating AI like a marketing feature instead of a workflow feature. Other common issues include hiding how outputs are generated, over-automating too early, and forcing users into a chat interface when a simpler UI would work better. [f1studioz](https://f1studioz.com/blog/making-complex-ai-simple-ux-design-for-saas-platforms/)

Another mistake is ignoring edge cases. AI features need real-user testing with realistic data, because trust breaks quickly when the system behaves strangely or inconsistently. [payan](https://payan.design/blog/ai-in-ux-design-for-saas)

## What to measure

To know whether AI UX is actually helping, measure more than usage. Track task completion rate, time saved, adoption of AI-assisted flows, edit rate of AI outputs, user trust signals, and retention in AI-powered workflows. [userpilot](https://userpilot.com/blog/ai-ux-design/)

If users keep accepting AI suggestions without needing major correction, that is a strong signal of good fit. If they constantly override or abandon the feature, the UX likely needs simplification or better explanation. [letsgroto](https://www.letsgroto.com/blog/integrating-ai-into-saas-ux-best-practices-and-strategies)

## Closing thought

The goal of AI UX in SaaS is not to make products feel futuristic. It is to make complex work feel clearer, faster, and more reliable. [uxplanet](https://uxplanet.org/ux-design-for-saas-interfaces-in-2025-whats-the-difference-de918a00cc5c)
`
  },
  {
    slug: "app-router-patterns-i-use-in-production",
    title: "App Router Patterns I Use in Production",
    category: "Next.js",
    readingTime: "8 min",
    date: "2026-01-22",
    excerpt:
      "The production App Router patterns I rely on: server-first rendering, thin route files, clear boundaries, and resilient loading/error states.",
    tags: ["Next.js", "App Router", "Architecture", "Server Components"],
    contentMarkdown: `# App Router Patterns I Use in Production
These are the Next.js App Router patterns I rely on when building production apps: keep Server Components as the default, keep routes thin, and move business logic into testable server-side layers. The goal is to reduce client-side JavaScript, keep boundaries clear, and make the app easier to scale. [dev](https://dev.to/devjordan/nextjs-15-app-router-complete-guide-to-server-and-client-components-5h6k)
## Server-first by default
I treat Server Components as the default for data fetching, static content, and anything that should stay off the client bundle. I only add \`'use client'\` when I need interactivity, browser APIs, or React hooks. [dev](https://dev.to/devjordan/nextjs-15-app-router-complete-guide-to-server-and-client-components-5h6k)

This keeps pages lighter and forces a cleaner separation between rendering and interaction. [upsun](https://upsun.com/blog/avoid-common-mistakes-with-next-js-app-router/)
## Thin route files
My \`page.tsx\`, \`layout.tsx\`, and \`loading.tsx\` files stay mostly orchestration-only. They compose components, pass params, and wire up UI states, but they do not hold business logic. [dev](https://dev.to/yukionishi1129/building-a-production-ready-nextjs-app-router-architecture-a-complete-playbook-3f3h)

A route file should feel like a shell, not a service layer. [ecosire](https://ecosire.com/blog/nextjs-16-app-router-production)
## Feature-based structure
I prefer organizing code by domain or feature rather than by technical type alone. For example, auth, billing, approvals, and dashboard each get their own feature area with colocated UI, logic, and tests. [dev](https://dev.to/yukionishi1129/building-a-production-ready-nextjs-app-router-architecture-a-complete-playbook-3f3h)

That structure scales better than a giant shared folder once the app grows. [makerkit](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
## Server actions for mutations
For form submissions and data mutations, I use Server Actions instead of bouncing everything through API routes when the use case is simple. I keep them thin: validate input, call a service, then revalidate or redirect as needed. [youtube](https://www.youtube.com/watch?v=MYCIj6DfSnU)

This pattern works well because the mutation logic stays close to the UI without leaking server code into client components. [makerkit](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
## Separate business logic
I never put important domain logic directly inside a page or action. Instead, I extract it into service files so it can be tested independently and reused across actions, route handlers, or background jobs. [dev](https://dev.to/yukionishi1129/building-a-production-ready-nextjs-app-router-architecture-a-complete-playbook-3f3h)

That makes the app easier to maintain when requirements change. [ecosire](https://ecosire.com/blog/nextjs-16-app-router-production)
## Clear server/client boundaries
I keep server-only code in server-specific modules and avoid importing it into Client Components. If a component needs interactivity, I pass only the data it needs and keep the rest on the server. [dev](https://dev.to/devjordan/nextjs-15-app-router-complete-guide-to-server-and-client-components-5h6k)

This reduces accidental bundle bloat and lowers the risk of exposing sensitive logic. [makerkit](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
## Loading and error states everywhere
I design every important route with explicit loading and error handling. Nested \`loading.tsx\`, \`error.tsx\`, and \`not-found.tsx\` files help the app fail gracefully and keep the user experience responsive. [ztabs](https://ztabs.co/blog/nextjs-app-router-best-practices)

In production, resilience matters as much as correctness. [ecosire](https://ecosire.com/blog/nextjs-16-app-router-production)
## One practical example
A production dashboard route might look like this:

- \`app/(dashboard)/projects/page.tsx\` for composition.
- \`features/projects/projects.service.ts\` for business rules.
- \`features/projects/projects.actions.ts\` for mutations.
- \`features/projects/components/*\` for UI.
- \`app/(dashboard)/projects/loading.tsx\` and \`error.tsx\` for route states. [dev](https://dev.to/yukionishi1129/building-a-production-ready-nextjs-app-router-architecture-a-complete-playbook-3f3h)

That layout keeps the App Router simple while still supporting real-world complexity. [ztabs](https://ztabs.co/blog/nextjs-app-router-best-practices)
## What I avoid
I avoid putting everything in the \`app\` folder, using client components too early, and mixing data access with presentation. I also avoid overusing routes as a dumping ground for logic, because that creates brittle code over time. [dev](https://dev.to/yukionishi1129/building-a-production-ready-nextjs-app-router-architecture-a-complete-playbook-3f3h)
`
  },
  {
    slug: "multi-tenant-rbac-that-stays-maintainable",
    title: "Multi-tenant RBAC That Stays Maintainable",
    category: "SaaS",
    readingTime: "7 min",
    date: "2025-12-15",
    excerpt:
      "A maintainable multi-tenant RBAC model keeps tenant context explicit, roles sane, enforcement layered, and governance auditable.",
    tags: ["SaaS", "RBAC", "Multi-tenant", "Authorization"],
    contentMarkdown: `# Multi-tenant RBAC That Stays Maintainable

Maintainable multi-tenant RBAC starts with one rule: every authorization decision must include tenant context, and roles should stay simple enough that humans can still explain them. In practice, the most durable model is usually hybrid RBAC: a small set of platform-defined defaults plus limited tenant customization, not unlimited tenant-defined chaos. [docs.aws.amazon](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-api-access-authorization/avp-mt-abac-examples.html)

## Core model

Each access check should answer a question like: “Can user U perform action A on resource R inside tenant T?”. That framing prevents the most dangerous failure mode in SaaS RBAC: accidentally evaluating permissions without a tenant boundary. [plainenglish](https://plainenglish.io/software/rbac-in-multi-tenant-saas-how-to-design-authorization-that-s-both-safe-and-fast)

A maintainable schema usually includes tenants, users, memberships, roles, permissions, and resource ownership data with \`tenant_id\` carried everywhere it matters. Tenant isolation should be enforced at schema level, runtime checks, and tests rather than trusted as an application convention. [workos](https://workos.com/blog/how-to-design-multi-tenant-rbac-saas)

## Keep roles sane

The fastest way to break RBAC is role explosion: too many near-duplicate roles created for every exception. A better pattern is to ship stable defaults such as Admin, Manager, Editor, and Viewer, then allow only carefully bounded custom roles per tenant. [workos](https://workos.com/blog/how-to-design-multi-tenant-rbac-saas)

Permission bundles also help. Instead of exposing dozens of low-level permissions, group them into product concepts like \`billing.manage\`, \`users.invite\`, or \`reports.export\`, which are easier to reason about and safer to evolve. Role hierarchies or composition can reduce duplication, but they need strong guardrails so inheritance does not become invisible complexity. [techosquare](https://www.techosquare.com/blog/rbac-for-multi-tenant-apps)

## Enforcement layers

Authorization is easier to maintain when enforcement is split by responsibility. The gateway or edge layer should verify identity and tenant membership, while service-layer logic handles business rules like ownership, status, and workflow constraints. [techosquare](https://www.techosquare.com/blog/rbac-for-multi-tenant-apps)

The policy or authorization layer should remain the canonical decision point, especially for auditing and consistency across services. This separation keeps controllers thin and avoids scattering permission logic across random endpoints. [docs.aws.amazon](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-api-access-authorization/opa-rbac-examples.html)

## Patterns that scale

A hybrid template model is often the best long-term trade-off because it balances flexibility with operational sanity. It gives most tenants stable defaults while still supporting enterprise customers that need controlled customization. [workos](https://workos.com/blog/how-to-design-multi-tenant-rbac-saas)

For stronger isolation, some architectures use per-tenant policy stores, which AWS describes as a best practice for maintaining tenant isolation in multi-tenant authorization systems. That pattern is especially useful when policy complexity or compliance requirements are high. [docs.aws.amazon](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-api-access-authorization/avp-mt-abac-examples.html)

## Operational guardrails

Good RBAC design is not just a data model; it is also product governance. Changes should follow a predictable flow such as preview, validate, approve, apply, audit, and rollback so access control remains debuggable over time. [techosquare](https://www.techosquare.com/blog/rbac-for-multi-tenant-apps)

Audit logs are essential because teams eventually need point-in-time answers about who could access what and when. Caching can improve performance, but cache keys and invalidation must remain tenant-aware or they can quietly break isolation. [plainenglish](https://plainenglish.io/software/rbac-in-multi-tenant-saas-how-to-design-authorization-that-s-both-safe-and-fast)

## A practical blueprint

A production-ready blueprint often looks like this:

- \`users\`
- \`tenants\`
- \`memberships\` with \`user_id\`, \`tenant_id\`, \`role_id\`
- \`roles\` with \`tenant_id\` nullable for system templates
- \`role_permissions\`
- \`resources\` with \`tenant_id\`
- \`authorize(user, tenant, action, resource)\` as the only allowed permission entry point [plainenglish](https://plainenglish.io/software/rbac-in-multi-tenant-saas-how-to-design-authorization-that-s-both-safe-and-fast)

That single entry-point pattern makes reviews, testing, and refactoring much easier because engineers are not inventing ad hoc checks everywhere. [docs.aws.amazon](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-api-access-authorization/opa-rbac-examples.html)

## What I would avoid

I would avoid encoding permissions directly in frontend logic, creating tenant-specific permission names everywhere, and letting every enterprise customer invent unlimited roles. I would also avoid mixing RBAC with one-off exceptions in the same layer, because that is usually where maintainability starts to collapse. [docs.aws.amazon](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-api-access-authorization/opa-rbac-examples.html)
`
  }
];
