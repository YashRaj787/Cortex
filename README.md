# Cortex

Knowledge management app (monorepo): notes, folders, and tags with JWT auth.

## Structure

```
Cortex/
├── backend/          Express API + PostgreSQL
├── frontend/         React + Vite
├── package.json      Root scripts (dev, migrate, test)
├── DEPLOY.md         Deployment guide
└── GITHUB.md         Push to GitHub
```

## Prerequisites

- Node.js 18+
- PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Configure backend env:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` with database credentials and `JWT_SECRET` (32+ characters).

3. Create database and migrate:

   ```sql
   CREATE DATABASE cortex;
   ```

   ```bash
   npm run migrate
   ```

4. Run API and frontend (two terminals from repo root):

   ```bash
   npm run dev:api
   npm run dev:web
   ```

- API: http://localhost:3000  
- App: http://localhost:5173  

## Scripts (repo root)

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install backend + frontend deps |
| `npm run dev:api` | API with nodemon |
| `npm run dev:web` | Vite dev server |
| `npm run migrate` | Apply SQL migration |
| `npm run test` | Backend API smoke tests |
| `npm run start:api` | Production API start |

## Frontend routes

| Path | Screen |
|------|--------|
| `/login` | Sign up / log in |
| `/notes` | Notes list, create, edit, delete |
| `/folders` | Folder CRUD |
| `/tags` | Tag create / delete |

JWT is stored in `localStorage` (`cortex_token`). Protected API calls send `Authorization: Bearer <token>`.

## API

Base path: `/api/v1` — auth, notes, folders, tags.

## Tests

Requires a running Postgres DB and valid `backend/.env`:

```bash
npm run test
```

## Roadmap

We are building toward a live, AI-powered knowledge app in ordered steps.

**→ [ROADMAP.md](./ROADMAP.md)** — full checklist  
**→ [docs/STEP-01-LIVE.md](./docs/STEP-01-LIVE.md)** — **current: deploy to the internet**

Quick links: [GITHUB.md](./GITHUB.md) · [DEPLOY.md](./DEPLOY.md)
