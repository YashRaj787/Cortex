# Step 1 — GitHub + live deploy

**Goal:** Cortex is on GitHub and reachable on the public internet (signup → notes works).

**Time:** ~45–60 minutes (first time).

---

## Part A — GitHub

### 1. Create an empty repo on GitHub

- Name: `cortex` (or any name)
- **Do not** add README, `.gitignore`, or license (you already have them)

### 2. Push from your machine

From `Cortex/` (this folder):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/cortex.git
git push -u origin main
```

If `origin` already exists, use:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/cortex.git
git push -u origin main
```

### 3. Verify

- Open the repo on GitHub — you should see `backend/`, `frontend/`, `README.md`
- Confirm **`backend/.env` is NOT in the repo** (only `.env.example`)

---

## Part B — Database (Neon — free tier)

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a project → database name e.g. `cortex`
3. Copy the **connection string** (PostgreSQL)
4. Set the copied pooled connection string as `DATABASE_URL`. Keep
   `sslmode=require` in the URL.

---

## Part C — API on Render

1. Sign up at [https://render.com](https://render.com)
2. **New → Web Service** → connect your GitHub repo
3. Settings:

| Setting | Value |
|---------|--------|
| **Root directory** | `backend` |
| **Build command** | `npm install` |
| **Start command** | `npm start` |
| **Pre-deploy command** (optional) | `npm run migrate` |

4. **Environment variables** (Environment tab):

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render sets `PORT` automatically — use their default if provided) |
| `DATABASE_URL` | Neon pooled connection string |
| `JWT_SECRET` | long random string (32+ chars) |
| `CORS_ORIGIN` | `https://YOUR-APP.vercel.app` (set after Part D) |

5. Deploy → copy your API URL, e.g. `https://cortex-api.onrender.com`

6. Test: open `https://YOUR-API.onrender.com/health` → should show `{"ok":true,...}`

7. Run migration once if you skipped pre-deploy:

   - Render **Shell** → `npm run migrate`

---

## Part D — Frontend on Vercel

1. Sign up at [https://vercel.com](https://vercel.com)
2. **Add New Project** → import the same GitHub repo
3. Settings:

| Setting | Value |
|---------|--------|
| **Root directory** | `frontend` |
| **Framework** | Vite |
| **Build command** | `npm run build` |
| **Output** | `dist` |

4. **Environment variable:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com` (no trailing slash) |

5. Deploy → copy URL e.g. `https://cortex.vercel.app`

6. **Update Render** `CORS_ORIGIN` to your exact Vercel URL → redeploy API

---

## Part E — Smoke test (production)

1. Open Vercel URL → sign up
2. Create a note, folder, and tag
3. Log out → log in again → data still there

If CORS errors in browser console: `CORS_ORIGIN` must match the frontend URL **exactly** (including `https`, no trailing slash).

---

## Step 1 complete when

- [ ] Code on GitHub
- [ ] API `/health` returns OK
- [ ] Frontend loads and talks to API
- [ ] You can sign up and save a note on the live URL

Then continue to **Step 2** (search) in `ROADMAP.md`.

---

## Alternative hosts

| Piece | Alternative |
|-------|-------------|
| API | Railway, Fly.io |
| Frontend | Netlify, Cloudflare Pages |
| DB | Supabase, Railway Postgres |

Same env vars; only dashboard labels change.
