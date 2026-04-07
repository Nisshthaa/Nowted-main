import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type { Note } from "../types";
import { getRecentFolders } from "../../Api/folders";
import { useApp } from "../../context/useApp";
import { useNoteActions } from "../../hooks/useNoteActions";

const Recent: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { openNote } = useNoteActions();

  const { setSelectedFolder, selectedNoteId, folders } = useApp();


  useEffect(() => {
    const getRecent = async () => {
      try {
        const response = await getRecentFolders();
        setNotes(response.data.recentNotes);
      } catch (err) {
        console.log(err);
      }
    };

    getRecent();
  }, []);

  return (
    <div className="flex flex-col h-35 gap-1">
      {/* Header */}
      <div className="flex justify-between items-center h-5">
        <p className="text-(--text-heading) px-2 font-semibold text-[17px]">
          Recents
        </p>
      </div>

      {/* Notes */}
      {notes.map((note) => {
        const isActive = selectedNoteId === note.id;

        return (
          <div
            key={note.id}
            className={`group flex items-center gap-3 w-full h-12 px-2 py-1 rounded-md cursor-pointer transition-all ${
              isActive ? "bg-(--accent)" : "hover:bg-(--hover-bg)"
            }`}
            onClick={() => {
              const folderId = note.folderId ?? "";
              const folderName = folders.find(
                (f) => f.id === note.folderId,
              )?.name;

              setSelectedFolder({
                id: folderId,
                name: folderName || "Unknown Folder",
              });

              openNote(note.id, folderId);
            }}
          >
            {/* Icon */}
            <FileText
              className={`w-5 h-5 ${
                isActive
                  ? "text-white"
                  : "text-(--text-secondary) group-hover:text-(--text-primary)"
              }`}
            />

            {/* Title */}
            <p
              className={`font-semibold text-[18px] ${
                isActive
                  ? "text-white  "
                  : "text-(--text-secondary) group-hover:text-(--text-primary)"
              }`}
            >
              {note.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Recent;
