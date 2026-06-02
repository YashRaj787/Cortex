import { useEffect, useState } from "react";
import { api, getToken, setToken } from "./api/client.js";
import FoldersPanel from "./components/FoldersPanel.jsx";
import NotesPanel from "./components/NotesPanel.jsx";
import TagsPanel from "./components/TagsPanel.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  const [mode, setMode] = useState("login");
  const [activeTab, setActiveTab] = useState("notes");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [notesFilter, setNotesFilter] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTags() {
    const result = await api("/api/v1/tags");
    setTags(result.data ?? []);
  }

  async function loadFolders() {
    const result = await api("/api/v1/folders");
    setFolders(result.data ?? []);
  }

  async function loadNotes(filter = notesFilter) {
    let path = "/api/v1/notes";
    if (filter !== "all" && filter !== "none") {
      path += `?folder_id=${filter}`;
    }

    const result = await api(path);
    let data = result.data ?? [];

    if (filter === "none") {
      data = data.filter((note) => note.folder_id == null);
    }

    setNotes(data);
  }

  async function loadDashboard() {
    await Promise.all([loadTags(), loadFolders(), loadNotes("all")]);
    setNotesFilter("all");
  }

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    loadDashboard()
      .catch((err) => {
        setError(err.message);
        handleLogout();
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await api("/api/v1/auth/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
      }

      const loginResult = await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(loginResult.token);
      setIsLoggedIn(true);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTag(e) {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setError("");
    setLoading(true);

    try {
      await api("/api/v1/tags", {
        method: "POST",
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      setNewTagName("");
      await loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleNotesFilterChange(filter) {
    setNotesFilter(filter);
    setSelectedNote(null);
    setError("");
    setLoading(true);

    try {
      await loadNotes(filter);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setError("");
    setLoading(true);

    try {
      await api("/api/v1/folders", {
        method: "POST",
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      setNewFolderName("");
      await loadFolders();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRenameFolder(id, name) {
    setError("");
    setLoading(true);

    try {
      await api(`/api/v1/folders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      await loadFolders();
      if (selectedNote?.folder_id === id) {
        const result = await api(`/api/v1/notes/${selectedNote.id}`);
        setSelectedNote(result.data);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFolder(id) {
    if (!window.confirm("Delete this folder? Notes in it become unfiled.")) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api(`/api/v1/folders/${id}`, { method: "DELETE" });
      await loadFolders();
      await loadNotes(notesFilter);
      if (selectedNote?.folder_id === id) {
        const result = await api(`/api/v1/notes/${selectedNote.id}`);
        setSelectedNote(result.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateNote({ title, content, tagIds, folder_id }) {
    setError("");
    setLoading(true);

    try {
      await api("/api/v1/notes", {
        method: "POST",
        body: JSON.stringify({ title, content, tagIds, folder_id }),
      });
      await loadNotes(notesFilter);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectNote(noteId) {
    setError("");
    setLoading(true);

    try {
      const result = await api(`/api/v1/notes/${noteId}`);
      setSelectedNote(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateNote({ id, title, content, tagIds, folder_id }) {
    setError("");
    setLoading(true);

    try {
      const result = await api(`/api/v1/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, content, tagIds, folder_id }),
      });
      setSelectedNote(result.data);
      await loadNotes(notesFilter);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNote(noteId) {
    if (!window.confirm("Delete this note?")) return;

    setError("");
    setLoading(true);

    try {
      await api(`/api/v1/notes/${noteId}`, { method: "DELETE" });
      setSelectedNote(null);
      await loadNotes(notesFilter);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setIsLoggedIn(false);
    setTags([]);
    setFolders([]);
    setNotes([]);
    setNotesFilter("all");
    setSelectedNote(null);
    setError("");
    setActiveTab("notes");
  }

  if (!isLoggedIn) {
    return (
      <main className="app">
        <header className="app-header">
          <h1>Cortex</h1>
          <p className="muted">Log in to manage notes, folders, and tags</p>
        </header>

        <form className="card" onSubmit={handleAuthSubmit}>
          <h2>{mode === "login" ? "Log in" : "Sign up"}</h2>

          {mode === "signup" && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading
              ? "Working…"
              : mode === "login"
                ? "Log in"
                : "Create account & log in"}
          </button>

          <p className="muted switch-mode">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="app app-wide">
      <header className="app-header row">
        <div>
          <h1>Cortex</h1>
          <p className="muted">{email}</p>
        </div>
        <button type="button" className="btn" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <nav className="tabs" aria-label="Main">
        <button
          type="button"
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("notes");
            setSelectedNote(null);
          }}
        >
          Notes
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "folders" ? "active" : ""}`}
          onClick={() => setActiveTab("folders")}
        >
          Folders
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "tags" ? "active" : ""}`}
          onClick={() => setActiveTab("tags")}
        >
          Tags
        </button>
      </nav>

      {error && <p className="error">{error}</p>}

      {activeTab === "notes" && (
        <NotesPanel
          notes={notes}
          tags={tags}
          folders={folders}
          notesFilter={notesFilter}
          onNotesFilterChange={handleNotesFilterChange}
          selectedNote={selectedNote}
          loading={loading}
          onCreateNote={handleCreateNote}
          onUpdateNote={handleUpdateNote}
          onSelectNote={handleSelectNote}
          onClearSelection={() => setSelectedNote(null)}
          onDeleteNote={handleDeleteNote}
        />
      )}
      {activeTab === "folders" && (
        <FoldersPanel
          folders={folders}
          newFolderName={newFolderName}
          onNewFolderNameChange={setNewFolderName}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          loading={loading}
        />
      )}
      {activeTab === "tags" && (
        <TagsPanel
          tags={tags}
          newTagName={newTagName}
          onNewTagNameChange={setNewTagName}
          onCreateTag={handleCreateTag}
          loading={loading}
        />
      )}
    </main>
  );
}

export default App;
