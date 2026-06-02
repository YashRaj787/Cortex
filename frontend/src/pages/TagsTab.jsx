import { useOutletContext } from "react-router-dom";
import TagsPanel from "../components/TagsPanel.jsx";

export default function TagsTab() {
  const {
    tags,
    newTagName,
    setNewTagName,
    loading,
    handleCreateTag,
    handleDeleteTag,
  } = useOutletContext();

  return (
    <TagsPanel
      tags={tags}
      newTagName={newTagName}
      onNewTagNameChange={setNewTagName}
      onCreateTag={handleCreateTag}
      onDeleteTag={handleDeleteTag}
      loading={loading}
    />
  );
}
