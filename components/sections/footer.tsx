export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Kavii. Built with Next.js + Tailwind + Framer Motion.</div>
        <div className="flex flex-wrap items-center gap-4">
          <a className="transition hover:text-white" href="#home">
            Home
          </a>
          <a className="transition hover:text-white" href="#projects">
            Projects
          </a>
          <a className="transition hover:text-white" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

