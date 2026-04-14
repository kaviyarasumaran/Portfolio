"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { QuestionCard } from "@/components/game/QuestionCard";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/game-api";
import {
  clearQuizDraftAnswers,
  getCurrentRound,
  getQuizDraftAnswers,
  getUserId,
  getUserTech,
  setCurrentRound,
  setQuizDraftAnswers
} from "@/lib/game-storage";

export default function QuizPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = React.useState(false);
  const [questions, setQuestions] = React.useState<{ question: string; options: string[] }[]>([]);
  const [answers, setAnswers] = React.useState<(string | null)[]>([null, null, null, null, null]);

  const [hydrated, setHydrated] = React.useState(false);
  const [round, setRound] = React.useState(1);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userTech, setUserTech] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(getUserId());
    setRound(getCurrentRound());
    setUserTech(getUserTech());
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
      setAlreadySubmitted(false);
      try {
        const [res, submission] = await Promise.all([
          api.questions(round),
          api.quizSubmission({ userId, round })
        ]);
        if (!active) return;
        setQuestions(res.questions);
        if (submission.submitted && submission.answers) {
          const normalized = submission.answers.slice(0, 5).map((a) => (a ? a : null));
          while (normalized.length < 5) normalized.push(null);
          setAnswers(normalized);
          setAlreadySubmitted(true);
          clearQuizDraftAnswers(userId, round);
        } else {
          const draft = getQuizDraftAnswers(userId, round);
          setAnswers(draft ?? [null, null, null, null, null]);
        }
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load questions");
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
    if (alreadySubmitted) {
      router.push("/assignment");
      return;
    }
    if (answers.some((a) => !a)) {
      setError("Answer all 5 questions to continue.");
      return;
    }
    setSubmitting(true);
    try {
      await api.submitQuiz({ userId, round, answers: answers as string[] });
      clearQuizDraftAnswers(userId, round);
      router.push("/assignment");
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err?.code === "REFERRAL_REQUIRED") {
        clearQuizDraftAnswers(userId, round);
        router.push("/assignment");
        return;
      }
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  function setAnswerAt(index: number, next: string) {
    if (!userId) return;
    if (alreadySubmitted) return;
    setAnswers((prev) => {
      const updated = prev.map((p, i) => (i === index ? next : p));
      setQuizDraftAnswers(userId, round, updated);
      return updated;
    });
  }

  return (
    <main className="relative">
      <SectionWrapper
        id="quiz"
        eyebrow={`Round ${round} / 3`}
        title="Quiz"
        className="pt-10"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {hydrated && userTech ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
              <div className="text-sm text-white/70">
                Assigned tech <span className="text-white/35">•</span>
              </div>
              <Badge className="border-white/15 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-sky-500/20 text-white/85">
                {userTech}
              </Badge>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
          ) : null}
          {alreadySubmitted ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              You already submitted this round. Your answers are shown below.
            </div>
          ) : null}

          {!hydrated || loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70 backdrop-blur-xl">
              Loading questions…
            </div>
          ) : (
            <>
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.question}
                  index={idx}
                  question={q.question}
                  options={q.options}
                  value={answers[idx] ?? null}
                  onChange={(next) => setAnswerAt(idx, next)}
                  disabled={alreadySubmitted}
                />
              ))}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrentRound(1);
                    setRound(1);
                    router.push("/game");
                  }}
                >
                  Restart
                </Button>
                <Button variant="primary" onClick={submit} disabled={submitting} className="justify-center">
                  {alreadySubmitted ? "Go to referral" : submitting ? "Submitting…" : "Submit quiz"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SectionWrapper>
    </main>
  );
}
