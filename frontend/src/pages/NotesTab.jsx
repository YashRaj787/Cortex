import { useOutletContext } from "react-router-dom";
import NotesPanel from "../components/NotesPanel.jsx";

export default function NotesTab() {
  const {
    notes,
    tags,
    folders,
    notesFilter,
    selectedNote,
    loading,
    handleNotesFilterChange,
    handleNoteSearchChange,
    handleCreateNote,
    handleUpdateNote,
    handleSelectNote,
    setSelectedNote,
    handleDeleteNote,
  } = useOutletContext();

  return (
    <NotesPanel
      notes={notes}
      tags={tags}
      folders={folders}
      notesFilter={notesFilter}
      onNotesFilterChange={handleNotesFilterChange}
      onSearchChange={handleNoteSearchChange}
      selectedNote={selectedNote}
      loading={loading}
      onCreateNote={handleCreateNote}
      onUpdateNote={handleUpdateNote}
      onSelectNote={handleSelectNote}
      onClearSelection={() => setSelectedNote(null)}
      onDeleteNote={handleDeleteNote}
    />
  );
}
