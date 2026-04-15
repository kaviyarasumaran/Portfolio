from __future__ import annotations

import os


def _env(key: str, default: str) -> str:
    value = os.getenv(key)
    return value if value is not None and value != "" else default


MONGODB_URI = _env("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = _env("MONGODB_DB", "challenge_game")
CORS_ORIGINS = [
    o.strip()
    for o in _env(
        "CORS_ORIGINS",
        "http://localhost:3000,https://portfolio-mu-lyart-86.vercel.app",
    ).split(",")
    if o.strip()
]
CORS_ORIGIN_REGEX = _env(
    "CORS_ORIGIN_REGEX",
    r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$|^https?://.*\.ngrok-free\.dev$|^https?://.*\.vercel\.app$",
)
ADMIN_PASSWORD = _env("ADMIN_PASSWORD", "")
