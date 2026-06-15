import { useState } from "react";

function FolderRow({ folder, loading, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim() || name.trim() === folder.name) {
      setEditing(false);
      setName(folder.name);
      return;
    }
    const ok = await onRename(folder.id, name.trim());
    if (ok) setEditing(false);
    else setName(folder.name);
  }

  if (editing) {
    return (
      <li className="folder-row">
        <form className="folder-edit-form" onSubmit={handleSave}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={255}
            autoFocus
            required
          />
          <button type="submit" className="btn btn-inline" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-inline"
            disabled={loading}
            onClick={() => {
              setName(folder.name);
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="folder-row">
      <span className="folder-name">{folder.name}</span>
      <div className="folder-actions">
        <button
          type="button"
          className="btn btn-inline"
          disabled={loading}
          onClick={() => setEditing(true)}
        >
          Rename
        </button>
        <button
          type="button"
          className="btn danger btn-inline"
          disabled={loading}
          onClick={() => onDelete(folder.id)}
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}

export default function FoldersPanel({
  folders,
  newFolderName,
  onNewFolderNameChange,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  loading,
}) {
  return (
    <>
      <form className="card row-form" onSubmit={onCreateFolder}>
        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => onNewFolderNameChange(e.target.value)}
          maxLength={255}
        />
        <button type="submit" className="btn primary btn-inline" disabled={loading}>
          {loading ? "Creating…" : "Add folder"}
        </button>
      </form>

      <section className="card">
        {loading && folders.length === 0 ? (
          <p className="muted">Loading folders…</p>
        ) : folders.length === 0 ? (
          <div className="empty-state">
            <p className="muted">No folders yet.</p>
            <p className="muted">Create a folder to organize your notes.</p>
          </div>
        ) : (
          <ul className="folder-list">
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                loading={loading}
                onRename={onRenameFolder}
                onDelete={onDeleteFolder}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}