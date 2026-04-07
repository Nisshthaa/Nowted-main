import {
  Archive,
  Calendar,
  CircleEllipsis,
  FileText,
  Folder,
  Star,
  Trash,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { FullNote } from "../types";
import {  deleteNote, getNotesData, updateNote } from "../../Api/notes";
import { formatDate } from "../utils/helpers";
import { useApp } from "../../context/useApp";
import CreateNoteForm from "./CreateNoteForm";
import {  showConfirm, showError, showSuccess } from "../utils/toaster";
import { useURLState } from "../../hooks/useURLState";
import Restore from "./Restore";

const NotesDetails: React.FC = () => {
  const {
    selectedNoteId,

    activeNoteMode,
    setRefreshNotes,
    setSelectedNoteId,
  } = useApp();

  const { updateURL } = useURLState();

  const [fullNote, setfullNote] = useState<FullNote | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init = () => {
      if (!selectedNoteId) {
        setfullNote(null);
      }
    };
    init();
  }, [selectedNoteId]);
  const handleArchive = async () => {
    if (!fullNote) return;

    try {
      const updatedValue = !fullNote.isArchived;

      await updateNote(fullNote.id, { isArchived: updatedValue });

      setShowMenu(false);
      setfullNote((prev) =>
        prev ? { ...prev, isArchived: updatedValue } : prev,
      );
      updateURL({ note: null });
      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(null);
      setfullNote(null);

      if (updatedValue) {
        showSuccess("Note Archived!");
      } else {
        showSuccess("Note Unarchived!");
      }
    } catch {
      showError("Failed to update archive");
    }
  };

  const handleDelete = () => {
    if (!fullNote) return;

    showConfirm("Move this note to Trash?", async () => {
      try {
        await deleteNote(fullNote.id, {
          deletedAt: new Date().toISOString(),
        });

        setShowMenu(false);
        updateURL({ note: null });
        setRefreshNotes((prev) => !prev);
        setSelectedNoteId(null);
        setfullNote(null);

        showSuccess("Moved to Trash!");
      } catch {
        showError("Delete failed");
      }
    });
  };

  const handleFavorite = async () => {
    if (!fullNote) return;

    try {
      const updatedValue = !fullNote.isFavorite;

      await updateNote(fullNote.id, { isFavorite: updatedValue });

      setShowMenu(false);

      setfullNote((prev) =>
        prev ? { ...prev, isFavorite: updatedValue } : prev,
      );
      setSelectedNoteId(null);
      setfullNote(null);

      updateURL({ note: null });
      setRefreshNotes((prev) => !prev);

      showSuccess(
        updatedValue ? "Added to Favorites!" : "Removed from Favorites!",
      );
    } catch {
      showError("Failed to update favorite");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!selectedNoteId) return;

    const fetchNotes = async () => {
      try {
        setfullNote(null);
        const res = await getNotesData(selectedNoteId);
        setfullNote(res.data.note);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotes();
  }, [selectedNoteId]);

  if (activeNoteMode === "create") return <CreateNoteForm />;
  if (activeNoteMode === "restore" && fullNote && selectedNoteId)
    return <Restore noteId={fullNote.id} noteTitle={fullNote.title} />;

  if (!selectedNoteId)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-(--sidebar-bg)">
        <FileText className="w-20 h-20 text-(--text-primary)" strokeWidth={1} />
        <p className="text-(--text-primary) text-3xl font-semibold">
          Select a note to view
        </p>
        <div className="flex flex-col gap-1">
          <p className="text-(--text-secondary) text-m text-center ">
            Choose a note from the list on the left to view its contents, or
            create a
          </p>
          <p className="text-(--text-secondary) text-m text-center ">
            new note to add to your collection.
          </p>
        </div>
      </div>
    );

  if (!fullNote)
    return <div className="p-10  text-(--text-primary)">Loading...</div>;

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--panel-bg)">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <h3 className="text-(--text-primary) text-3xl font-semibold">
            {fullNote.title}
          </h3>

          <div ref={menuRef} className="relative flex gap-15 justify-center">
            {fullNote.isFavorite && (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            )}
            <CircleEllipsis
              className="text-(--text-secondary) w-6 h-6 cursor-pointer"
              onClick={() => setShowMenu((prev) => !prev)}
            />

            {showMenu && (
              <div className="absolute right-0 top-10 flex flex-col w-52 bg-(--card-bg) border border-(--border-color) rounded-lg shadow-md p-3 gap-2">
                <div
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                  onClick={handleFavorite}
                >
                  <Star className="w-5 h-5 text-(--text-primary)" />
                  <p className="text-(--text-primary)">
                    {fullNote?.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </p>
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                  onClick={handleArchive}
                >
                  <Archive className="w-5 h-5 text-(--text-primary)" />
                  <p className="text-(--text-primary)">
                    {fullNote?.isArchived ? "Unarchive" : "Archive"}
                  </p>
                </div>

                <hr className="border-(--border-color)" />

                <div
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                  onClick={handleDelete}
                >
                  <Trash className="w-5 h-5 text-(--text-primary)" />
                  <p className="text-(--text-primary)">Delete</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-25 max-w-md">
            <div className="flex gap-6 items-center">
              <Calendar className="w-5 h-5 text-(--text-secondary)" />
              <p className="text-(--text-secondary)">Date</p>
            </div>

            <p className="text-(--text-primary)">
              {formatDate(fullNote.createdAt)}
            </p>
          </div>

          <hr className="border-(--border-color)" />

          <div className="flex gap-25 max-w-md">
            <div className="flex gap-6 items-center">
              <Folder className="w-5 h-5 text-(--text-secondary)" />
              <p className="text-(--text-secondary)">Folder</p>
            </div>

            <p className="text-(--text-primary)">
              {fullNote.folder?.name || "Unknown Folder"}
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto  border border-(--border-color) rounded-lg p-6 text-(--text-primary) bg-(--sidebar-bg) text-[16px] leading-relaxed"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {fullNote.content}
      </div>
    </div>
  );
};

export default NotesDetails;
