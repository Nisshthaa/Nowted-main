import React, { useEffect, useRef, useMemo } from "react";
import { formatDate, getPreview } from "../utils/helpers";
import { useApp } from "../../context/useApp";
import type { GetNotesParams } from "../types";
import { useNoteActions } from "../../hooks/useNoteActions";
import { useURLState } from "../../hooks/useURLState";
import { useNotesPagination } from "../../hooks/useNotesPagination";

const Notes: React.FC = () => {
  const { openNote } = useNoteActions();
  const { refreshNotes } = useApp();
  const {
    selectedFolder,
    selectedNoteId,
    activeView,
    setSelectedNoteId,
    setActiveNoteMode,
  } = useApp();
  
  const { noteId, updateURL } = useURLState();

  const filters: GetNotesParams = useMemo(() => {
    if (activeView === "favorites") return { favorite: true };
    if (activeView === "archived") return { archived: true };
    if (activeView === "trash") return { deleted: "true" };
    if (selectedFolder)
      return { folderId: selectedFolder.id, deleted: "false" };
    return {};
  }, [activeView, selectedFolder]);


  const { notes, loading, hasMore, fetchNextPage } = useNotesPagination(
    filters,
    refreshNotes,
  );
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = loaderRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [hasMore, loading, fetchNextPage]);

 useEffect(() => {
  if (!noteId) return;

  setSelectedNoteId((current) => {
    if (current === noteId) return current;
    setActiveNoteMode("view");
    return noteId;
  });
}, [noteId, setActiveNoteMode, setSelectedNoteId]);

  return (
    <div className="flex flex-col w-100 h-screen  p-4 gap-5 bg-(--panel-bg) ">
      <h3
        className="w-full min-w-0 sticky font-semibold text-(--text-primary) text-2xl line-clamp-2  "
        style={{ fontFamily: "var(--font-primary)" }}
      >
        {activeView === "favorites"
          ? "Favorites"
          : activeView === "archived"
            ? "Archived"
            : activeView === "trash"
              ? "Trash"
              : selectedFolder?.name || "Select Folder"}
      </h3>

     <div className="overflow-y-auto flex flex-col gap-5 pb-7.5 " >
       {notes.map((note) => (
        <div
          key={note.id}
          onClick={(e) => {
            e.stopPropagation();
            if (activeView === "trash") {
              setSelectedNoteId(note.id);
              setActiveNoteMode("restore");
              return;
            } else if (
              activeView === "archived" ||
              activeView === "favorites"
            ) {
              setSelectedNoteId(note.id);

              updateURL({
                note: note.id,
                folder: null,
                view: activeView,
              });

              setActiveNoteMode("view");
              return;
            }

            openNote(note.id, note.folderId ?? "");

            setActiveNoteMode("view");
          }}
          className={`flex flex-col w-full p-4 gap-2 rounded-lg cursor-pointer transition-all duration-200  border border-(--border-color) ${
            selectedNoteId === note.id
              ? "bg-(--hover-bg)"
              : "bg-(--card-bg) hover:bg-(--hover-bg)"
          }`}
        >
          <p className="font-semibold text-(--text-primary) text-[18px] truncate">
            {getPreview(note.title)}
          </p>

          <div className="flex gap-4">
            <span className="text-(--text-secondary) text-m">
              {formatDate(note.createdAt)}
            </span>
            <span className="text-(--text-secondary) text-m">
              {getPreview(note.preview)}
            </span>
          </div>
        </div>
      ))}

      {!loading && notes.length === 0 && (
        <p className="text-center text-(--text-secondary)">No notes found</p>
      )}

      <div ref={loaderRef} style={{ height: "20px" }} />

      {loading && (
        <p className="text-center text-(--text-primary)">Loading...</p>
      )}
      {!hasMore && notes.length > 0 && (
        <p className="text-center text-(--text-secondary)">No more notes</p>
      )}
     </div>
    </div>
  );
};

export default Notes;
