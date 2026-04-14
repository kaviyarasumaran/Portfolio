from __future__ import annotations

import base64
from datetime import datetime, timezone
import hashlib
import hmac
import os
import re
import uuid
from typing import Any

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import DuplicateKeyError

from .config import ADMIN_PASSWORD, CORS_ORIGIN_REGEX, CORS_ORIGINS
from .data import LETTERS, QUESTIONS, TECH_LIST, pick_random
from .db import assignments, meta, quiz_submissions, referrals, users, votes
from .models import (
    AdminLoginRequest,
    AdminSetupRequest,
    AdminTopWinnersResponse,
    AdminWinnerRow,
    AssignmentResponse,
    QuizSubmissionResponse,
    ReferralSubmissionResponse,
    RegisterRequest,
    QuestionsResponse,
    RegisterResponse,
    ResultsResponse,
    SubmitQuizRequest,
    SubmitQuizResponse,
    SubmitReferralRequest,
    VoteCandidate,
    VoteRequest,
    VoteStateResponse,
    WinnerUser,
)

app = FastAPI(title="Challenge Game API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_origin_regex=CORS_ORIGIN_REGEX or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LINKEDIN_RX = re.compile(r"^https?://(www\.)?linkedin\.com/.*", re.IGNORECASE)
ADMIN_META_KEY = "admin_auth"
PBKDF2_ITERATIONS = 310_000


@app.on_event("startup")
async def _startup() -> None:
    await meta.create_index("key", unique=True)
    await users.create_index("studentId", unique=True)
    await users.create_index("letter", unique=True)
    await users.create_index("tech", unique=True)
    await assignments.create_index([("userId", 1), ("round", 1)], unique=True)
    await referrals.create_index([("userId", 1), ("round", 1)], unique=True)
    await quiz_submissions.create_index([("userId", 1), ("round", 1)], unique=True)
    await votes.create_index("userId", unique=True)


def _error(code: str, detail: str) -> HTTPException:
    return HTTPException(status_code=400, detail={"code": code, "detail": detail})


async def _get_user_or_404(user_id: str) -> dict[str, Any]:
    doc = await users.find_one({"_id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "detail": "User not found"})
    return doc


async def _ensure_assignment(user: dict[str, Any], round: int) -> str:
    existing_assignment = await assignments.find_one({"userId": user["_id"], "round": round})
    if existing_assignment and existing_assignment.get("assignedPeerId"):
        return str(existing_assignment["assignedPeerId"])

    # Prefer not repeating the same peer across rounds for the same user (when possible).
    already_assigned = set(await assignments.distinct("assignedPeerId", {"userId": user["_id"]}))

    base_filter: dict[str, Any] = {
        "_id": {"$ne": user["_id"]},
        "name": {"$exists": True},
        "department": {"$exists": True},
        "studentId": {"$exists": True},
    }

    candidates = await users.find(
        {**base_filter, "_id": {"$ne": user["_id"], "$nin": list(already_assigned)}},
        {"_id": 1},
    ).to_list(length=5000)

    # If it's impossible to avoid repeats (e.g. only 2 users total), fall back to any other user.
    if not candidates:
        candidates = await users.find(base_filter, {"_id": 1}).to_list(length=5000)

    if not candidates:
        raise _error("VALIDATION_ERROR", "Not enough registered users to assign a peer")

    peer_id = pick_random([str(o["_id"]) for o in candidates])

    try:
        await assignments.insert_one({"userId": user["_id"], "round": round, "assignedPeerId": peer_id})
    except DuplicateKeyError:
        # Race condition: another request inserted assignment first. Prefer DB value.
        current = await assignments.find_one({"userId": user["_id"], "round": round})
        if current and current.get("assignedPeerId"):
            return str(current["assignedPeerId"])

    return peer_id


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _b64encode_raw(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def _b64decode_raw(data: str) -> bytes:
    return base64.b64decode(data.encode("ascii"))


def _pbkdf2(password: str, salt: bytes, iterations: int) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)


async def _get_admin_auth_doc() -> dict[str, Any] | None:
    doc = await meta.find_one({"key": ADMIN_META_KEY})
    return doc if isinstance(doc, dict) else None


async def _admin_configured() -> bool:
    if ADMIN_PASSWORD:
        return True
    return (await _get_admin_auth_doc()) is not None


async def _check_admin_password(provided: str) -> bool:
    if not provided:
        return False
    if ADMIN_PASSWORD:
        return provided == ADMIN_PASSWORD

    doc = await _get_admin_auth_doc()
    if not doc:
        return False

    salt_b64 = doc.get("salt")
    hash_b64 = doc.get("hash")
    iterations = int(doc.get("iterations", PBKDF2_ITERATIONS))
    if not isinstance(salt_b64, str) or not isinstance(hash_b64, str) or iterations <= 0:
        return False

    try:
        salt = _b64decode_raw(salt_b64)
        expected = _b64decode_raw(hash_b64)
    except Exception:
        return False

    computed = _pbkdf2(provided, salt, iterations)
    return hmac.compare_digest(computed, expected)


async def _require_admin(request: Request) -> None:
    if not await _admin_configured():
        raise HTTPException(status_code=503, detail={"code": "VALIDATION_ERROR", "detail": "Admin password is not configured"})
    provided = request.headers.get("x-admin-password") or ""
    if not await _check_admin_password(provided):
        raise HTTPException(status_code=401, detail={"code": "VALIDATION_ERROR", "detail": "Unauthorized"})


async def _is_admin_request(request: Request) -> bool:
    provided = request.headers.get("x-admin-password") or ""
    return await _check_admin_password(provided)


def _is_completed(user: dict[str, Any]) -> bool:
    return int(user.get("currentRound", 1)) >= 4 and user.get("awaitingReferralRound") is None


async def _get_vote_state(user: dict[str, Any]) -> tuple[bool, int, int]:
    total_players = await users.count_documents({})
    completed_players = await users.count_documents({"currentRound": {"$gte": 4}, "awaitingReferralRound": None})
    open_voting = total_players > 0 and completed_players == total_players
    return open_voting, int(total_players), int(completed_players)


async def _get_vote_candidates() -> list[VoteCandidate]:
    # Top 5 techs by quiz score (each tech is unique per user in this app).
    cursor = users.find({}, {"tech": 1, "score": 1}).sort([("score", -1), ("tech", 1)]).limit(5)
    candidates: list[VoteCandidate] = []
    async for u in cursor:
        tech = u.get("tech")
        if not isinstance(tech, str) or not tech:
            continue
        candidates.append(VoteCandidate(tech=tech, score=int(u.get("score", 0))))
    return candidates


@app.post("/register", response_model=RegisterResponse)
async def register(payload: RegisterRequest) -> RegisterResponse:
    student_id = payload.studentId.strip()
    existing = await users.find_one({"studentId": student_id})
    if existing:
        # Keep existing user up-to-date with the latest profile fields.
        created_at = existing.get("createdAt")
        if created_at is None:
            await users.update_one({"_id": existing["_id"]}, {"$set": {"createdAt": _now()}})
        if _is_completed(existing) and existing.get("completedAt") is None:
            await users.update_one({"_id": existing["_id"]}, {"$set": {"completedAt": _now()}})
        await users.update_one(
            {"_id": existing["_id"]},
            {"$set": {"name": payload.name.strip(), "department": payload.department.strip()}},
        )
        current_round = int(existing.get("currentRound", 1))
        awaiting = existing.get("awaitingReferralRound")
        has_voted = bool(existing.get("hasVoted", False))
        if has_voted:
            # Results are admin-only; keep users on the voting page after they have voted.
            next_step = "vote"
        elif current_round >= 4:
            next_step = "vote"
        elif awaiting == current_round:
            next_step = "assignment"
        else:
            next_step = "quiz"

        return RegisterResponse(
            userId=str(existing["_id"]),
            letter=str(existing.get("letter")),
            tech=str(existing.get("tech")),
            currentRound=current_round,
            nextStep=next_step,  # type: ignore[arg-type]
        )

    for _ in range(60):
        user_id = str(uuid.uuid4())

        used_letters = set(await users.distinct("letter"))
        remaining_letters = [l for l in LETTERS if l not in used_letters]
        if not remaining_letters:
            raise HTTPException(status_code=409, detail={"code": "NO_LETTER_LEFT", "detail": "No letters left (A–Z exhausted)"})

        used_tech = set(await users.distinct("tech"))
        remaining_tech = [t for t in TECH_LIST if t not in used_tech]
        if not remaining_tech:
            raise HTTPException(status_code=409, detail={"code": "NO_TECH_LEFT", "detail": "No tech left (100 exhausted)"})

        doc = {
            "_id": user_id,
            "name": payload.name.strip(),
            "department": payload.department.strip(),
            "studentId": student_id,
            "letter": pick_random(remaining_letters),
            "tech": pick_random(remaining_tech),
            "score": 0,
            "currentRound": 1,
            "awaitingReferralRound": None,
            "hasVoted": False,
            "createdAt": _now(),
            "completedAt": None,
        }

        try:
            await users.insert_one(doc)
            await meta.update_one(
                {"key": "used"},
                {"$addToSet": {"usedLetters": doc["letter"], "usedTechs": doc["tech"]}},
                upsert=True,
            )
            return RegisterResponse(userId=user_id, letter=doc["letter"], tech=doc["tech"], currentRound=1, nextStep="quiz")
        except DuplicateKeyError:
            continue

    raise HTTPException(status_code=500, detail={"code": "VALIDATION_ERROR", "detail": "Unable to assign unique studentId/letter/tech"})


@app.get("/questions", response_model=QuestionsResponse)
async def get_questions(round: int = Query(..., ge=1, le=3)) -> QuestionsResponse:
    qs = QUESTIONS.get(round)
    if not qs:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "detail": "Round not found"})
    safe_questions = [{"question": q["question"], "options": q["options"]} for q in qs]
    return QuestionsResponse(round=round, questions=safe_questions)


@app.post("/submit-quiz", response_model=SubmitQuizResponse)
async def submit_quiz(payload: SubmitQuizRequest) -> SubmitQuizResponse:
    user = await _get_user_or_404(payload.userId)

    if user.get("awaitingReferralRound") is not None:
        raise _error("REFERRAL_REQUIRED", "Submit referrals to unlock the next round")

    current_round = int(user.get("currentRound", 1))
    if payload.round != current_round:
        raise _error("ROUND_LOCKED", f"Round {payload.round} is locked; currentRound={current_round}")

    questions = QUESTIONS.get(payload.round, [])
    if len(questions) != 5:
        raise _error("VALIDATION_ERROR", "Invalid question set")

    existing_submission = await quiz_submissions.find_one({"userId": user["_id"], "round": payload.round})
    if existing_submission:
        raise _error("VALIDATION_ERROR", "You have already submitted answers for this round")

    correct = 0
    for q, a in zip(questions, payload.answers, strict=True):
        if a == q["answer"]:
            correct += 1

    new_score = int(user.get("score", 0)) + correct

    try:
        await quiz_submissions.insert_one(
            {"userId": user["_id"], "round": payload.round, "answers": payload.answers, "roundScore": correct}
        )
    except DuplicateKeyError:
        raise _error("VALIDATION_ERROR", "You have already submitted answers for this round")

    await users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"score": new_score, "awaitingReferralRound": payload.round},
        },
    )

    # Ensure peer assignment exists for this round (stable across refresh).
    await _ensure_assignment(user, payload.round)

    return SubmitQuizResponse(round=payload.round, roundScore=correct, totalScore=new_score, referralRequired=True)


@app.get("/quiz-submission", response_model=QuizSubmissionResponse)
async def get_quiz_submission(userId: str, round: int = Query(..., ge=1, le=3)) -> QuizSubmissionResponse:
    user = await _get_user_or_404(userId)
    submission = await quiz_submissions.find_one({"userId": user["_id"], "round": round}, {"answers": 1})
    if not submission:
        return QuizSubmissionResponse(round=round, submitted=False, answers=None)

    answers = submission.get("answers")
    if not isinstance(answers, list):
        return QuizSubmissionResponse(round=round, submitted=True, answers=None)

    safe_answers: list[str] = [str(a) for a in answers][:5]
    while len(safe_answers) < 5:
        safe_answers.append("")

    return QuizSubmissionResponse(round=round, submitted=True, answers=safe_answers)


@app.get("/referral-submission", response_model=ReferralSubmissionResponse)
async def get_referral_submission(userId: str, round: int = Query(..., ge=1, le=3)) -> ReferralSubmissionResponse:
    user = await _get_user_or_404(userId)
    submission = await referrals.find_one({"userId": user["_id"], "round": round}, {"linkedinUrl": 1})
    if not submission:
        return ReferralSubmissionResponse(round=round, submitted=False, linkedinUrl=None)

    url = submission.get("linkedinUrl")
    return ReferralSubmissionResponse(round=round, submitted=True, linkedinUrl=str(url) if url else None)


@app.get("/vote-state", response_model=VoteStateResponse)
async def vote_state(userId: str) -> VoteStateResponse:
    user = await _get_user_or_404(userId)
    open_voting, total_players, completed_players = await _get_vote_state(user)

    candidates: list[VoteCandidate] = []
    if open_voting:
        candidates = await _get_vote_candidates()

    remaining = max(0, total_players - completed_players)
    return VoteStateResponse(
        open=open_voting,
        totalPlayers=total_players,
        completedPlayers=completed_players,
        remainingPlayers=remaining,
        candidates=candidates,
        userHasVoted=bool(user.get("hasVoted", False)),
    )


@app.get("/assignment", response_model=AssignmentResponse)
async def get_assignment(userId: str, round: int = Query(..., ge=1, le=3)) -> AssignmentResponse:
    user = await _get_user_or_404(userId)
    if user.get("awaitingReferralRound") != round:
        raise _error("ROUND_LOCKED", "Assignment is locked for this round")
    peer_id = await _ensure_assignment(user, round)
    peer = await users.find_one({"_id": peer_id}, {"_id": 1, "name": 1, "department": 1})
    if not peer:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "detail": "Peer not found"})
    return AssignmentResponse(
        round=round,
        userTech=str(user.get("tech")),
        peer={
            "userId": str(peer["_id"]),
            "name": (peer.get("name") or f"Student {str(peer['_id'])[:8]}"),
            "department": (peer.get("department") or "—"),
        },
    )


@app.post("/submit-referral")
async def submit_referral(payload: SubmitReferralRequest) -> dict[str, Any]:
    user = await _get_user_or_404(payload.userId)

    awaiting = user.get("awaitingReferralRound")
    if awaiting != payload.round:
        raise _error("ROUND_LOCKED", "Referral is not expected for this round")

    if not LINKEDIN_RX.match(payload.linkedinUrl.strip()):
        raise _error("VALIDATION_ERROR", "LinkedIn URL is invalid")

    a = await assignments.find_one({"userId": user["_id"], "round": payload.round})
    if not a:
        raise _error("VALIDATION_ERROR", "Peer assignment not found for this round")

    try:
        await referrals.insert_one(
            {
                "userId": user["_id"],
                "round": payload.round,
                "referredUserId": a["assignedPeerId"],
                "linkedinUrl": payload.linkedinUrl.strip(),
            }
        )
    except DuplicateKeyError:
        raise _error("VALIDATION_ERROR", "Referral already submitted for this round")

    next_round = payload.round + 1
    if next_round <= 3:
        await users.update_one({"_id": user["_id"]}, {"$set": {"awaitingReferralRound": None, "currentRound": next_round}})
        return {"ok": True, "nextRound": next_round}

    final_set: dict[str, Any] = {"awaitingReferralRound": None, "currentRound": 4}
    if user.get("completedAt") is None:
        final_set["completedAt"] = _now()
    await users.update_one({"_id": user["_id"]}, {"$set": final_set})
    return {"ok": True, "nextRound": 4}


@app.post("/vote")
async def vote(payload: VoteRequest) -> dict[str, Any]:
    user = await _get_user_or_404(payload.userId)

    if user.get("awaitingReferralRound") is not None:
        raise _error("REFERRAL_REQUIRED", "Finish referrals before voting")

    if int(user.get("currentRound", 1)) < 4:
        raise _error("ROUND_LOCKED", "Voting is locked until you finish round 3 referrals")

    if user.get("hasVoted") is True:
        raise _error("ALREADY_VOTED", "You have already voted")

    open_voting, total_players, completed_players = await _get_vote_state(user)
    if not open_voting:
        remaining = max(0, total_players - completed_players)
        raise _error("ROUND_LOCKED", f"Voting is not open yet (waiting for {remaining} player(s) to finish)")

    if payload.tech == user.get("tech"):
        raise _error("CANNOT_VOTE_OWN_TECH", "You cannot vote for your own tech")

    candidates = await _get_vote_candidates()
    allowed = {c.tech for c in candidates}
    if payload.tech not in allowed:
        raise _error("VALIDATION_ERROR", "You can only vote among the top 5 techs by quiz score")

    try:
        await votes.insert_one({"userId": user["_id"], "tech": payload.tech})
    except DuplicateKeyError:
        raise _error("ALREADY_VOTED", "You have already voted")

    await users.update_one({"_id": user["_id"]}, {"$set": {"hasVoted": True}})
    return {"ok": True}


@app.post("/admin/login")
async def admin_login(payload: AdminLoginRequest) -> dict[str, Any]:
    # Allows frontend to validate password without exposing any admin-only data.
    if not await _admin_configured():
        raise HTTPException(status_code=503, detail={"code": "VALIDATION_ERROR", "detail": "Admin password is not configured"})
    if not await _check_admin_password(payload.password):
        raise HTTPException(status_code=401, detail={"code": "VALIDATION_ERROR", "detail": "Unauthorized"})
    return {"ok": True}


@app.post("/admin/setup")
async def admin_setup(payload: AdminSetupRequest) -> dict[str, Any]:
    # One-time setup when ADMIN_PASSWORD env var is not used.
    if ADMIN_PASSWORD:
        raise HTTPException(status_code=409, detail={"code": "VALIDATION_ERROR", "detail": "Admin password is already configured"})
    if await _get_admin_auth_doc():
        raise HTTPException(status_code=409, detail={"code": "VALIDATION_ERROR", "detail": "Admin password is already configured"})

    salt = os.urandom(16)
    hashed = _pbkdf2(payload.password, salt, PBKDF2_ITERATIONS)
    await meta.update_one(
        {"key": ADMIN_META_KEY},
        {
            "$set": {
                "salt": _b64encode_raw(salt),
                "hash": _b64encode_raw(hashed),
                "iterations": PBKDF2_ITERATIONS,
                "createdAt": _now(),
            }
        },
        upsert=True,
    )
    return {"ok": True}


@app.get("/admin/top-winners", response_model=AdminTopWinnersResponse)
async def admin_top_winners(request: Request, limit: int = Query(5, ge=1, le=50)) -> AdminTopWinnersResponse:
    await _require_admin(request)

    eligible_voters = int(await users.count_documents({"currentRound": {"$gte": 4}, "awaitingReferralRound": None}))
    voted_players = int(await votes.count_documents({}))
    open_results = eligible_voters > 0 and voted_players >= eligible_voters

    # Votes per tech
    pipeline = [{"$group": {"_id": "$tech", "count": {"$sum": 1}}}]
    vote_counts: dict[str, int] = {}
    async for row in votes.aggregate(pipeline):
        tech = row.get("_id")
        if isinstance(tech, str):
            vote_counts[tech] = int(row.get("count", 0))

    # Rank users: higher votesForTech, earlier completion, higher quiz score.
    cursor = users.find(
        {},
        {
            "_id": 1,
            "name": 1,
            "department": 1,
            "studentId": 1,
            "tech": 1,
            "score": 1,
            "createdAt": 1,
            "completedAt": 1,
        },
    )
    rows: list[AdminWinnerRow] = []
    async for u in cursor:
        tech = u.get("tech") if isinstance(u.get("tech"), str) else None
        votes_for_tech = int(vote_counts.get(tech or "", 0))

        created_at = u.get("createdAt")
        completed_at = u.get("completedAt")
        completion_seconds: int | None = None
        if isinstance(created_at, datetime) and isinstance(completed_at, datetime):
            delta = completed_at - created_at
            completion_seconds = max(0, int(delta.total_seconds()))

        rows.append(
            AdminWinnerRow(
                rank=0,
                userId=str(u.get("_id")),
                name=(u.get("name") if isinstance(u.get("name"), str) else None),
                department=(u.get("department") if isinstance(u.get("department"), str) else None),
                studentId=(u.get("studentId") if isinstance(u.get("studentId"), str) else None),
                tech=tech,
                score=int(u.get("score", 0)),
                votesForTech=votes_for_tech,
                completionSeconds=completion_seconds,
            )
        )

    def completion_sort_key(v: int | None) -> int:
        return v if isinstance(v, int) else 10**12

    rows.sort(key=lambda r: (-r.votesForTech, completion_sort_key(r.completionSeconds), -r.score, (r.tech or ""), r.userId))
    winners = [r.model_copy(update={"rank": idx + 1}) for idx, r in enumerate(rows[:limit])]

    calculation = "Rank by: votesForTech (desc), completionSeconds (asc), quizScore (desc). completionSeconds = completedAt - createdAt."
    return AdminTopWinnersResponse(open=open_results, calculation=calculation, winners=winners)


@app.get("/admin/results", response_model=ResultsResponse)
async def admin_results(request: Request) -> ResultsResponse:
    await _require_admin(request)
    return await results(request)


@app.get("/results", response_model=ResultsResponse)
async def results(request: Request) -> ResultsResponse:
    eligible_voters = int(await users.count_documents({"currentRound": {"$gte": 4}, "awaitingReferralRound": None}))
    voted_players = int(await votes.count_documents({}))
    remaining = max(0, eligible_voters - voted_players)
    open_results = eligible_voters > 0 and voted_players >= eligible_voters

    # Results details are admin-only (winner + tech breakdown + winner users).
    if not await _is_admin_request(request):
        return ResultsResponse(
            open=open_results,
            eligibleVoters=eligible_voters,
            votedPlayers=voted_players,
            remainingVotes=remaining,
            techVotes={},
            winnerTech=None,
            winners=[],
        )

    assigned_tech = await users.distinct("tech")
    assigned_tech = [t for t in assigned_tech if isinstance(t, str)]

    pipeline = [{"$group": {"_id": "$tech", "count": {"$sum": 1}}}]
    vote_counts: dict[str, int] = {t: 0 for t in assigned_tech}
    async for row in votes.aggregate(pipeline):
        tech = row.get("_id")
        if isinstance(tech, str):
            vote_counts[tech] = int(row.get("count", 0))

    winner_tech = None
    winners: list[WinnerUser] = []

    if open_results and vote_counts:
        best = max(vote_counts.items(), key=lambda kv: (kv[1], kv[0]))
        winner_tech = best[0]

        cursor = users.find(
            {"tech": winner_tech},
            {"_id": 1, "name": 1, "department": 1, "studentId": 1, "letter": 1, "tech": 1, "score": 1},
        )
        async for u in cursor:
            winners.append(
                WinnerUser(
                    userId=str(u.get("_id")),
                    name=(u.get("name") if isinstance(u.get("name"), str) else None),
                    department=(u.get("department") if isinstance(u.get("department"), str) else None),
                    studentId=(u.get("studentId") if isinstance(u.get("studentId"), str) else None),
                    letter=(u.get("letter") if isinstance(u.get("letter"), str) else None),
                    tech=(u.get("tech") if isinstance(u.get("tech"), str) else None),
                    score=int(u.get("score", 0)),
                )
            )

    return ResultsResponse(
        open=open_results,
        eligibleVoters=eligible_voters,
        votedPlayers=voted_players,
        remainingVotes=remaining,
        techVotes=vote_counts,
        winnerTech=winner_tech,
        winners=winners,
    )
