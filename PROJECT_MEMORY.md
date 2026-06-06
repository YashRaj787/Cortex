# Cortex Project Memory

## Overview

Cortex is a knowledge-management monorepo. Users can create accounts, manage
notes, organize notes with folders and tags, search their notes, and request AI
summaries.

## Current Architecture

| Layer | Stack | Details |
|---|---|---|
| Frontend | React 19, Vite, React Router | SPA with routes for login, notes, folders, and tags |
| Backend | Node.js, Express 5 | REST API under `/api/v1` |
| Database | PostgreSQL via `pg` | Raw SQL and one initial schema migration |
| Authentication | JWT and bcrypt | JWT stored in browser `localStorage` |
| AI | OpenAI API | On-demand note summarization |
| Deployment | Render and Vercel configuration | Public deployment is not yet verified |

## Implemented Features

- Signup, login, logout, and current-user lookup
- JWT-protected API routes
- Notes create, read, update, delete, search, and folder filtering
- Folder create, list, rename, and delete
- Tag create, list, delete, and note assignment
- AI note summarization when `OPENAI_API_KEY` is configured
- Service-layer business logic
- Typed application errors and global API error handling
- Basic backend smoke tests

## Important Decisions

- Raw SQL is used instead of an ORM.
- Controllers are thin and forward errors to the global error middleware.
- Services own business logic and throw typed application errors.
- React Router controls frontend navigation.
- The API and frontend are deployed separately.

## Known Gaps

- Public deployment has not been verified.
- Docker and CI/CD are not implemented.
- Frontend lint currently reports React hook issues.
- Tests require a configured PostgreSQL database and are not isolated.
- Production controls such as rate limiting, structured logging, monitoring,
  backups, and AI usage limits are not implemented.

## Working Commands

```bash
npm run install:all
npm run migrate
npm run dev:api
npm run dev:web
npm run test
```

Backend runs on port `3000` by default. The Vite frontend runs on port `5173`.

## Next Priorities

1. Keep the repository clean and documentation accurate.
2. Fix runtime and frontend lint defects.
3. Isolate and expand automated tests.
4. Verify a live Render/Vercel/PostgreSQL deployment.
5. Add Docker, CI/CD, and production hardening.
