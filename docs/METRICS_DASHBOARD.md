 
# Cortex PostHog Dashboard

## 1. Dashboard Layout

| Section | Widget | Type | Event Source |
|---------|--------|------|-------------|
| **Users** | DAU (7-day line) | Trend | `dashboard_viewed` |
| | WAU (12-week line) | Trend | `dashboard_viewed` |
| | Activation Rate (single value) | Ratio | `note_created` / `signup_success` |
| | Search Adoption Rate (single value) | Ratio | `search_performed` / `signup_success` |
| | Feedback Conversion Rate (single value) | Ratio | `feedback_submitted` / `signup_success` |
| **Content** | Notes Created Today (bar) | Total | `note_created` |
| | Notes Created This Week (bar) | Total | `note_created` |
| **AI** | AI Usage Volume (bar) | Total | `ai_summary_requested` |
| | AI Users (dot) | Distinct | `ai_summary_requested` |
| | AI Success Rate (single value) | Ratio | `ai_summary_success` / `ai_summary_requested` |
| **Feedback** | Feedback Submitted (bar) | Total | `feedback_submitted` |

## 2. PostHog Insight Definitions

### 2.1 DAU

```
Name: DAU
Kind: Trends
Event: dashboard_viewed
Aggregation: Distinct users
Interval: Day
Display: Cumulative line (7-day)
```

### 2.2 WAU

```
Name: WAU
Kind: Trends
Event: dashboard_viewed
Aggregation: Distinct users
Interval: Week
Display: Cumulative line (12-week)
```

### 2.3 Activation Rate

```
Name: Activation Rate
Kind: Formula (Advanced)
Numerator:
  Event: note_created
  Aggregation: Distinct users
Denominator:
  Event: signup_success
  Aggregation: Distinct users
Display: Single value, percentage
```

### 2.4 Search Adoption Rate

```
Name: Search Adoption Rate
Kind: Formula (Advanced)
Numerator:
  Event: search_performed
  Aggregation: Distinct users
Denominator:
  Event: signup_success
  Aggregation: Distinct users
Display: Single value, percentage
```

### 2.5 Feedback Conversion Rate

```
Name: Feedback Conversion Rate
Kind: Formula (Advanced)
Numerator:
  Event: feedback_submitted
  Aggregation: Distinct users
Denominator:
  Event: signup_success
  Aggregation: Distinct users
Display: Single value, percentage
```

### 2.6 Notes Created Today

```
Name: Notes Today
Kind: Trends
Event: note_created
Aggregation: Total count
Interval: Day
Date Range: Last 24 hours
Display: Bar
```

### 2.7 Notes Created This Week

```
Name: Notes This Week
Kind: Trends
Event: note_created
Aggregation: Total count
Interval: Day
Date Range: This week (Mon-Sun)
Display: Bar
```

### 2.8 AI Usage Volume

```
Name: AI Usage
Kind: Trends
Event: ai_summary_requested
Aggregation: Total count
Interval: Day
Date Range: Last 7 days
Display: Bar
```

### 2.9 AI Users

```
Name: AI Users
Kind: Trends
Event: ai_summary_requested
Aggregation: Distinct users
Interval: Day
Date Range: Last 7 days
Display: Dot
```

### 2.10 AI Success Rate

```
Name: AI Success Rate
Kind: Formula (Advanced)
Numerator:
  Event: ai_summary_success
  Aggregation: Total count
Denominator:
  Event: ai_summary_requested
  Aggregation: Total count
Display: Single value, percentage
```

### 2.11 Feedback Submitted

```
Name: Feedback Submitted
Kind: Trends
Event: feedback_submitted
Aggregation: Total count
Interval: Day
Date Range: Last 7 days
Display: Bar
```

## 3. PostHog Dashboard Creation Steps

### Step 1 — Login to PostHog
- Navigate to https://app.posthog.com
- Log in with your PostHog project account

### Step 2 — Create Dashboard
1. Click **Dashboards** in the left sidebar
2. Click **+ New dashboard**
3. Name: `Cortex Metrics`
4. Set refresh interval: **5 minutes**
5. Click **Create**

### Step 3 — Add Insights

For each widget in section 1, use PostHog **Insights**:

**Trends** (DAU, WAU, Notes Today, Notes This Week, AI Usage, AI Users, Feedback Submitted):
1. Click **+ New insight**
2. Select **Trends**
3. **Event**: choose from the table in section 1
4. **Aggregation**: Total count or Distinct users (per widget)
5. **Interval**: Day or Week (per widget)
6. **Date range**: set per widget
7. Click **Add to dashboard** → select `Cortex Metrics`

**Formula** (Activation Rate, Search Adoption Rate, Feedback Conversion Rate, AI Success Rate):
1. Click **+ New insight**
2. Select **Formula**
3. Set numerator event and denominator event per definitions in section 2
4. Set aggregation method (Distinct users for ratios, Total count for AI Success Rate)
5. **Display**: Single value
6. Click **Add to dashboard** → select `Cortex Metrics`

### Step 4 — Arrange Widgets

Arrange the dashboard tiles to match the section layout:

| Row | Left | Right |
|-----|------|-------|
| 1 | DAU | WAU |
| 2 | Activation Rate | Search Adoption Rate |
| 3 | Feedback Conversion Rate | (empty) |
| 4 | Notes Created Today | Notes Created This Week |
| 5 | AI Usage Volume | AI Users |
| 6 | AI Success Rate | Feedback Submitted |

### Step 5 — Verify

- Confirm DAU/WAU show data based on `dashboard_viewed` events
- Confirm all ratios show as percentages
- Confirm no PII is visible in any widget

## 4. Frontend Code Required

**No frontend code changes are required.**

All necessary events are already tracked:
- `dashboard_viewed` — fires in `DashboardPage.jsx` line 98
- `signup_success` — fires in `auth.js`
- `note_created` — fires in `notes.js`
- `search_performed` — fires in `notes.js` during `listNotes`
- `ai_summary_requested` / `ai_summary_success` / `ai_summary_failed` — fires in `notes.js`
- `feedback_submitted` — fires in `FeedbackModal.jsx`
- `login_success` — fires in `auth.js` (available but not used for the dashboard metrics)

No new `track()` calls need to be added.

## 5. Environment Variables Required

| Variable | Required | Current Status |
|----------|----------|---------------|
| `VITE_POSTHOG_KEY` | Yes | Not set in `.env.production.example` — add it |

### Update `.env.production.example`

```
VITE_API_URL=https://your-api.onrender.com
VITE_FEEDBACK_FORM_URL=
VITE_POSTHOG_KEY=phc_YOUR_POSTHOG_PROJECT_KEY
```

Set the actual key in:
- **Vercel**: Project Settings → Environment Variables
- **Render**: Dashboard → Environment
- **Local development**: `frontend/.env` file
