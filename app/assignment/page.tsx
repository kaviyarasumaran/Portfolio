"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/game-api";
import {
  getCurrentRound,
  getStudentProfile,
  getUserId,
  getUserTech,
  setCurrentRound,
  setStudentProfile,
  setUserId as setStoredUserId,
  setUserLetter,
  setUserTech
} from "@/lib/game-storage";

export default function AssignmentPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [referralSubmitted, setReferralSubmitted] = React.useState(false);
  const [nextRound, setNextRound] = React.useState<number | null>(null);
  const [peer, setPeer] = React.useState<{ userId: string; name: string; department: string } | null>(null);

  const [round, setRound] = React.useState(1);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [myTech, setMyTech] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(getUserId());
    setRound(getCurrentRound());
    setMyTech(getUserTech());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    let active = true;
    async function load() {
      if (!hydrated) return;
      if (!userId) {
        router.push("/game");
        return;
      }
      setError(null);
      setLoading(true);
      setReferralSubmitted(false);
      setNextRound(null);
      try {
        let effectiveUserId = userId;
        const profile = getStudentProfile();
        if (profile) {
          const reg = await api.register(profile);
          if (!active) return;
          setStudentProfile(profile);
          setStoredUserId(reg.userId);
          setUserId(reg.userId);
          setUserLetter(reg.letter);
          setUserTech(reg.tech);
          setCurrentRound(reg.currentRound);
          effectiveUserId = reg.userId;

          if (reg.nextStep === "quiz") {
            router.push("/quiz");
            return;
          }
          if (reg.nextStep === "vote") {
            router.push("/vote");
            return;
          }
          if (reg.nextStep === "results") {
            router.push("/vote");
            return;
          }

          if (reg.currentRound !== round) {
            setRound(reg.currentRound);
            return;
          }
        }

        const [res, referral] = await Promise.all([
          api.assignment({ userId: effectiveUserId, round }),
          api.referralSubmission({ userId: effectiveUserId, round })
        ]);
        if (!active) return;
        setPeer(res.peer);
        setMyTech(res.userTech);
        if (referral.submitted) {
          setReferralSubmitted(true);
          if (referral.linkedinUrl) setLinkedinUrl(referral.linkedinUrl);
          setNextRound(round + 1);
        }
      } catch (e) {
        if (!active) return;
        const err = e as Error & { code?: string };
        if (err?.code === "ROUND_LOCKED") {
          router.push("/quiz");
          return;
        }
        setError(e instanceof Error ? e.message : "Failed to load assignment");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [hydrated, round, router, userId]);

  async function submit() {
    if (!userId) return;
    setError(null);
    if (!linkedinUrl.trim()) {
      setError("Enter the LinkedIn URL of your assigned peer.");
      return;
    }
    setSubmitting(true);
    try {
      const trimmed = linkedinUrl.trim();
      const res = await api.submitReferral({ userId, round, linkedinUrl: trimmed });
      setLinkedinUrl(trimmed);
      setReferralSubmitted(true);
      setNextRound(res.nextRound);
      setCurrentRound(res.nextRound);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative">
      <SectionWrapper
        id="assignment"
        eyebrow={`Round ${round} — Peer Assignment`}
        title="Submit your peer’s LinkedIn URL"
        className="pt-10"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          {hydrated && myTech ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
              <div className="text-sm text-white/70">
                Your tech <span className="text-white/35">•</span>
              </div>
              <Badge className="border-white/15 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-sky-500/20 text-white/85">
                {myTech}
              </Badge>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
          ) : null}

          {!hydrated || loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              Loading peer assignment…
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70 backdrop-blur-xl">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">Assigned peer</div>
                <div className="mt-2 text-base font-semibold text-white">{peer?.name ?? "—"}</div>
                <div className="mt-1 text-sm text-white/65">{peer?.department ?? "—"}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <div className="text-xs font-medium uppercase tracking-wide text-white/50">Step</div>
                <div className="mt-2 text-sm text-white/70">Enter the LinkedIn URL of the assigned peer and submit.</div>
                <input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/..."
                  disabled={referralSubmitted}
                  className="mt-4 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30 disabled:cursor-not-allowed disabled:opacity-70"
                />
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={submit}
                    variant="primary"
                    disabled={submitting || referralSubmitted}
                    className="w-full justify-center"
                  >
                    {referralSubmitted ? "Referral submitted" : submitting ? "Submitting…" : "Submit referral"}
                  </Button>
                  <Button
                    onClick={() => {
                      const target = (nextRound ?? round + 1) < 4 ? "/quiz" : "/vote";
                      router.push(target);
                    }}
                    variant="secondary"
                    disabled={!referralSubmitted}
                    className="w-full justify-center"
                  >
                    Continue
                  </Button>
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Next round unlocks only after successful referral submission.
                </div>
              </div>
            </>
          )}
        </div>
      </SectionWrapper>
    </main>
  );
}
