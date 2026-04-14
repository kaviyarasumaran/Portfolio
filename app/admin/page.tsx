"use client";

import * as React from "react";

import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/admin-api";

const PASS_KEY = "challenge_admin_password";

export default function AdminPage() {
  const [hydrated, setHydrated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof adminApi.topWinners>> | null>(null);
  const [revealCount, setRevealCount] = React.useState(0);

  React.useEffect(() => {
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem(PASS_KEY) : null;
    if (stored) setPassword(stored);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!data?.winners?.length) {
      setRevealCount(0);
      return;
    }

    setRevealCount(0);
    const winnersToReveal = Math.min(5, data.winners.length);
    const timeouts: number[] = [];
    for (let i = 0; i < winnersToReveal; i++) {
      timeouts.push(
        window.setTimeout(() => {
          setRevealCount((prev) => Math.max(prev, i + 1));
        }, 700 * (i + 1))
      );
    }
    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [data]);

  async function loadWinners(nextPassword: string) {
    setError(null);
    setLoading(true);
    setRevealCount(0);
    try {
      const res = await adminApi.topWinners(nextPassword, 5);
      setData(res);
      if (typeof window !== "undefined") window.sessionStorage.setItem(PASS_KEY, nextPassword);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Failed to load winners");
      if (typeof window !== "undefined") window.sessionStorage.removeItem(PASS_KEY);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    const next = password.trim();
    if (!next) return;
    setError(null);
    setLoading(true);
    try {
      await adminApi.login(next);
      await loadWinners(next);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function setup() {
    const next = password.trim();
    if (!next) return;
    setError(null);
    setLoading(true);
    try {
      await adminApi.setup(next);
      await loadWinners(next);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Setup failed");
      if (typeof window !== "undefined") window.sessionStorage.removeItem(PASS_KEY);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (!hydrated) return;
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem(PASS_KEY) : null;
    if (stored) loadWinners(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <main className="relative">
      <SectionWrapper id="admin" eyebrow="Admin" title="Top 5 Winners" className="pt-10">
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
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button onClick={login} variant="primary" disabled={loading || !password.trim()} className="w-full justify-center sm:w-auto">
                  {loading ? "Loading…" : "Login"}
                </Button>
                <Button onClick={setup} variant="secondary" disabled={loading || !password.trim()} className="w-full justify-center sm:w-auto">
                  Create
                </Button>
              </div>
            </div>
          </div>

          {!data ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              {loading ? "Loading winners…" : "Login to view the winners."}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    Voting open: <span className="text-white">{data.open ? "Yes" : "No (live ranking)"}</span>
                  </div>
                  <Badge className="text-white/70">Rank 1 → 5</Badge>
                </div>
                <div className="mt-3 text-xs text-white/55">{data.calculation}</div>
                <div className="mt-3 text-xs text-white/55">
                  Reveal: #{Math.max(0, 6 - revealCount)} → #1
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">Winners</div>
                <div className="mt-4 grid gap-2">
                  {[...data.winners]
                    .slice()
                    .sort((a, b) => a.rank - b.rank)
                    .reverse()
                    .slice(0, revealCount)
                    .map((w) => (
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
            </>
          )}
        </div>
      </SectionWrapper>
    </main>
  );
}
