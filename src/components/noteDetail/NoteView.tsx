import {
  Archive,
  Calendar,
  CircleEllipsis,
  FileText,
  Folder,
  Star,
  Trash,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FullNote } from "../types/dataTypes";
import { deleteNote, getNotesData, updateNote } from "../../api/noteAPI";
import {
  buildFolderPath,
  buildViewPath,
  formatDate,
  parseRouteState,
} from "../utils/urlHelpers";
import { useAppState } from "../../state/useAppState";
import NoteForm from "./NoteForm";
import { showConfirm, showError, showSuccess } from "../utils/notifications";
import RestoreNote from "./RestoreNote";
import { NoteViewSkeleton } from "../Loader/LoadData";

const NoteView: React.FC = () => {
  const {
    selectedNoteId,
    activeNoteMode,
    setRefreshNotes,
    setSelectedNoteId,
    setActiveNoteMode,
    selectedFolder,
    activeView,
  } = useAppState();

  const [fullNote, setFullNote] = useState<FullNote | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { noteId } = parseRouteState(location.pathname);

  useEffect(() => {
    if (!noteId) return;
    setSelectedNoteId(noteId);
    setActiveNoteMode(activeView === "trash" ? "restore" : "view");
  }, [activeView, noteId, setActiveNoteMode, setSelectedNoteId]);

  const clearSelectionFromRoute = () => {
    if (activeView && activeView !== "all") {
      navigate(buildViewPath(activeView));
      return;
    }

    if (selectedFolder) {
      navigate(buildFolderPath(selectedFolder.name, selectedFolder.id));
      return;
    }

    navigate("/");
  };

  const handleArchive = async () => {
    if (!fullNote) return;

    try {
      const updatedValue = !fullNote.isArchived;

      await updateNote(fullNote.id, { isArchived: updatedValue });

      setShowMenu(false);
      setFullNote((prev) => (prev ? { ...prev, isArchived: updatedValue } : prev));
      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(null);
      setFullNote(null);
      clearSelectionFromRoute();

      showSuccess(updatedValue ? "Note archived!" : "Note unarchived!");
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
        setRefreshNotes((prev) => !prev);
        setSelectedNoteId(null);
        setFullNote(null);
        clearSelectionFromRoute();

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
      setFullNote((prev) => (prev ? { ...prev, isFavorite: updatedValue } : prev));
      setRefreshNotes((prev) => !prev);

      showSuccess(updatedValue ? "Added to favorites!" : "Removed from favorites!");
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

    const fetchNote = async () => {
      try {
        setLoadingNote(true);
        setFullNote(null);
        const res = await getNotesData(selectedNoteId);
        setFullNote(res.data.note);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingNote(false);
      }
    };

    fetchNote();
  }, [selectedNoteId]);

  if (activeNoteMode === "create") return <NoteForm />;

  if (activeNoteMode === "restore" && fullNote && selectedNoteId) {
    return <RestoreNote noteId={fullNote.id} noteTitle={fullNote.title} />;
  }

  if (!selectedNoteId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-(--sidebar-bg)">
        <FileText className="w-20 h-20 text-(--text-primary)" strokeWidth={1} />
        <p className="text-(--text-primary) text-3xl font-semibold">Select a note to view</p>
        <div className="flex flex-col gap-1">
          <p className="text-(--text-secondary) text-m text-center">
            Choose a note from the list on the left to view its contents, or create a
          </p>
          <p className="text-(--text-secondary) text-m text-center">
            new note to add to your collection.
          </p>
        </div>
      </div>
    );
  }

  if (loadingNote) return <NoteViewSkeleton />;

  if (!fullNote) {
    return <div className="p-10 text-(--text-primary)">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--panel-bg)">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <h3 className="text-(--text-primary) text-3xl font-semibold">{fullNote.title}</h3>

          <div ref={menuRef} className="relative flex gap-15 justify-center">
            {fullNote.isFavorite && (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            )}
            <CircleEllipsis
              className="text-(--text-secondary) w-9 h-9 cursor-pointer"
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
                    {fullNote.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </p>
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                  onClick={handleArchive}
                >
                  <Archive className="w-5 h-5 text-(--text-primary)" />
                  <p className="text-(--text-primary)">
                    {fullNote.isArchived ? "Unarchive" : "Archive"}
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

            <p className="text-(--text-primary)">{formatDate(fullNote.createdAt)}</p>
          </div>

          <hr className="border-(--border-color)" />

          <div className="flex gap-25 max-w-md">
            <div className="flex gap-6 items-center">
              <Folder className="w-5 h-5 text-(--text-secondary)" />
              <p className="text-(--text-secondary)">Folder</p>
            </div>

            <p className="text-(--text-primary)">{fullNote.folder?.name || "Unknown Folder"}</p>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto border border-(--border-color) rounded-lg p-6 text-(--text-primary) bg-(--sidebar-bg) text-[16px] leading-relaxed"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {fullNote.content}
      </div>
    </div>
  );
};

export default NoteView;
