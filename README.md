# Cortex

AI-powered knowledge management platform (monorepo).

## Structure

```
Cortex/
├── backend/     Express API + PostgreSQL
└── frontend/    React + Vite + Tailwind
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

   Edit `backend/.env` with your database credentials and `JWT_SECRET`.

3. Create database and migrate:

   ```sql
   CREATE DATABASE cortex;
   ```

   ```bash
   npm run migrate
   ```

4. Run API and frontend (two terminals):

   ```bash
   npm run dev:api
   npm run dev:web
   ```

- API: http://localhost:3000  
- App: http://localhost:5173  

## API

Base path: `/api/v1` — see `backend/` for auth, notes, folders, tags.

Send JWT: `Authorization: Bearer <token>`
