import { useEffect, useState } from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import * as foldersApi from "../api/folders.js";
import * as notesApi from "../api/notes.js";
import * as tagsApi from "../api/tags.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, logout, isAuthenticated, booting } = useAuth();
  const navigate = useNavigate();

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
    setTags(await tagsApi.listTags());
  }

  async function loadFolders() {
    setFolders(await foldersApi.listFolders());
  }

  async function loadNotes(filter = notesFilter) {
    setNotes(await notesApi.listNotes(filter));
  }

  async function loadDashboard() {
    await Promise.all([loadTags(), loadFolders(), loadNotes("all")]);
    setNotesFilter("all");
  }

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    loadDashboard()
      .catch((err) => {
        setError(err.message);
        logout();
        navigate("/login", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (booting) {
    return (
      <main className="app">
        <p className="muted">Loading…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleCreateTag(e) {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setError("");
    setLoading(true);
    try {
      await tagsApi.createTag(newTagName.trim());
      setNewTagName("");
      await loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTag(id) {
    if (!window.confirm("Delete this tag? It will be removed from all notes.")) {
      return;
    }
    setError("");
    setLoading(true);
    try {
      await tagsApi.deleteTag(id);
      await loadTags();
      if (selectedNote) {
        setSelectedNote(await notesApi.getNote(selectedNote.id));
      }
      await loadNotes(notesFilter);
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
      await foldersApi.createFolder(newFolderName.trim());
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
      await foldersApi.updateFolder(id, name);
      await loadFolders();
      if (selectedNote?.folder_id === id) {
        setSelectedNote(await notesApi.getNote(selectedNote.id));
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
    if (!window.confirm("Delete this folder? Notes in it become unfiled.")) return;
    setError("");
    setLoading(true);
    try {
      await foldersApi.deleteFolder(id);
      await loadFolders();
      await loadNotes(notesFilter);
      if (selectedNote?.folder_id === id) {
        setSelectedNote(await notesApi.getNote(selectedNote.id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateNote(payload) {
    setError("");
    setLoading(true);
    try {
      await notesApi.createNote(payload);
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
      setSelectedNote(await notesApi.getNote(noteId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateNote(payload) {
    setError("");
    setLoading(true);
    try {
      const updated = await notesApi.updateNote(payload.id, payload);
      setSelectedNote(updated);
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
      await notesApi.deleteNote(noteId);
      setSelectedNote(null);
      await loadNotes(notesFilter);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const outletContext = {
    tags,
    folders,
    notes,
    notesFilter,
    selectedNote,
    loading,
    newTagName,
    newFolderName,
    setNewTagName,
    setNewFolderName,
    handleCreateTag,
    handleDeleteTag,
    handleNotesFilterChange,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    handleCreateNote,
    handleUpdateNote,
    handleSelectNote,
    setSelectedNote,
    handleDeleteNote,
  };

  return (
    <main className="app app-wide">
      <header className="app-header row">
        <div>
          <h1>Cortex</h1>
          <p className="muted">{user?.email}</p>
        </div>
        <button type="button" className="btn" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <nav className="tabs" aria-label="Main">
        <NavLink
          to="/notes"
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
          onClick={() => setSelectedNote(null)}
        >
          Notes
        </NavLink>
        <NavLink
          to="/folders"
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Folders
        </NavLink>
        <NavLink
          to="/tags"
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Tags
        </NavLink>
      </nav>

      {error && <p className="error">{error}</p>}

      <Outlet context={outletContext} />
    </main>
  );
}
