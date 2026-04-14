const USER_ID_KEY = "challenge_userId";
const ROUND_KEY = "challenge_currentRound";
const TECH_KEY = "challenge_userTech";
const LETTER_KEY = "challenge_userLetter";
const QUIZ_DRAFT_PREFIX = "challenge_quizDraft";
const STUDENT_ID_KEY = "challenge_studentId";
const NAME_KEY = "challenge_name";
const DEPT_KEY = "challenge_department";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUserId() {
  return isBrowser() ? window.localStorage.getItem(USER_ID_KEY) : null;
}

export function setUserId(userId: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USER_ID_KEY, userId);
}

export function getCurrentRound() {
  if (!isBrowser()) return 1;
  const raw = window.localStorage.getItem(ROUND_KEY);
  const value = raw ? Number(raw) : 1;
  return Number.isFinite(value) && value >= 1 ? value : 1;
}

export function setCurrentRound(round: number) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ROUND_KEY, String(round));
}

export function getUserTech() {
  return isBrowser() ? window.localStorage.getItem(TECH_KEY) : null;
}

export function setUserTech(tech: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TECH_KEY, tech);
}

export function getUserLetter() {
  return isBrowser() ? window.localStorage.getItem(LETTER_KEY) : null;
}

export function setUserLetter(letter: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LETTER_KEY, letter);
}

export function resetGameStorage() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_ID_KEY);
  window.localStorage.removeItem(ROUND_KEY);
  window.localStorage.removeItem(TECH_KEY);
  window.localStorage.removeItem(LETTER_KEY);
  window.localStorage.removeItem(STUDENT_ID_KEY);
  window.localStorage.removeItem(NAME_KEY);
  window.localStorage.removeItem(DEPT_KEY);
}

function quizDraftKey(userId: string, round: number) {
  return `${QUIZ_DRAFT_PREFIX}:${userId}:${round}`;
}

export function getQuizDraftAnswers(userId: string, round: number) {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(quizDraftKey(userId, round));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized = parsed.slice(0, 5).map((v) => (typeof v === "string" && v ? v : null));
    while (normalized.length < 5) normalized.push(null);
    return normalized as (string | null)[];
  } catch {
    return null;
  }
}

export function setQuizDraftAnswers(userId: string, round: number, answers: (string | null)[]) {
  if (!isBrowser()) return;
  const normalized = answers.slice(0, 5).map((v) => (typeof v === "string" && v ? v : null));
  while (normalized.length < 5) normalized.push(null);
  window.localStorage.setItem(quizDraftKey(userId, round), JSON.stringify(normalized));
}

export function clearQuizDraftAnswers(userId: string, round: number) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(quizDraftKey(userId, round));
}

export function setStudentProfile(payload: { studentId: string; name: string; department: string }) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STUDENT_ID_KEY, payload.studentId);
  window.localStorage.setItem(NAME_KEY, payload.name);
  window.localStorage.setItem(DEPT_KEY, payload.department);
}

export function getStudentProfile() {
  if (!isBrowser()) return null;
  const studentId = window.localStorage.getItem(STUDENT_ID_KEY);
  const name = window.localStorage.getItem(NAME_KEY);
  const department = window.localStorage.getItem(DEPT_KEY);
  if (!studentId || !name || !department) return null;
  return { studentId, name, department };
}
