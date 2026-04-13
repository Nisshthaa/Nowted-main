import {
  Archive,
  Calendar,
  CircleEllipsis,
  Folder,
  History,
  Star,
  Trash,
} from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppState } from "../../state/useAppState";
import { createNote, updateNote, deleteNote, getNotesData } from "../../api/noteAPI";
import { showError, showConfirm, showSuccess } from "../utils/notifications";
import { useNavigate, useLocation } from "react-router-dom";
import type { FullNote } from "../types/dataTypes";

const NoteForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [fullNote, setFullNote] = useState<FullNote | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedFolder,
    setActiveNoteMode,
    setRefreshNotes,
    setSelectedNoteId,
  } = useAppState();

  const handleArchive = async () => {
    if (!fullNote) return;

    try {
      const updatedValue = !fullNote.isArchived;
      await updateNote(fullNote.id, { isArchived: updatedValue });

      setShowMenu(false);
      setRefreshNotes((prev) => !prev);
      setActiveNoteMode("view");

      setSelectedNoteId(null);

      showSuccess(updatedValue ? "Note Archived!" : "Note Unarchived!");
    } catch {
      showError("Failed to update archive");
    }
  };

  const handleDelete = () => {
    if (!fullNote) return;

    showConfirm("Move this note to Trash?", async () => {
      try {
        const deletedAtTime = new Date().toISOString();
        await deleteNote(fullNote.id, {
          deletedAt: deletedAtTime,
        });

        setFullNote((prev) =>
          prev ? { ...prev, deletedAt: deletedAtTime } : prev,
        );

        setShowMenu(false);
        setRefreshNotes((prev) => !prev);

        setActiveNoteMode("restore");

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

      setFullNote((prev) =>
        prev ? { ...prev, isFavorite: updatedValue } : prev,
      );

      setShowMenu(false);
      setRefreshNotes((prev) => !prev);
      setActiveNoteMode("view");

      if (!updatedValue && location.pathname.includes("/favorites")) {
        setSelectedNoteId(null);
        navigate("/favorites");
      }

      showSuccess(
        updatedValue ? "Added to Favorites!" : "Removed from Favorites!",
      );
    } catch {
      showError("Failed to update favorite");
    }
  };

  const handleRestore = () => {
    if (!fullNote) return;
    setShowMenu(false);
    setActiveNoteMode("restore");
  };

  
  
  const debouncedSave = useCallback(
    async (titleValue: string, contentValue: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!titleValue.trim() || !contentValue.trim() || !selectedFolder) {
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          setIsSaving(true);

          if (!noteIdRef.current) {
            const res = await createNote({
              title: titleValue,
              content: contentValue,
              folderId: selectedFolder.id,
             
            });
            const newNoteId = res.data.id;
            noteIdRef.current = newNoteId;

            const noteRes = await getNotesData(newNoteId);
            setFullNote(noteRes.data.note);

            setRefreshNotes((prev) => !prev);
          } else {
            await updateNote(noteIdRef.current, {
              title: titleValue,
              content: contentValue,
            });
            const noteRes = await getNotesData(noteIdRef.current);
            setFullNote(noteRes.data.note);

            setRefreshNotes((prev) => !prev);
          }
        } catch (err) {
          console.error(err);
          showError("Failed to save note!");
        } finally {
          setIsSaving(false);
        }
      }, 500);
    },
    [selectedFolder, setRefreshNotes]
  );


  useEffect(() => {
    const init = () => {
      setTitle("");
      setContent("");
      noteIdRef.current = null;
      setFullNote(null);
    };
    init();
  }, [selectedFolder]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--sidebar-bg)">
      <div className="flex justify-between items-start">
        <input
          className="text-3xl font-semibold text-(--text-primary) bg-transparent outline-none border-b border-(--border-color) pb-2"
          placeholder="Enter title..."
          value={title}
          onChange={(e)=>{const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content);}}
        />

        <div
          ref={menuRef}
          className="relative flex gap-15 items-center justify-center"
        >
          {fullNote?.isFavorite && (
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          )}
          {fullNote && (
            <>
              <CircleEllipsis
                className="text-(--text-secondary) w-9 h-9 cursor-pointer"
                onClick={() => setShowMenu((prev) => !prev)}
              />

              {showMenu && (
                <div className="absolute right-0 top-10 flex flex-col w-64 bg-(--card-bg) border border-(--border-color) rounded-lg shadow-md p-3 gap-2">
                  {!fullNote?.deletedAt ? (
                    <>
                      <div
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                        onClick={handleFavorite}
                      >
                        <Star className="w-5 h-5 text-(--text-primary) shrink-0" />
                        <p className="text-(--text-primary) whitespace-nowrap">
                          {fullNote?.isFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                        onClick={handleArchive}
                      >
                        <Archive className="w-5 h-5 text-(--text-primary) shrink-0" />
                        <p className="text-(--text-primary) whitespace-nowrap">
                          {fullNote?.isArchived ? "Unarchive" : "Archive"}
                        </p>
                      </div>

                      <hr className="border-(--border-color)" />

                      <div
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                        onClick={handleDelete}
                      >
                        <Trash className="w-5 h-5 text-(--text-primary) shrink-0" />
                        <p className="text-(--text-primary) whitespace-nowrap">
                          Delete
                        </p>
                      </div>
                    </>
                  ) : (
                    <div
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                      onClick={handleRestore}
                    >
                      <History className="w-5 h-5 text-(--text-primary) shrink-0" />
                      <p className="text-(--text-primary) whitespace-nowrap">
                        Restore
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

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

        {isSaving && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-(--card-bg) border border-(--border-color)">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-(--accent) rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-(--accent) rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-(--accent) rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-(--text-primary) text-base font-semibold">Saving...</p>
          </div>
        )}
      </div>

      <textarea
        className="flex-1 bg-(--card-bg) border border-(--border-color) rounded-lg p-5 text-(--text-primary) outline-none resize-none"
        value={content}
        onChange={(e)=>{
           const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(title, newContent);
        }}
        placeholder="Write your note..."
      />
    </div>
  );
};

export default NoteForm;
