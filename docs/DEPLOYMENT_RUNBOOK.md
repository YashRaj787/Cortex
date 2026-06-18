# Cortex Deployment Runbook

## 1. Overview

The Cortex application is a full‑stack web service composed of the following
components:

* **Frontend** – A React application bundled with Vite and deployed to Render
  as a static site.
* **Backend** – A Node.js/Express API that exposes REST endpoints for
  authentication, notes CRUD, and AI summarization. It runs in a Docker container
  on Render.
* **Database** – A PostgreSQL instance managed by Render. All migrations are
  applied via the `npm run migrate` script.
* **CI/CD** – GitHub Actions triggers on pushes to `main`. The workflow
  builds the Docker image, runs tests, and deploys to Render.

## 2. Deployment Process

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Deploying new release"
   git push origin main
   ```
2. **GitHub Actions** – The `ci.yml` workflow runs automatically. It:
   * Installs dependencies
   * Runs unit & integration tests
   * Builds the Docker image
   * Pushes the image to Render
3. **Render Deployment** – Render pulls the latest image and restarts the
   service. The deployment status is visible in the Render dashboard.
4. **Health Verification** – After the deployment completes, run:
   ```bash
   curl -s http://<render-app-url>/health | jq
   ```
   Expect a JSON response: `{ "status": "OK" }`.

## 3. Rollback Procedure

If a deployment fails or introduces regressions:

1. **Git rollback** – Revert to the previous commit:
   ```bash
   git revert <bad-commit-hash>
   git push origin main
   ```
2. **Render rollback** – In the Render dashboard, click **Rollback** on the
   failed deployment to redeploy the last successful image.
3. **Verification** – Repeat the health check from section 2.

## 4. Environment Variables

| Variable | Purpose | Example (redacted) |
|----------|---------|---------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Secret for signing JWT tokens | `s3cr3tK3y` |
| `OPENAI_API_KEY` | Key for the OpenAI summarization provider | `sk-xxxxxxxxxxxxxxxxxxxx` |
| `GEMINI_API_KEY` | Key for the Google Gemini summarization provider | `your-gemini-api-key-here` |
| `RENDER_SERVICE_ID` | Render service identifier for API calls | `srv-123456` |
| `CORS_ORIGIN` | Allowed origin for CORS | `http://localhost:5173` |
| `DB_SSL` | Enable SSL for PostgreSQL connection | `false` |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Port the backend listens on | `8080` |

All variables are defined in `backend/.env.example` and injected by Render.

## 5. Database Migration Process

1. **Run migrations** – From the project root:
   ```bash
   npm run migrate
   ```
2. **Migration order** – Migrations are numbered sequentially (e.g., `001_…`,
   `002_…`). The script applies them in ascending order.
3. **Schema tracking** – The `schema_migrations` table records applied
   migrations. The migration script checks this table to avoid re‑applying
   migrations.

## 6. Verification Checklist

* `/health` returns `{ "status": "OK" }`.
* Frontend loads at `https://<render-frontend-url>`.
* Login flow works (JWT issued, protected routes accessible).
* Notes CRUD operations succeed (create, read, update, delete).
* AI summarization endpoint returns a summary.

## 7. Incident Response

### Backend down
* Check Render logs for the backend service.
* Verify `DATABASE_URL` is correct and the database is reachable.
* Restart the backend service via Render dashboard.

### Frontend down
* Ensure the static site is deployed and the URL is correct.
* Verify that the backend is reachable from the frontend (CORS, network).

### Database unavailable
* Confirm the PostgreSQL instance is running on Render.
* Check connection string and credentials.
* Run `npm run migrate` locally to ensure migrations can connect.

### AI provider failing
* Verify `AI_API_KEY` is valid and not expired.
* Check provider status page for outages.
* Fallback to cached summaries if available.

---
**Prepared by:** DevOps Team
**Last updated:** 2026-06-17