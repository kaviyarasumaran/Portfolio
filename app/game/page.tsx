"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/game-api";
import {
  resetGameStorage,
  setCurrentRound,
  setStudentProfile,
  setUserId,
  setUserLetter,
  setUserTech
} from "@/lib/game-storage";

export default function GameRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [studentId, setStudentId] = React.useState("");

  async function start() {
    setError(null);
    const payload = { name: name.trim(), department: department.trim(), studentId: studentId.trim() };
    if (!payload.name || !payload.department || !payload.studentId) {
      setError("Enter name, department, and student ID.");
      return;
    }
    setLoading(true);
    resetGameStorage();
    try {
      const res = await api.register(payload);
      setStudentProfile(payload);
      setUserId(res.userId);
      setUserLetter(res.letter);
      setUserTech(res.tech);
      setCurrentRound(res.currentRound);
      if (res.nextStep === "assignment") router.push("/assignment");
      else if (res.nextStep === "vote") router.push("/vote");
      else if (res.nextStep === "results") router.push("/vote");
      else router.push("/quiz");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative">
      <SectionWrapper
        id="game"
        eyebrow="Challenge"
        title="AI SaaS & Micro SaaS — Quiz + Peer Referral + Voting"
        subtitle="Register once. Play 3 rounds. Refer one assigned peer each round. Vote at the end."
        className="pt-10"
      >
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-glow backdrop-blur-2xl">
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
          ) : null}

          <div className="grid gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
            />
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
            />
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Student ID"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>

          <div className="mt-5">
            <Button onClick={start} variant="primary" size="lg" disabled={loading} className="w-full justify-center">
              {loading ? "Starting…" : "Start Game"}
            </Button>
          </div>

          <div className="mt-4 text-xs text-white/50">
            Backend: FastAPI + MongoDB. Frontend: Next.js App Router + Tailwind. Uses <code className="text-white/80">fetch</code>.
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
