# Challenge Game Backend (FastAPI + MongoDB)

## Run locally

1) Start MongoDB (example using Docker):

```bash
docker run -p 27017:27017 --name challenge-mongo -d mongo:7
```

2) Install deps + run API:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Routes

- `POST /register` → register (name, department, studentId) and assign unique letter + tech
- `GET /questions?round=1` → 5 questions for the round
- `POST /submit-quiz` → score update + random peer assignment for the round
- `GET /assignment?userId=&round=` → peer name + department for that round
- `POST /submit-referral` → submit LinkedIn URL for assigned peer (1 per round)
- `POST /vote` → vote once, cannot vote own tech
- `GET /results` → redacted for normal users (vote progress only)
- `POST /admin/setup` → one-time admin password setup (stores in DB; only if `ADMIN_PASSWORD` env is not set)
- `POST /admin/login` → validate admin password
- `GET /admin/results` → full results (requires `x-admin-password`)
- `GET /admin/top-winners` → top winners leaderboard (requires `x-admin-password`)

## Env

- `MONGODB_URI` (default `mongodb://localhost:27017`)
- `MONGODB_DB` (default `challenge_game`)
- `CORS_ORIGINS` (default `http://localhost:3000`)
- `CORS_ORIGIN_REGEX` (default allows localhost + `*.ngrok-free.dev`)
- `ADMIN_PASSWORD` (optional; if set, disables `/admin/setup`)
