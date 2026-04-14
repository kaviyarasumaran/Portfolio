from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Literal


class RegisterResponse(BaseModel):
    userId: str
    letter: str
    tech: str
    currentRound: int
    nextStep: Literal["quiz", "assignment", "vote", "results"]


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    department: str = Field(min_length=1, max_length=80)
    studentId: str = Field(min_length=1, max_length=40)


class QuestionsResponse(BaseModel):
    round: int
    questions: list[dict]


class SubmitQuizRequest(BaseModel):
    userId: str
    round: int = Field(ge=1, le=3)
    answers: list[str] = Field(min_length=5, max_length=5)


class SubmitQuizResponse(BaseModel):
    round: int
    roundScore: int
    totalScore: int
    referralRequired: bool


class QuizSubmissionResponse(BaseModel):
    round: int
    submitted: bool
    answers: list[str] | None = None


class ReferralSubmissionResponse(BaseModel):
    round: int
    submitted: bool
    linkedinUrl: str | None = None


class AssignmentResponse(BaseModel):
    round: int
    userTech: str
    peer: dict


class SubmitReferralRequest(BaseModel):
    userId: str
    round: int = Field(ge=1, le=3)
    linkedinUrl: str = Field(min_length=10, max_length=300)


class VoteRequest(BaseModel):
    userId: str
    tech: str


class VoteCandidate(BaseModel):
    tech: str
    score: int


class VoteStateResponse(BaseModel):
    open: bool
    totalPlayers: int
    completedPlayers: int
    remainingPlayers: int
    candidates: list[VoteCandidate]
    userHasVoted: bool


class WinnerUser(BaseModel):
    userId: str
    name: str | None = None
    department: str | None = None
    studentId: str | None = None
    letter: str | None = None
    tech: str | None = None
    score: int | None = None


class ResultsResponse(BaseModel):
    open: bool
    eligibleVoters: int
    votedPlayers: int
    remainingVotes: int
    techVotes: dict[str, int]
    winnerTech: str | None
    winners: list[WinnerUser]


class AdminLoginRequest(BaseModel):
    password: str = Field(min_length=1, max_length=200)


class AdminSetupRequest(BaseModel):
    password: str = Field(min_length=6, max_length=200)


class AdminWinnerRow(BaseModel):
    rank: int
    userId: str
    name: str | None = None
    department: str | None = None
    studentId: str | None = None
    tech: str | None = None
    score: int
    votesForTech: int
    completionSeconds: int | None = None


class AdminTopWinnersResponse(BaseModel):
    open: bool
    calculation: str
    winners: list[AdminWinnerRow]


class ErrorResponse(BaseModel):
    detail: str
    code: Literal[
        "NOT_FOUND",
        "VALIDATION_ERROR",
        "ROUND_LOCKED",
        "REFERRAL_REQUIRED",
        "ALREADY_VOTED",
        "CANNOT_VOTE_OWN_TECH",
        "NO_TECH_LEFT",
        "NO_LETTER_LEFT",
    ]
