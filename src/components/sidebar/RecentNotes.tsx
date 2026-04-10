import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type { Note } from "../types/dataTypes";
import { getRecentFolders } from "../../api/folderAPI";
import { useAppState } from "../../state/useAppState";
import { RecentNotesSkeleton } from "../Loader/LoadData";
import { useNavigate } from "react-router-dom";

const RecentNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const navigate = useNavigate();

  const {
    setSelectedFolder,
    selectedNoteId,
    folders,
    setSelectedNoteId,
    setActiveView,
    setActiveNoteMode,
  } = useAppState();

  useEffect(() => {
    const getRecent = async () => {
      try {
        setLoadingRecent(true);
        const response = await getRecentFolders();
        setNotes(response.data.recentNotes);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRecent(false);
      }
    };

    getRecent();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center h-5">
        <p className="text-(--text-heading) px-2 font-semibold text-[18px]">
          Recents
        </p>
      </div>

      {loadingRecent && <RecentNotesSkeleton />}

      {!loadingRecent &&
        notes.map((note) => {
          const isActive = selectedNoteId === note.id;

          return (
            <div
              key={note.id}
              className={`group flex items-center gap-2 w-full h-12.5 px-1 py-1 rounded-md cursor-pointer transition-all ${
                isActive ? "bg-(--accent)" : "hover:bg-(--hover-bg)"
              }`}
              onClick={() => {
                const folderId = note.folderId ?? "";

                const folder = folders.find(
                  (f) => f.id === note.folderId
                );

                const folderName = folder?.name || "Unknown Folder";

                setSelectedFolder({
                  id: folderId,
                  name: folderName,
                });

                setSelectedNoteId(note.id);
                setActiveView("all");
                setActiveNoteMode("view");

                navigate(
                  `/${encodeURIComponent(folderName)}/${folderId}/${encodeURIComponent(note.title)}/${note.id}`
                );
              }}
            >
              <FileText
                className={`w-6 h-6 ${
                  isActive
                    ? "text-white"
                    : "text-(--text-secondary) group-hover:text-(--text-primary)"
                }`}
              />

              <p
                className={`font-semibold text-[18px] ${
                  isActive
                    ? "text-white"
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

export default RecentNotes;