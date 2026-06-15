import { toast } from "react-toastify";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import * as foldersApi from "../api/folders.js";
import * as notesApi from "../api/notes.js";
import * as tagsApi from "../api/tags.js";
import { useAuth } from "../context/auth-context.js";
import { toastSuccess } from "../utils/toast.js";

export default function DashboardPage() {
  const { user, logout, isAuthenticated, booting } = useAuth();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [notesFilter, setNotesFilter] = useState("all");
  const [noteSearch, setNoteSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  const loadTags = useCallback(async () => {
    setTags(await tagsApi.listTags());
  }, []);

  const loadFolders = useCallback(async () => {
    setFolders(await foldersApi.listFolders());
  }, []);

  const loadNotes = useCallback(async (filter, search) => {
    setNotes(await notesApi.listNotes(filter, search));
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadTags(), loadFolders(), loadNotes("all", "")]);
    setNotesFilter("all");
    setNoteSearch("");
  }, [loadFolders, loadNotes, loadTags]);

  const handleNoteSearchChange = useCallback(async (search) => {
    setNoteSearch(search);
    setSelectedNote(null);
    setError("");
    setLoading(true);
    try {
      await loadNotes(notesFilter, search);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadNotes, notesFilter]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setTimeout(() => {
      loadDashboard()
        .catch((err) => {
          setError(err.message);
          logout();
          navigate("/login", { replace: true });
        })
        .finally(() => setLoading(false));
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loadDashboard, logout, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("TOAST TEST");
    }
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
    if (!newTagName.trim() || submitting.current) return;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      await tagsApi.createTag(newTagName.trim());
      setNewTagName("");
      await loadTags();
      toastSuccess(`Tag "${newTagName.trim()}" created!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  async function handleDeleteTag(id) {
    if (!window.confirm("Delete this tag? It will be removed from all notes.")) return;
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      const tagName = tags.find((t) => t.id === id)?.name || "Tag";
      await tagsApi.deleteTag(id);
      await loadTags();
      if (selectedNote) {
        setSelectedNote(await notesApi.getNote(selectedNote.id));
      }
      await loadNotes(notesFilter, noteSearch);
      toastSuccess(`Tag "${tagName}" deleted!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  async function handleNotesFilterChange(filter) {
    setNotesFilter(filter);
    setSelectedNote(null);
    setError("");
    setLoading(true);
    try {
      await loadNotes(filter, noteSearch);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim() || submitting.current) return;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      await foldersApi.createFolder(newFolderName.trim());
      setNewFolderName("");
      await loadFolders();
      toastSuccess(`Folder "${newFolderName.trim()}" created!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  async function handleRenameFolder(id, name) {
    if (submitting.current) return false;
    submitting.current = true;
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
      submitting.current = false;
    }
  }

  async function handleDeleteFolder(id) {
    if (!window.confirm("Delete this folder? Notes in it become unfiled.")) return;
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      const folderName = folders.find((f) => f.id === id)?.name || "Folder";
      await foldersApi.deleteFolder(id);
      await loadFolders();
      await loadNotes(notesFilter, noteSearch);
      if (selectedNote?.folder_id === id) {
        setSelectedNote(await notesApi.getNote(selectedNote.id));
      }
      toastSuccess(`Folder "${folderName}" deleted!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  async function handleCreateNote(payload) {
    if (submitting.current) return false;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      await notesApi.createNote(payload);
      await loadNotes(notesFilter, noteSearch);
      toastSuccess("Note created!");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
      submitting.current = false;
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
    if (submitting.current) return false;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      const updated = await notesApi.updateNote(payload.id, payload);
      setSelectedNote(updated);r
      await loadNotes(notesFilter, noteSearch);
      toastSuccess("Note updated!");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  async function handleDeleteNote(noteId) {
    if (!window.confirm("Delete this note?")) return;
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    setLoading(true);
    try {
      await notesApi.deleteNote(noteId);
      setSelectedNote(null);
      await loadNotes(notesFilter, noteSearch);
      toastSuccess("Note deleted!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      submitting.current = false;
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
    handleNoteSearchChange,
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