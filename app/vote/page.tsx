"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { VoteList } from "@/components/game/VoteList";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/game-api";
import { getUserId, getUserTech } from "@/lib/game-storage";

export default function VotePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [techs, setTechs] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [openVoting, setOpenVoting] = React.useState(false);
  const [remainingPlayers, setRemainingPlayers] = React.useState<number | null>(null);
  const [completedPlayers, setCompletedPlayers] = React.useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = React.useState<number | null>(null);
  const [alreadyVoted, setAlreadyVoted] = React.useState(false);

  const [hydrated, setHydrated] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [myTech, setMyTech] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(getUserId());
    setMyTech(getUserTech());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    let active = true;
    let timer: number | null = null;

    async function load() {
      if (!hydrated) return;
      if (!userId) {
        router.push("/game");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const res = await api.voteState({ userId });
        if (!active) return;
        setOpenVoting(res.open);
        setRemainingPlayers(res.remainingPlayers);
        setCompletedPlayers(res.completedPlayers);
        setTotalPlayers(res.totalPlayers);

        if (res.userHasVoted) {
          setAlreadyVoted(true);
          return;
        }
        setAlreadyVoted(false);

        if (res.open) {
          const list = (res.candidates ?? []).map((c) => c.tech);
          setTechs(list.filter((t) => t && t !== myTech));
        } else {
          setTechs([]);
        }
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load tech list");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    timer = window.setInterval(load, 3000);
    return () => {
      active = false;
      if (timer) window.clearInterval(timer);
    };
  }, [hydrated, myTech, router, userId]);

  async function submit() {
    if (!userId) return;
    if (!openVoting) {
      setError("Voting is not open yet.");
      return;
    }
    if (!selected) {
      setError("Select a tech to vote.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await api.vote({ userId, tech: selected });
      setAlreadyVoted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Vote failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative">
      <SectionWrapper
        id="vote"
        eyebrow="Voting"
        title="Vote for a tech (one vote only)"
        subtitle={
          hydrated && myTech
            ? openVoting
              ? `Top 5 techs by quiz score. You cannot vote for your own: ${myTech}`
              : `Waiting for all players to finish. You cannot vote for your own: ${myTech}`
            : undefined
        }
        className="pt-10"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
          ) : null}

          {!hydrated || loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              Loading techs…
            </div>
          ) : alreadyVoted ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              Thanks! Your vote is submitted.
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/ppt"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
                >
                  Back to PPT
                </Link>
                <Link
                  href="/game"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 active:scale-[.98]"
                >
                  Play again
                </Link>
              </div>
              <div className="mt-3 text-xs text-white/50">Results are visible to admins only.</div>
            </div>
          ) : !openVoting ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              Waiting for players to complete all 3 rounds…
              {typeof completedPlayers === "number" && typeof totalPlayers === "number" ? (
                <div className="mt-2 text-xs text-white/50">
                  Completed: {completedPlayers}/{totalPlayers}
                  {typeof remainingPlayers === "number" ? ` • Remaining: ${remainingPlayers}` : null}
                </div>
              ) : null}
              <div className="mt-2 text-xs text-white/50">This page auto-refreshes every 3 seconds.</div>
            </div>
          ) : (
            <>
              <VoteList techs={techs} value={selected} onChange={setSelected} />
              <div className="pt-2">
                <Button onClick={submit} variant="primary" disabled={submitting} className="w-full justify-center">
                  {submitting ? "Submitting…" : "Submit vote"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SectionWrapper>
    </main>
  );
}
