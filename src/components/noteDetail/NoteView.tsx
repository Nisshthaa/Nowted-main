 import { Archive,
  Calendar,
  CircleEllipsis,
  FileText,
  Folder,
  History,
  Star,
  Trash,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import type { FullNote } from "../types/dataTypes";
import { deleteNote, getNotesData, updateNote } from "../../api/noteAPI";
import { useAppState } from "../../state/useAppState";
import NoteForm from "./NoteForm";
import { showConfirm, showError, showSuccess } from "../utils/notifications";
import RestoreNote from "./RestoreNote";
import { NoteViewSkeleton } from "../Loader/LoadData";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const NoteView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedNoteId,
    activeNoteMode,
    setRefreshNotes,
    setActiveNoteMode,
    setSelectedNoteId,
    
  } = useAppState();

  const [fullNote, setfullNote] = useState<FullNote | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef<string | null>(null);

  const { noteId } = useParams();

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

        setfullNote((prev) =>
          prev ? { ...prev, deletedAt: deletedAtTime } : prev
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

      setfullNote((prev) => (prev ? { ...prev, isFavorite: updatedValue } : prev));

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const id = noteId || selectedNoteId;

    if (!id) return;

    const fetchNotes = async () => {
      try {
        setLoadingNote(true);
        setfullNote(null);

        const res = await getNotesData(id);
        const note = res.data.note;
        setfullNote(note);
        noteIdRef.current = note.id;

        if (note.deletedAt) {
          setActiveNoteMode("restore");
        } else if (activeNoteMode === "restore") {
          setActiveNoteMode("view");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingNote(false);
      }
    };

    fetchNotes();
  }, [noteId, selectedNoteId, activeNoteMode, setActiveNoteMode]);

const debouncedSave = useCallback((data: { title?: string; content?: string }) => {
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  debounceTimer.current = setTimeout(async () => {
    if (noteIdRef.current) {
      try {
        setIsSaving(true);
        await updateNote(noteIdRef.current, data);
        setRefreshNotes((prev) => !prev);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  }, 1500);
}, [setRefreshNotes]);

  if (activeNoteMode === "create") return <NoteForm />;

  if (location.pathname.includes("/create")) return <NoteForm />;

  if (activeNoteMode === "restore" && fullNote && fullNote.deletedAt && (noteId || selectedNoteId)) {
    return <RestoreNote noteId={fullNote.id} noteTitle={fullNote.title} />;
  }

  if (!selectedNoteId) {
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
  }

  if (loadingNote) return <NoteViewSkeleton />;
  if (!fullNote)
    return (
      <div className="p-10 text-(--text-primary)">
        No note found or still loading...
      </div>
    );

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--panel-bg)">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
 

          <input
            className="text-(--text-primary) text-3xl font-semibold bg-transparent outline-none"
            value={fullNote.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setfullNote((prev) => (prev ? { ...prev, title: newTitle } : prev));
              debouncedSave({ title: newTitle });
            }}
          />

          <div ref={menuRef} className="relative flex gap-15 items-center justify-center">
            {fullNote.isFavorite && (
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            )}
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
                      <Star className="w-5 h-5 text-(--text-primary) flex-shrink-0" />
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
                      <Archive className="w-5 h-5 text-(--text-primary) flex-shrink-0" />
                      <p className="text-(--text-primary) whitespace-nowrap">
                        {fullNote?.isArchived ? "Unarchive" : "Archive"}
                      </p>
                    </div>

                    <hr className="border-(--border-color)" />

                    <div
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                      onClick={handleDelete}
                    >
                      <Trash className="w-5 h-5 text-(--text-primary) flex-shrink-0" />
                      <p className="text-(--text-primary) whitespace-nowrap">Delete</p>
                    </div>
                  </>
                ) : (
                  <div
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-(--hover-bg)"
                    onClick={handleRestore}
                  >
                    <History className="w-5 h-5 text-(--text-primary) flex-shrink-0" />
                    <p className="text-(--text-primary) whitespace-nowrap">Restore</p>
                  </div>
                )}
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
              {new Date(fullNote.createdAt).toLocaleDateString("en-GB")}
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
      </div>

      <textarea
        className="flex-1 w-full bg-(--sidebar-bg) text-(--text-primary) text-s  outline-none resize-none"
        value={fullNote.content}
        onChange={(e) => {
          const newContent = e.target.value;
          setfullNote((prev) => (prev ? { ...prev, content: newContent } : prev));
          debouncedSave({ content: newContent });
        }}
      />
    </div>
  );
};

export default NoteView;



