# Cortex

Cortex is a knowledge-management application for creating, organizing,
searching, and summarizing notes.

## Current Status

The local MVP includes:

- JWT signup, login, and authenticated routes
- Notes CRUD with folders and tags
- Note search and folder filtering
- OpenAI-powered note summaries
- Service-layer business logic and centralized API error handling

The application is not yet verified as publicly deployed. Docker, CI/CD,
production hardening, and advanced AI features remain on the roadmap.

## Architecture

```text
Cortex/
|-- backend/          Express 5 API + PostgreSQL
|-- frontend/         React 19 + Vite + React Router
|-- docs/             Implementation and deployment guides
|-- package.json      Root development commands
|-- DEPLOY.md         Deployment guide
`-- ROADMAP.md        Project status and next steps
```

## Prerequisites

- Node.js 18+
- PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Copy `backend/.env.example` to `backend/.env` and configure the database,
   `JWT_SECRET`, CORS origin, and optional OpenAI key.

3. Create the database and run the migration:

   ```bash
   npm run migrate
   ```

4. Run the API and frontend in separate terminals:

   ```bash
   npm run dev:api
   npm run dev:web
   ```

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Root Commands

| Command | Description |
|---|---|
| `npm run install:all` | Install backend and frontend dependencies |
| `npm run dev:api` | Run the API with nodemon |
| `npm run dev:web` | Run the Vite development server |
| `npm run migrate` | Apply the database migration |
| `npm run test` | Run backend API smoke tests |
| `npm run start:api` | Start the production API process |

## Routes

Frontend routes:

| Path | Screen |
|---|---|
| `/login` | Sign up and log in |
| `/notes` | Manage, search, and summarize notes |
| `/folders` | Manage folders |
| `/tags` | Manage tags |

API base path: `/api/v1`.

AI summary endpoint:

```text
POST /api/v1/notes/:id/summarize
```

JWT is stored in browser `localStorage` under `cortex_token`. Protected API
calls send `Authorization: Bearer <token>`.

## Tests

The backend smoke tests require a running PostgreSQL database and a valid
`backend/.env`. They write test data to the configured database.

```bash
npm run test
```

## Documentation

- [ROADMAP.md](./ROADMAP.md) - project status and ordered next steps
- [docs/STEP-01-LIVE.md](./docs/STEP-01-LIVE.md) - live deployment guide
- [DEPLOY.md](./DEPLOY.md) - deployment reference
