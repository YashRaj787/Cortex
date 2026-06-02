# Step 2 — Search notes

**Status:** Implemented in code.

## What was added

- **API:** `GET /api/v1/notes?q=keyword` (works with `folder_id` too)
- **SQL:** `ILIKE` on `title` and `content` for the logged-in user
- **UI:** Search box on Notes tab (300ms debounce)

## Try it locally

1. Create a few notes with different titles.
2. Type in **Search** — list updates as you type.

## Next

Step 3 — AI summarize: [ROADMAP.md](../ROADMAP.md)
