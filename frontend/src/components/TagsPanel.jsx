export default function TagsPanel({
  tags,
  newTagName,
  onNewTagNameChange,
  onCreateTag,
  onDeleteTag,
  loading,
}) {
  return (
    <>
      <form className="card row-form" onSubmit={onCreateTag}>
        <input
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => onNewTagNameChange(e.target.value)}
          maxLength={100}
        />
        <button type="submit" className="btn primary btn-inline" disabled={loading}>
          {loading ? "Creating…" : "Add tag"}
        </button>
      </form>

      <section className="card">
        {loading && tags.length === 0 ? (
          <p className="muted">Loading tags…</p>
        ) : tags.length === 0 ? (
          <div className="empty-state">
            <p className="muted">No tags yet.</p>
            <p className="muted">Create tags to categorize your notes.</p>
          </div>
        ) : (
          <ul className="folder-list">
            {tags.map((tag) => (
              <li key={tag.id} className="folder-row">
                <span className="folder-name">{tag.name}</span>
                <button
                  type="button"
                  className="btn danger btn-inline"
                  disabled={loading}
                  onClick={() => onDeleteTag(tag.id)}
                >
                  {loading ? "Deleting…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}