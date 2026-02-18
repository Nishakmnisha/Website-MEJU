# Mejuvante Platform — Fully Dockerized Frontend + Backend

This repository provides a **fully dockerized** full-stack baseline for the Mejuvante AI-first ecosystem.

## What is included

- `frontend/` — React + TypeScript + Vite app
  - Modern AI-style UI and 3D hero visuals
  - Login screen
  - Content submission console for non-technical users
  - Live Gemini-style JSON preview
  - Submission queue (from backend)
- `backend/` — Express + TypeScript API
  - Login endpoint
  - Authenticated CMS submission endpoints
  - Domain-aware AI draft response shaping
- `docker-compose.yml`
  - Frontend served via **Nginx** on port `80`
  - Backend API on port `8080`
  - Frontend `/api/*` calls reverse-proxied to backend
- `scripts/verify_repo_files.sh`
  - Local/CI verification that required project files exist

---

## If files are not visible in your Git provider

This local environment can commit changes and create PR metadata, but direct remote push depends on your Git remote permissions.

To push from your machine:

```bash
git fetch origin
git checkout work
git pull --rebase origin work
git push origin work
```

After pushing, the committed files in this repository should be visible in your provider UI.

---

## Quick local verification

```bash
bash scripts/verify_repo_files.sh
```

Also enforced by CI workflow:

- `.github/workflows/verify-repo-files.yml`

---

## Architecture

```text
Browser -> Nginx Frontend (port 80)
           |- serves React static files
           |- proxies /api/* and /health to backend

Backend API (Express, port 8080)
           |- /api/auth/login
           |- /api/cms/submissions (GET/POST, auth)
           |- /api/config/site-config
```

---

## Login credentials (demo users)

Use these in the login form:

1. **Admin**
   - Email: `admin@mejuvante.ai`
   - Password: `Password@123`
2. **Editor**
   - Email: `editor@mejuvante.ai`
   - Password: `Password@123`

> These are demo in-memory users for development only.

---

## Run with Docker (recommended)

### 1) Build images

```bash
docker compose build
```

### 2) Start containers

```bash
docker compose up -d
```

### 3) Open apps

- Frontend: `http://localhost`
- Backend health: `http://localhost:8080/health`

### 4) Stop containers

```bash
docker compose down
```

---

## How login + integration works

1. User logs in from frontend (`POST /api/auth/login`).
2. Backend returns token + user metadata.
3. Frontend includes `Authorization: Bearer <token>` in CMS requests.
4. User submits content request via form (`POST /api/cms/submissions`).
5. Backend validates payload and returns:
   - stored submission record
   - Gemini-style structured draft (`aiDraft`)
6. Frontend shows draft JSON + refreshed queue (`GET /api/cms/submissions`).

---

## Backend endpoints

- `POST /api/auth/login`
- `GET /api/config/site-config`
- `GET /api/cms/submissions` *(auth required)*
- `POST /api/cms/submissions` *(auth required)*
- `GET /health`

### Example submission payload

```json
{
  "contentType": "Page",
  "domain": "mejuvante.com",
  "title": "AI Compliance Transformation",
  "goal": "Increase enterprise demo requests",
  "requirements": "Create a trust-first page with proof points, GDPR note, and CTA"
}
```

---

## Notes

- Current storage is in-memory for quick demo and UX validation.
- Next step is replacing in-memory sessions/submissions with PostgreSQL + Redis.
- `docs/implementation-blueprint.md` contains long-term architecture and rollout plan.
