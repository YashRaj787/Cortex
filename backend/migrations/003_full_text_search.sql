-- Add GIN index for full-text search on notes.title and notes.content

CREATE INDEX IF NOT EXISTS idx_notes_tsvector
ON notes
USING GIN (to_tsvector('english', title || ' ' || content));