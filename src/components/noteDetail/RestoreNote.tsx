import { History } from "lucide-react";
import React from "react";
import { useAppState } from "../../state/useAppState";
import { restoreNote } from "../../api/noteAPI";
import { showError, showSuccess } from "../utils/notifications";
import type { RestoreProps } from "../types/dataTypes";
import { getFoldersData } from "../../api/folderAPI";

const RestoreNote: React.FC<RestoreProps> = ({ noteId, noteTitle }) => {
  const {
    setRefreshNotes,
    setSelectedNoteId,
    setActiveView,
    setActiveNoteMode,
    setFolders,
    selectedFolder,
  } = useAppState();

  const handleRestore = async () => {
    if (!noteId) return;

    try {
      await restoreNote(noteId);


      const response = await getFoldersData();
      setFolders(response.data.folders);
      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(noteId);
      setActiveNoteMode("view");

      if (selectedFolder?.id) {
        setActiveView("all");
      }

      showSuccess("Note Restored!");
    } catch (err) {
      console.log(err);
      showError("Restore failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-(--sidebar-bg) text-center px-4">
      <History className="w-20 h-20 text-(--text-primary)" strokeWidth={1} />

      <p className="text-2xl font-semibold text-(--text-primary)">
        Restore {noteTitle}
      </p>

      <div className="flex flex-col gap-1 ">
        <p className="text-(--text-secondary)">
          Don't want to lose this note? It's not too late! Just click the
          'Restore'
        </p>
        <p className="text-(--text-secondary)">
          button and it will be added back to your list. It's that simple.
        </p>
      </div>

      <button
        className="flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-(--accent) hover:bg-(--accent-hover) text-white transition-all cursor-pointer"
        onClick={handleRestore}
      >
        Restore
      </button>
    </div>
  );
};

export default RestoreNote;
