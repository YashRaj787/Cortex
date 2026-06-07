# Deploying Cortex

## Prerequisites

- PostgreSQL database (Neon, Supabase, Railway, or self-hosted)
- Node 18+ on your host or PaaS

## Backend (API)

1. Set environment variables on your host:

   | Variable | Example |
   |----------|---------|
   | `PORT` | `3000` |
   | `DATABASE_URL` | Neon pooled connection string |
   | `JWT_SECRET` | long random string (32+ chars) |
   | `CORS_ORIGIN` | `https://your-frontend.vercel.app` |

2. Run migrations once. The command also verifies that all required tables
   exist:

   ```bash
   npm run migrate
   ```

3. Start the server:

   ```bash
   npm run start:api
   ```

**Hosts:** Railway, Render, Fly.io — point start command to `npm start` in `backend/`.

## Frontend (Vite)

1. Set build env:

   ```bash
   VITE_API_URL=https://your-api.example.com
   ```

2. Build and deploy static output:

   ```bash
   cd frontend
   npm run build
   ```

   Deploy the `frontend/dist` folder (Vercel, Netlify, Cloudflare Pages).

3. Ensure `CORS_ORIGIN` on the API matches your frontend URL exactly.

## Local production smoke test

```bash
npm run install:all
npm run migrate
npm run start:api
# other terminal
cd frontend && npm run build && npm run preview
```
