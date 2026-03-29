import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/inter/latin.css";

import { Providers } from "@/app/providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Kavii | Frontend Engineer | AI Builder",
  description: "A modern, interactive portfolio built with Next.js, Tailwind CSS, and Framer Motion."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="min-h-dvh bg-bg font-sans text-white antialiased selection:bg-indigo-500/30">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
