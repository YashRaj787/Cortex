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
          Add tag
        </button>
      </form>

      <section className="card">
        {loading && tags.length === 0 ? (
          <p className="muted">Loading tags…</p>
        ) : tags.length === 0 ? (
          <p className="muted">No tags yet. Create one above.</p>
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
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
