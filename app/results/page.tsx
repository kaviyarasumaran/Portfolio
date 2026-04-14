"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";

import { ResultBoard } from "@/components/game/ResultBoard";
import { Modal } from "@/components/modal";
import { SectionWrapper } from "@/components/section-wrapper";
import { adminApi } from "@/lib/admin-api";
import { resetGameStorage } from "@/lib/game-storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ResultsPage() {
  const PASS_KEY = "challenge_admin_password";

  const [hydrated, setHydrated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [activePassword, setActivePassword] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof adminApi.results>> | null>(null);
  const [topData, setTopData] = React.useState<Awaited<ReturnType<typeof adminApi.topWinners>> | null>(null);
  const [revealCount, setRevealCount] = React.useState(0);
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [revealWinner, setRevealWinner] = React.useState<(Awaited<ReturnType<typeof adminApi.topWinners>>["winners"][number]) | null>(
    null
  );

  React.useEffect(() => {
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem(PASS_KEY) : null;
    if (stored) {
      setPassword(stored);
      setActivePassword(stored);
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    let active = true;
    async function load() {
      if (!activePassword?.trim()) {
        setLoading(false);
        setData(null);
        setTopData(null);
        setRevealCount(0);
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const pw = activePassword.trim();
        const [res, top] = await Promise.all([adminApi.results(pw), adminApi.topWinners(pw, 5)]);
        if (!active) return;
        setData(res);
        setTopData(top);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load results");
        setData(null);
        setTopData(null);
        if (typeof window !== "undefined") window.sessionStorage.removeItem(PASS_KEY);
        setActivePassword(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [hydrated, activePassword]);

  const revealedWinners = React.useMemo(() => {
    const winners = topData?.winners ?? [];
    const ordered = [...winners].sort((a, b) => a.rank - b.rank).reverse(); // #5 → #1
    const max = Math.min(5, ordered.length);
    const count = Math.min(revealCount, max);
    return ordered.slice(0, count);
  }, [revealCount, topData?.winners]);

  const winnersToReveal = Math.min(5, topData?.winners?.length ?? 0);
  const nextRankToReveal = winnersToReveal ? winnersToReveal - revealCount : null; // 5..1

  function revealNext() {
    if (!winnersToReveal) return;
    const ordered = [...(topData?.winners ?? [])].sort((a, b) => a.rank - b.rank).reverse(); // #5 → #1
    const nextIndex = revealCount;
    if (nextIndex >= ordered.length || nextIndex >= winnersToReveal) return;
    setRevealWinner(ordered[nextIndex] ?? null);
    setRevealOpen(true);
    setRevealCount((prev) => Math.min(prev + 1, winnersToReveal));
  }

  function resetReveal() {
    setRevealCount(0);
    setRevealOpen(false);
    setRevealWinner(null);
  }

  async function login() {
    const next = password.trim();
    if (!next) return;
    setError(null);
    setLoading(true);
    try {
      await adminApi.login(next);
      if (typeof window !== "undefined") window.sessionStorage.setItem(PASS_KEY, next);
      setActivePassword(next);
    } catch (e) {
      setData(null);
      setTopData(null);
      setError(e instanceof Error ? e.message : "Login failed");
      if (typeof window !== "undefined") window.sessionStorage.removeItem(PASS_KEY);
      setActivePassword(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative">
      <SectionWrapper
        id="results"
        eyebrow="Results"
        title="Leaderboard"
        subtitle="Admin-only: Tech with highest votes wins. Users assigned to that tech are winners."
        className="pt-10"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="text-xs font-medium uppercase tracking-wide text-white/50">Admin Password</div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                type="password"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
              />
              <Button onClick={login} variant="primary" disabled={loading || !password.trim()} className="w-full justify-center sm:w-auto">
                {loading ? "Loading…" : "Login"}
              </Button>
            </div>
          </div>

          {!activePassword?.trim() || loading || !data ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              {activePassword?.trim() ? "Loading results…" : "Login to view results."}
            </div>
          ) : !data.open ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              Waiting for all votes…
              <div className="mt-2 text-xs text-white/50">
                Votes: {data.votedPlayers}/{data.eligibleVoters} • Remaining: {data.remainingVotes}
              </div>
            </div>
          ) : (
            <>
              <ResultBoard techVotes={data.techVotes} />

              {topData ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-medium uppercase tracking-wide text-white/50">Top 5 Winners (Reveal)</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="text-white/70">#5 → #1</Badge>
                      <Button
                        onClick={revealNext}
                        variant="secondary"
                        size="sm"
                        disabled={!winnersToReveal || revealCount >= winnersToReveal || revealOpen}
                      >
                        {typeof nextRankToReveal === "number" ? `Reveal #${nextRankToReveal}` : "Reveal"}
                      </Button>
                      <Button onClick={resetReveal} variant="ghost" size="sm" disabled={!revealCount}>
                        Reset
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {revealedWinners.map((w) => (
                      <div key={w.userId} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-white">
                            #{w.rank} {w.name ?? "—"}
                          </div>
                          <Badge className="text-white/70">{w.votesForTech} votes</Badge>
                        </div>
                        <div className="mt-1 text-xs text-white/60">{w.department ?? "—"}</div>
                        <div className="mt-1 text-xs text-white/55">Student ID: {w.studentId ?? "—"}</div>
                        <div className="mt-2 text-xs text-white/55">
                          {w.tech ?? "—"} • Quiz score: {w.score} • Completion:{" "}
                          {typeof w.completionSeconds === "number" ? `${w.completionSeconds}s` : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Link
              href="/ppt"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
            >
              Back to PPT
            </Link>
            {data?.open ? null : (
              <Link
                href="/game"
                onClick={() => resetGameStorage()}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
              >
                Restart Game
              </Link>
            )}
          </div>
        </div>
      </SectionWrapper>

      <Modal
        open={revealOpen}
        onClose={() => setRevealOpen(false)}
        title="Winner Reveal"
        containerClassName="max-w-none px-0"
        className="h-[calc(100vh-2rem)] w-full rounded-none border-0 bg-bg/80 p-6 shadow-none backdrop-blur-2xl sm:h-[calc(100vh-3rem)] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl"
      >
        {revealWinner ? (
          <motion.div
            key={revealWinner.userId}
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6"
          >
            <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-sky-500/20 p-8 shadow-glow backdrop-blur-xl">
              <div className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">Winner Reveal</div>
              <div className="mt-3 text-6xl font-semibold text-white sm:text-7xl">#{revealWinner.rank}</div>
              <div className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{revealWinner.name ?? "—"}</div>
              <div className="mt-2 text-sm text-white/70">{revealWinner.department ?? "—"}</div>
              <div className="mt-2 text-sm text-white/60">Student ID: {revealWinner.studentId ?? "—"}</div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <Badge className="text-white/75">{revealWinner.tech ?? "—"}</Badge>
                <Badge className="text-white/75">{revealWinner.votesForTech} votes</Badge>
                <Badge className="text-white/75">Quiz score: {revealWinner.score}</Badge>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
                <Button onClick={() => setRevealOpen(false)} variant="primary" className="justify-center">
                  Continue
                </Button>
                <Button onClick={resetReveal} variant="secondary" className="justify-center">
                  Reset reveal
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-sm text-white/70">No winner to reveal.</div>
        )}
      </Modal>
    </main>
  );
}
