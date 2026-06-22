-- Migration to add necessary indexes for performance

-- Users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Notes table
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);

-- Tags table
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);

-- Note_Tags table
CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id ON note_tags(tag_id);

-- Composite indexes based on query patterns
-- Notes list by user ordered by updated_at DESC
CREATE INDEX IF NOT EXISTS idx_notes_user_updated_at ON notes(user_id, updated_at DESC);

-- Tags list by user ordered by name ASC
CREATE INDEX IF NOT EXISTS idx_tags_user_name ON tags(user_id, name ASC);

-- Note tags join for fetching tags of a note
CREATE INDEX IF NOT EXISTS idx_note_tags_note_tag ON note_tags(note_id, tag_id);

-- End of migration
