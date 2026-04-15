const API_BASE = "https://homoeomorphic-especially-felecia.ngrok-free.dev/api/game";

async function request<T>(path: string, init?: RequestInit, adminPassword?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(adminPassword ? { "x-admin-password": adminPassword } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    let body: any = "Request failed";
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    const message =
      typeof body === "string"
        ? body
        : typeof body?.detail === "string"
          ? body.detail
          : body?.detail?.detail ?? "Request failed";
    const error = new Error(message) as Error & { status?: number; raw?: unknown };
    error.status = res.status;
    error.raw = body;
    throw error;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type AdminWinnerRow = {
  rank: number;
  userId: string;
  name: string | null;
  department: string | null;
  studentId: string | null;
  tech: string | null;
  score: number;
  votesForTech: number;
  completionSeconds: number | null;
};

export type AdminTopWinnersResponse = {
  open: boolean;
  calculation: string;
  winners: AdminWinnerRow[];
};

export type AdminResultsResponse = {
  open: boolean;
  eligibleVoters: number;
  votedPlayers: number;
  remainingVotes: number;
  techVotes: Record<string, number>;
  winnerTech: string | null;
  winners: {
    userId: string;
    name: string | null;
    department: string | null;
    studentId: string | null;
    letter: string | null;
    tech: string | null;
    score: number | null;
  }[];
};

export const adminApi = {
  login: (password: string) => request<{ ok: true }>("/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  setup: (password: string) => request<{ ok: true }>("/admin/setup", { method: "POST", body: JSON.stringify({ password }) }),
  topWinners: (password: string, limit = 5) => request<AdminTopWinnersResponse>(`/admin/top-winners?limit=${limit}`, undefined, password),
  results: (password: string) => request<AdminResultsResponse>("/admin/results", undefined, password)
};
