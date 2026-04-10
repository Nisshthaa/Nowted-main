import { Calendar, Folder, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppState } from "../../state/useAppState";
import { createNote } from "../../api/noteAPI";
import { showError, showSuccess } from "../utils/notifications";
import { useNavigate, useLocation } from "react-router-dom";

const NoteForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedFolder,
    setActiveNoteMode,
    setRefreshNotes,
  } = useAppState();

  const handleCreate = async () => {
    if (!title || !content || !selectedFolder) {
      return showError("Invalid details!");
    }

    try {
      await createNote({
        title,
        content,
        folderId: selectedFolder.id,
      });

      setRefreshNotes((prev) => !prev);
      setActiveNoteMode("view");

      // Navigate back to folder or base path
      if (location.pathname.includes("/create")) {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        if (pathSegments[0] === "create") {
          // Global create, navigate to root
          navigate("/");
        } else {
          // Folder create, navigate back to folder
          const folderName = pathSegments[0];
          const folderId = pathSegments[1];
          navigate(`/${folderName}/${folderId}`);
        }
      }

      showSuccess("Note created successfully!");
    } catch {
      showError("Failed to create note!");
    }
  };

  useEffect(() => {
    const init=()=>{
      setTitle("");
    setContent("");
    }
    init()
  }, [selectedFolder]);

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--sidebar-bg)">
      <input
        className="text-3xl font-semibold text-(--text-primary) bg-transparent outline-none border-b border-(--border-color) pb-2"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between max-w-md">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-(--text-secondary)" />
            <p className="text-(--text-secondary)">Date</p>
          </div>

          <p className="text-(--text-primary)">
            {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        <hr className="border-(--border-color)" />

        <div className="flex justify-between max-w-md">
          <div className="flex items-center gap-3">
            <Folder className="w-5 h-5 text-(--text-secondary)" />
            <p className="text-(--text-secondary)">Folder</p>
          </div>

          <p className="text-(--text-primary)">{selectedFolder?.name}</p>
        </div>
      </div>

      <textarea
        className="flex-1 bg-(--card-bg) border border-(--border-color) rounded-lg p-5 text-(--text-primary) outline-none resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />

      <button
        className="flex items-center justify-center gap-2 w-40 h-10 bg-(--btn-bg) hover:bg-(--btn-hover) text-(--text-primary) rounded-md transition-all cursor-pointer"
        onClick={handleCreate}
      >
        <Plus className="w-5 h-5" /> Add Note
      </button>
    </div>
  );
};

export default NoteForm;
