import {
  Archive,
  Calendar,
  CircleEllipsis,
  FileText,
  Folder,
  Star,
  Trash,
} from "lucide-react";
<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
import type { FullNote } from "../types/dataTypes";
import {  deleteNote, getNotesData, updateNote } from "../../api/noteAPI";
import { buildFolderPath, buildViewPath, formatDate, parseRouteState } from "../utils/urlHelpers";
import { useAppState } from "../../state/useAppState";
import NoteForm from "./NoteForm";
import {  showConfirm, showError, showSuccess } from "../utils/notifications";
import { useLocation, useNavigate } from "react-router-dom";
import RestoreNote from "./RestoreNote";
import { NoteViewSkeleton } from "../Loader/LoadData";
=======
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
>>>>>>> test

const NoteView: React.FC = () => {
  const {
    selectedNoteId,
<<<<<<< HEAD

    activeNoteMode,
    setRefreshNotes,
    setSelectedNoteId,
  } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = parseRouteState(location.pathname);

  const clearSelectedNotePath = () => {
    if (routeState.view) {
      navigate(buildViewPath(routeState.view));
      return;
    }

    if (routeState.folderId) {
      navigate(buildFolderPath(routeState.folderName ?? "folder", routeState.folderId));
=======
    activeNoteMode,
    setRefreshNotes,
    setSelectedNoteId,
    setActiveNoteMode,
    selectedFolder,
    activeView,
  } = useAppState();

  const [fullNote, setFullNote] = useState<FullNote | null>(null);
  const [showMenu, setShowMenu] = useState(false);
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
>>>>>>> test
      return;
    }

    navigate("/");
  };

<<<<<<< HEAD
  const [fullNote, setfullNote] = useState<FullNote | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);

  useEffect(() => {
    const init = () => {
      if (!selectedNoteId) {
        setfullNote(null);
      }
    };
    init();
  }, [selectedNoteId]);
=======
>>>>>>> test
  const handleArchive = async () => {
    if (!fullNote) return;

    try {
      const updatedValue = !fullNote.isArchived;

      await updateNote(fullNote.id, { isArchived: updatedValue });

      setShowMenu(false);
<<<<<<< HEAD
      setfullNote((prev) =>
        prev ? { ...prev, isArchived: updatedValue } : prev,
      );
      clearSelectedNotePath();
      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(null);
      setfullNote(null);

      if (updatedValue) {
        showSuccess("Note Archived!");
      } else {
        showSuccess("Note Unarchived!");
      }
=======
      setFullNote((prev) => (prev ? { ...prev, isArchived: updatedValue } : prev));
      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(null);
      setFullNote(null);
      clearSelectionFromRoute();

      showSuccess(updatedValue ? "Note archived!" : "Note unarchived!");
>>>>>>> test
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
<<<<<<< HEAD
        clearSelectedNotePath();
        setRefreshNotes((prev) => !prev);
        setSelectedNoteId(null);
        setfullNote(null);
=======
        setRefreshNotes((prev) => !prev);
        setSelectedNoteId(null);
        setFullNote(null);
        clearSelectionFromRoute();
>>>>>>> test

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
<<<<<<< HEAD

      setShowMenu(false);

      setfullNote((prev) =>
        prev ? { ...prev, isFavorite: updatedValue } : prev,
      );
      setSelectedNoteId(null);
      setfullNote(null);

      clearSelectedNotePath();
      setRefreshNotes((prev) => !prev);

      showSuccess(
        updatedValue ? "Added to Favorites!" : "Removed from Favorites!",
      );
=======
      setShowMenu(false);
      setFullNote((prev) => (prev ? { ...prev, isFavorite: updatedValue } : prev));
      setRefreshNotes((prev) => !prev);

      showSuccess(updatedValue ? "Added to favorites!" : "Removed from favorites!");
>>>>>>> test
    } catch {
      showError("Failed to update favorite");
    }
  };
<<<<<<< HEAD
=======

>>>>>>> test
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
<<<<<<< HEAD

=======
>>>>>>> test
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!selectedNoteId) return;

<<<<<<< HEAD
    const fetchNotes = async () => {
      try {
        setLoadingNote(true); 
        setfullNote(null);
        const res = await getNotesData(selectedNoteId);
        setfullNote(res.data.note);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingNote(false);
      }
    };

    fetchNotes();
  }, [selectedNoteId]);

  if (activeNoteMode === "create") return <NoteForm />;
  if (activeNoteMode === "restore" && fullNote && selectedNoteId)
    return <RestoreNote noteId={fullNote.id} noteTitle={fullNote.title} />;

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
=======
    const fetchNote = async () => {
      try {
        setFullNote(null);
        const res = await getNotesData(selectedNoteId);
        setFullNote(res.data.note);
      } catch (err) {
        console.log(err);
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
>>>>>>> test
            new note to add to your collection.
          </p>
        </div>
      </div>
    );
<<<<<<< HEAD

  if (loadingNote) return <NoteViewSkeleton />;

  if (!fullNote)
    return <div className="p-10  text-(--text-primary)">Loading...</div>;
=======
  }

  if (!fullNote) {
    return <div className="p-10 text-(--text-primary)">Loading...</div>;
  }
>>>>>>> test

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--panel-bg)">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
<<<<<<< HEAD
          <h3 className="text-(--text-primary) text-3xl font-semibold">
            {fullNote.title}
          </h3>
=======
          <h3 className="text-(--text-primary) text-3xl font-semibold">{fullNote.title}</h3>
>>>>>>> test

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
<<<<<<< HEAD
                    {fullNote?.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
=======
                    {fullNote.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
>>>>>>> test
                  </p>
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                  onClick={handleArchive}
                >
                  <Archive className="w-5 h-5 text-(--text-primary)" />
                  <p className="text-(--text-primary)">
<<<<<<< HEAD
                    {fullNote?.isArchived ? "Unarchive" : "Archive"}
=======
                    {fullNote.isArchived ? "Unarchive" : "Archive"}
>>>>>>> test
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

<<<<<<< HEAD
            <p className="text-(--text-primary)">
              {formatDate(fullNote.createdAt)}
            </p>
=======
            <p className="text-(--text-primary)">{formatDate(fullNote.createdAt)}</p>
>>>>>>> test
          </div>

          <hr className="border-(--border-color)" />

          <div className="flex gap-25 max-w-md">
            <div className="flex gap-6 items-center">
              <Folder className="w-5 h-5 text-(--text-secondary)" />
              <p className="text-(--text-secondary)">Folder</p>
            </div>

<<<<<<< HEAD
            <p className="text-(--text-primary)">
              {fullNote.folder?.name || "Unknown Folder"}
            </p>
=======
            <p className="text-(--text-primary)">{fullNote.folder?.name || "Unknown Folder"}</p>
>>>>>>> test
          </div>
        </div>
      </div>

      <div
<<<<<<< HEAD
        className="flex-1 overflow-y-auto  border border-(--border-color) rounded-lg p-6 text-(--text-primary) bg-(--sidebar-bg) text-[16px] leading-relaxed"
=======
        className="flex-1 overflow-y-auto border border-(--border-color) rounded-lg p-6 text-(--text-primary) bg-(--sidebar-bg) text-[16px] leading-relaxed"
>>>>>>> test
        style={{ whiteSpace: "pre-wrap" }}
      >
        {fullNote.content}
      </div>
    </div>
  );
};

export default NoteView;
