import { useOutletContext } from "react-router-dom";
import FoldersPanel from "../components/FoldersPanel.jsx";

export default function FoldersTab() {
  const {
    folders,
    newFolderName,
    setNewFolderName,
    loading,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
  } = useOutletContext();

  return (
    <FoldersPanel
      folders={folders}
      newFolderName={newFolderName}
      onNewFolderNameChange={setNewFolderName}
      onCreateFolder={handleCreateFolder}
      onRenameFolder={handleRenameFolder}
      onDeleteFolder={handleDeleteFolder}
      loading={loading}
    />
  );
}
