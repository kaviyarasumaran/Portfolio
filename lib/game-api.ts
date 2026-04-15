// Backend base URL (hardcoded as requested).
// NOTE: This requires the backend to allow your frontend origin via CORS (e.g. Vercel URL).
const API_BASE = "https://homoeomorphic-especially-felecia.ngrok-free.dev";

type ApiError = { code?: string; detail?: string } | { detail?: string } | string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const hasBody = init?.body != null;
  if (hasBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (API_BASE.includes("ngrok-free.dev") && !headers.has("ngrok-skip-browser-warning")) {
    headers.set("ngrok-skip-browser-warning", "true");
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let body: ApiError = "Request failed";
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    const message =
      typeof body === "string"
        ? body
        : typeof (body as any)?.detail === "string"
          ? (body as any).detail
          : (body as any)?.detail?.detail ?? "Request failed";
    const error = new Error(message) as Error & { code?: string; status?: number; raw?: unknown };
    error.status = res.status;
    error.raw = body;
    error.code = (body as any)?.detail?.code ?? (body as any)?.code;
    throw error;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type RegisterResponse = {
  userId: string;
  letter: string;
  tech: string;
  currentRound: number;
  nextStep: "quiz" | "assignment" | "vote" | "results";
};
export type Question = { question: string; options: string[] };
export type QuestionsResponse = { round: number; questions: Question[] };
export type SubmitQuizResponse = { round: number; roundScore: number; totalScore: number; referralRequired: boolean };
export type QuizSubmissionResponse = { round: number; submitted: boolean; answers: string[] | null };
export type ReferralSubmissionResponse = { round: number; submitted: boolean; linkedinUrl: string | null };
export type VoteCandidate = { tech: string; score: number };
export type VoteStateResponse = {
  open: boolean;
  totalPlayers: number;
  completedPlayers: number;
  remainingPlayers: number;
  candidates: VoteCandidate[];
  userHasVoted: boolean;
};
export type WinnerUser = {
  userId: string;
  name: string | null;
  department: string | null;
  studentId: string | null;
  letter: string | null;
  tech: string | null;
  score: number | null;
};
export type ResultsResponse = {
  open: boolean;
  eligibleVoters: number;
  votedPlayers: number;
  remainingVotes: number;
  techVotes: Record<string, number>;
  winnerTech: string | null;
  winners: WinnerUser[];
};

export const api = {
  register: (payload: { name: string; department: string; studentId: string }) =>
    request<RegisterResponse>("/register", { method: "POST", body: JSON.stringify(payload) }),
  questions: (round: number) => request<QuestionsResponse>(`/questions?round=${round}`),
  submitQuiz: (payload: { userId: string; round: number; answers: string[] }) =>
    request<SubmitQuizResponse>("/submit-quiz", { method: "POST", body: JSON.stringify(payload) }),
  quizSubmission: (payload: { userId: string; round: number }) =>
    request<QuizSubmissionResponse>(`/quiz-submission?userId=${encodeURIComponent(payload.userId)}&round=${payload.round}`),
  referralSubmission: (payload: { userId: string; round: number }) =>
    request<ReferralSubmissionResponse>(
      `/referral-submission?userId=${encodeURIComponent(payload.userId)}&round=${payload.round}`
    ),
  voteState: (payload: { userId: string }) =>
    request<VoteStateResponse>(`/vote-state?userId=${encodeURIComponent(payload.userId)}`),
  assignment: (payload: { userId: string; round: number }) =>
    request<{ round: number; userTech: string; peer: { userId: string; name: string; department: string } }>(
      `/assignment?userId=${encodeURIComponent(payload.userId)}&round=${payload.round}`
    ),
  submitReferral: (payload: { userId: string; round: number; linkedinUrl: string }) =>
    request<{ ok: true; nextRound: number }>("/submit-referral", { method: "POST", body: JSON.stringify(payload) }),
  vote: (payload: { userId: string; tech: string }) => request<{ ok: true }>("/vote", { method: "POST", body: JSON.stringify(payload) }),
  results: () => request<ResultsResponse>("/results")
};
