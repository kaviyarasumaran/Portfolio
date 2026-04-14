from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient

from .config import MONGODB_DB, MONGODB_URI

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]

users = db["users"]
assignments = db["assignments"]
referrals = db["referrals"]
quiz_submissions = db["quiz_submissions"]
votes = db["votes"]
meta = db["meta"]
