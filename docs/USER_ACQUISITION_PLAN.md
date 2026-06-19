# User Acquisition Plan — Cortex

**Goal:** 10–20 active users within 14 days
**Target Launch Date:** TBD
**Status:** Draft / Planning

---

## 1. Acquisition Channels

| # | Channel | Reach Estimate | Effort (1–5) | Priority |
|---|---------|---------------|--------------|----------|
| 1 | College WhatsApp Groups | 50–100 per group | 2 | 🔥 High |
| 2 | Friends (direct invitation) | 10–20 | 1 | 🔥 High |
| 3 | Classmates (in-person / class group) | 20–40 | 2 | 🔥 High |
| 4 | Developer Discord Servers | 100–500 | 3 | Medium |
| 5 | Reddit Communities (r/NoteTaking, r/productivity, r/SideProject) | 200–1000+ | 3 | Medium |
| 6 | Coding Communities (college tech clubs, open source groups) | 20–50 | 2 | Medium |

**Primary strategy (Days 1–3):** Leverage existing real-world connections (WhatsApp, friends, classmates) for quick, trusted sign-ups.  
**Secondary strategy (Days 4–14):** Expand to online communities (Discord, Reddit, coding groups) for broader reach.

---

## 2. Outreach Messages (per channel)

### 2.1 College WhatsApp Groups

> Hey everyone! 👋  
> I've been building a lightweight note-taking app called **Cortex** — it's like a personal second brain for quick notes, with AI-powered summaries.  
> It's completely free and takes 30 seconds to sign up.  
> Would love for you to try it out and let me know what you think!  
> 👉 [Link to Cortex]  
> 
> *Bonus:* The AI summary feature is pretty cool — it can summarise your notes in one click.

### 2.2 Friends (direct / 1-on-1)

> Hey [Name]!  
> I just finished building this note app I've been working on — Cortex.  
> It's super simple: create notes, tag them, and get AI summaries.  
> Could you try it out for a minute and tell me if anything feels broken or missing?  
> 👉 [Link]  
> Honest feedback would really help me out!

### 2.3 Classmates (in-person / class group chat)

> Quick note: I built this app called **Cortex** for taking quick notes with AI summaries.  
> If anyone's interested in trying it, here's the link: [Link]  
> Takes literally 30 seconds to sign up. Feedback appreciated!

### 2.4 Developer Discord Servers

> **Project Showcase — Cortex** 🧠  
> A minimal, fast note-taking app with AI-powered summaries. Built for people who want to capture ideas quickly without the bloat.  
> 
> ✨ Features:
> - Clean, distraction-free editor
> - Tag-based organisation
> - One-click AI summaries
> - No clutter, no folders, no fuss
> 
> Tech stack: Node.js + React  
> Would love feedback from the community!  
> 👉 [Link]

### 2.5 Reddit Communities

**Subreddits:** r/NoteTaking, r/productivity, r/SideProject, r/SaaS

> **Title:** Built a minimal note-taking app with AI summaries — looking for early testers
>
> Body:  
> Hey everyone,  
> I built **Cortex** — a lightweight note-taking app focused on speed and simplicity. You create notes, tag them, and get AI summaries with one click.  
> 
> No folders, no complex hierarchies — just capture and go.  
> 
> Looking for 10–20 early users to try it out and share feedback.  
> 👉 [Link]  
> 
> Would love to hear what you think!

### 2.6 Coding Communities (College Tech Clubs)

> Hi everyone!  
> I've been working on a side project called **Cortex** — a note-taking app with AI summaries.  
> It's built with Node.js + React.  
> If anyone wants to try it or check out the code, here's the link: [Link]  
> Happy to share learnings from building it too 🙂  
> Feedback very welcome!

---

## 3. Activation Criteria

A user is considered **activated** when they complete **all three** of the following steps:

| # | Criterion | Definition | How to Track |
|---|-----------|------------|-------------|
| 1 | Signed up | Created an account (email + password, or Google OAuth) | Backend signup log |
| 2 | Created first note | Saved at least 1 note with content | DB: `notes` table — `user_id` with ≥1 row |
| 3 | Returned at least once | Logged in on a different day (≥1 day after signup) | DB: `sessions` or `last_login` — distinct date > signup date |

**Activation rate target:** ≥50% of sign-ups should meet all 3 criteria within 7 days of sign-up.

---

## 4. Success Metrics

| Metric | Definition | Tracking Method | Weekly Target |
|--------|-----------|-----------------|---------------|
| **Sign-ups** | Total new account registrations | Backend auth logs | ≥30 |
| **Activated users** | Users who meet all 3 activation criteria | DB query (notes + login check) | ≥15 |
| **Returning users** | Users who logged in on ≥2 separate days | Session / login analytics | ≥10 |
| **AI summary usage** | Number of AI summary requests initiated | Backend AI summary endpoint logs | ≥50 |
| **Feedback submissions** | Number of users who submitted feedback (e.g., in-app form) | Feedback DB / form responses | ≥5 |

**Primary KPI:** **Activated users** — this is the true north metric. Sign-ups alone don't indicate product-market fit.

**Dashboard view (real-time):**

```
┌─────────────┬──────────┬──────────┐
│   Metric    │   Today  │  Week 1  │
├─────────────┼──────────┼──────────┤
│ Sign-ups    │    0     │     0    │
│ Activated   │    0     │     0    │
│ Returning   │    0     │     0    │
│ AI Summaries│    0     │     0    │
│ Feedback    │    0     │     0    │
└─────────────┴──────────┴──────────┘
```

---

## 5. Tracking Spreadsheet Template

A simple tracking sheet (Google Sheets or Excel) with the following columns.

### Sheet 1: User Tracking (per-user granularity)

| User ID | Email (anonymous if preferred) | Channel | Sign-up Date | First Note Created? | First Note Date | Return Visit? | Return Date | Activated? | AI Summaries Used | Feedback Submitted? | Feedback Date |
|---------|-------------------------------|---------|-------------|---------------------|----------------|--------------|-------------|------------|-------------------|---------------------|---------------|
| U001    | user@example.com              | WhatsApp | 19-Jun-2026 | ✅ Yes / ❌ No      | 19-Jun-2026    | ✅ Yes / ❌ No | 20-Jun-2026 | ✅ / ❌    | 3                 | ✅ Yes / ❌ No      | 20-Jun-2026  |
| U002    | ...                           | Friends | ...         | ...                 | ...            | ...          | ...         | ...        | ...               | ...                 | ...           |

### Sheet 2: Channel Summary (aggregate)

| Channel | Invites Sent | Sign-ups | Activation Rate | Return Rate | Avg AI Summaries/User | Feedback Count |
|---------|-------------|----------|----------------|-------------|----------------------|----------------|
| WhatsApp | 50          | 8        | 62.5%          | 50.0%       | 2.3                  | 2              |
| Friends  | 10          | 4        | 75.0%          | 75.0%       | 4.0                  | 1              |
| Discord  | —           | 3        | 33.3%          | 33.3%       | 1.0                  | 0              |
| Reddit   | —           | 5        | 40.0%          | 40.0%       | 1.8                  | 1              |
| College  | 20          | 6        | 50.0%          | 33.3%       | 1.5                  | 1              |

### Sheet 3: Daily Progress (Day 0–14)

| Day | Date | New Sign-ups | Total Sign-ups | Activated (cumulative) | Returning Users (7d) | AI Summaries | Feedback |
|-----|------|-------------|----------------|----------------------|---------------------|-------------|---------|
| 0   |      |             |                |                      |                     |             |         |
| 1   |      |             |                |                      |                     |             |         |
| ... |      |             |                |                      |                     |             |         |
| 14  |      |             |                |                      |                     |             |         |

---

## 6. Validation Plan (Summary)

1. **Days 1–3 (Launch & Friends & Family):** Push to WhatsApp groups, friends, classmates. Manually log sign-ups in the spreadsheet. Track who creates a first note.
2. **Day 4:** Check activation rate. If ≥50%, proceed to Discord/Reddit outreach. If <50%, troubleshoot onboarding friction (e.g., sign-up flow too long, unclear value prop).
3. **Days 4–10 (Community Outreach):** Post to Discord servers and Reddit communities. Monitor sign-up spike and drop-off.
4. **Day 7:** Mid-point check. Must have ≥5 activated users. If behind, double down on highest-converting channel.
5. **Day 14:** Final review. Count activated users. Target: ≥10 activated users. Document learnings per channel for future campaigns.

**Stop criteria:** If after 7 days there are <3 activated users and <50% activation rate, pause paid/community outreach and fix product friction first.

---

## 7. Tools Needed

- [ ] Google Sheets (or Excel) template — create from Section 5 above
- [ ] In-app feedback form (e.g., Typeform, Google Form, or custom modal)
- [ ] Link shortener (optional, for tracking clicks per channel: e.g., bit.ly)
- [ ] Discord account + joined relevant servers
- [ ] Reddit account with sufficient karma to post in target subreddits

---

## 8. Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low sign-up from online communities | Medium | High | Pre-warm with friends/family first; iterate messaging based on response |
| Sign-up flow broken / high drop-off | Low | Critical | Test sign-up flow end-to-end before launch |
| Users sign up but don't create notes | Medium | Medium | Add in-app guidance / onboarding prompt on first login |
| Users don't return | Medium | Medium | Send a single follow-up email after 48h (if email capability exists) |
| AI summary usage low | Medium | Low | Feature highlight in outreach messages + in-app tooltip |

---

*Document version: 1.0 | Last updated: 19-Jun-2026*