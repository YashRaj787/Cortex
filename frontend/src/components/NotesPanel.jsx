import { useEffect, useState } from "react";

function TagPicker({ tags, selectedTagIds, onToggle }) {
  if (tags.length === 0) return null;

  return (
    <fieldset className="tag-picker">
      <legend>Tags (optional)</legend>
      <div className="tag-picker-options">
        {tags.map((tag) => (
          <label key={tag.id} className="tag-option">
            <input
              type="checkbox"
              checked={selectedTagIds.includes(tag.id)}
              onChange={() => onToggle(tag.id)}
            />
            {tag.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FolderSelect({ folders, value, onChange }) {
  return (
    <label>
      Folder (optional)
      <select
        className="select-input"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
      >
        <option value="">None</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function NotesPanel({
  notes,
  tags,
  folders,
  notesFilter,
  onNotesFilterChange,
  selectedNote,
  loading,
  onCreateNote,
  onUpdateNote,
  onSelectNote,
  onClearSelection,
  onDeleteNote,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFolderId, setEditFolderId] = useState(null);
  const [editTagIds, setEditTagIds] = useState([]);

  function folderName(id) {
    if (id == null) return null;
    return folders.find((f) => f.id === id)?.name ?? "Unknown folder";
  }

  useEffect(() => {
    if (!selectedNote) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content ?? "");
    setEditFolderId(selectedNote.folder_id ?? null);
    setEditTagIds(selectedNote.tags?.map((t) => t.id) ?? []);
  }, [selectedNote]);

  function toggleTag(tagId, setter) {
    setter((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const ok = await onCreateNote({
      title: title.trim(),
      content,
      tagIds: selectedTagIds,
      folder_id: folderId,
    });

    if (ok) {
      setTitle("");
      setContent("");
      setFolderId(null);
      setSelectedTagIds([]);
    }
  }

  function resetEditFields() {
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content ?? "");
    setEditFolderId(selectedNote.folder_id ?? null);
    setEditTagIds(selectedNote.tags?.map((t) => t.id) ?? []);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const ok = await onUpdateNote({
      id: selectedNote.id,
      title: editTitle.trim(),
      content: editContent,
      tagIds: editTagIds,
      folder_id: editFolderId,
    });

    if (ok) {
      setIsEditing(false);
    }
  }

  function preview(text, max = 120) {
    if (!text) return "No content";
    return text.length <= max ? text : `${text.slice(0, max)}…`;
  }

  if (selectedNote) {
    const noteFolder = folderName(selectedNote.folder_id);

    return (
      <section className="card note-detail">
        <button type="button" className="link back-link" onClick={onClearSelection}>
          ← Back to notes
        </button>

        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <h2>Edit note</h2>
            <label>
              Title
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={500}
                required
              />
            </label>
            <label>
              Content
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
              />
            </label>
            <FolderSelect
              folders={folders}
              value={editFolderId}
              onChange={setEditFolderId}
            />
            <TagPicker
              tags={tags}
              selectedTagIds={editTagIds}
              onToggle={(id) => toggleTag(id, setEditTagIds)}
            />
            <div className="detail-actions">
              <button type="submit" className="btn primary btn-inline" disabled={loading}>
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-inline"
                disabled={loading}
                onClick={() => {
                  resetEditFields();
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="note-title">{selectedNote.title}</h2>
            <p className="note-meta muted">
              {noteFolder && <span className="folder-badge">{noteFolder}</span>}
              Updated {new Date(selectedNote.updated_at).toLocaleString()}
            </p>
            <div className="note-content">{selectedNote.content || "—"}</div>
            {selectedNote.tags?.length > 0 && (
              <ul className="tag-chips">
                {selectedNote.tags.map((tag) => (
                  <li key={tag.id}>{tag.name}</li>
                ))}
              </ul>
            )}
            <div className="detail-actions">
              <button
                type="button"
                className="btn btn-inline"
                disabled={loading}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn danger btn-inline"
                disabled={loading}
                onClick={() => onDeleteNote(selectedNote.id)}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <>
      <form className="card" onSubmit={handleCreateSubmit}>
        <h2>New note</h2>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting ideas"
            maxLength={500}
            required
          />
        </label>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note…"
            rows={4}
          />
        </label>
        <FolderSelect folders={folders} value={folderId} onChange={setFolderId} />
        <TagPicker
          tags={tags}
          selectedTagIds={selectedTagIds}
          onToggle={(id) => toggleTag(id, setSelectedTagIds)}
        />
        <button type="submit" className="btn primary" disabled={loading}>
          Save note
        </button>
      </form>

      <section className="card">
        <div className="notes-list-header">
          <h2 className="section-heading">Your notes</h2>
          <label className="filter-label">
            <span className="sr-only">Filter by folder</span>
            <select
              className="select-input"
              value={notesFilter}
              onChange={(e) => onNotesFilterChange(e.target.value)}
              disabled={loading}
            >
              <option value="all">All notes</option>
              <option value="none">Unfiled</option>
              {folders.map((folder) => (
                <option key={folder.id} value={String(folder.id)}>
                  {folder.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {loading && notes.length === 0 ? (
          <p className="muted">Loading notes…</p>
        ) : notes.length === 0 ? (
          <p className="muted">No notes in this view. Create one above.</p>
        ) : (
          <ul className="note-list">
            {notes.map((note) => {
              const noteFolder = folderName(note.folder_id);
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    className="note-list-item"
                    onClick={() => onSelectNote(note.id)}
                  >
                    <span className="note-list-title">{note.title}</span>
                    {noteFolder && (
                      <span className="note-list-folder muted">{noteFolder}</span>
                    )}
                    <span className="note-list-preview muted">
                      {preview(note.content)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
