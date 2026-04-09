import React, { useEffect, useRef, useState } from "react";
import {
  formatDate,
  getPreview,
  buildFolderPath,
  buildViewPath,
  parseRouteState,
} from "../utils/urlHelpers";
import { useAppState } from "../../state/useAppState";
import type { GetNotesParams, Note } from "../types/dataTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { getNotes } from "../../api/noteAPI";
import { NoteListSkeleton } from "../Loader/LoadData";

const NotesList: React.FC = () => {
  const { refreshNotes } = useAppState();
  const {
    selectedFolder,
    selectedNoteId,
    activeView,
    setSelectedNoteId,
    setActiveNoteMode,
    setActiveView,
  } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const { noteId } = parseRouteState(location.pathname);
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filters: GetNotesParams = (() => {
    if (activeView === "favorites") return { favorite: true };
    if (activeView === "archived") return { archived: true };
    if (activeView === "trash") return { deleted: "true" };
    if (selectedFolder)
      return { folderId: selectedFolder.id, deleted: "false" };
    return {};
  })();

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let isActive = true;

    const loadNotes = async () => {
      setLoading(true);

      try {
        const res = await getNotes({
          ...filters,
          page: 1,
          limit,
        });

        const data = res.data.notes || res.data.data || [];

        if (!isActive) return;

        setNotes(data);
        setPage(1);

        if (data.length < limit) {
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    setNotes([]);
    setPage(1);
    setHasMore(true);
    loadNotes();

    return () => {
      isActive = false;
    };
  }, [refreshNotes, filtersKey]);

  useEffect(() => {
    const currentRef = loaderRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loading || !hasMore) {
          return;
        }

        setLoading(true);

        try {
          const nextPage = page + 1;
          const res = await getNotes({
            ...filters,
            page: nextPage,
            limit,
          });

          const data = res.data.notes || res.data.data || [];

          setNotes((prev) => [...prev, ...data]);

          if (data.length < limit) {
            setHasMore(false);
          }

          setPage(nextPage);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
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
  }, [hasMore, loading, page, filtersKey]);

  useEffect(() => {
    if (!noteId) return;

    setSelectedNoteId((current) => {
      if (current === noteId) return current;
      setActiveNoteMode(activeView === "trash" ? "restore" : "view");
      return noteId;
    });
  }, [activeView, noteId, setActiveNoteMode, setSelectedNoteId]);

  // Sort notes: for trash view, show recently deleted notes at top
  const sortedNotes = [...notes].sort((a, b) => {
    if (activeView === "trash" && a.deletedAt && b.deletedAt) {
      return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex flex-col w-100 h-screen p-4 gap-5 bg-(--panel-bg)">
      <h3
        className="sticky top-0 z-10 w-full min-w-0 shrink-0 bg-(--panel-bg) py-1 font-semibold text-(--text-primary) text-2xl line-clamp-2"
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

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-7.5">
        {loading && notes.length === 0 && <NoteListSkeleton />}

        {!loading && sortedNotes.map((note) => (
        <div
          key={note.id}
          onClick={(e) => {
            e.stopPropagation();
            if (activeView === "trash") {
              setSelectedNoteId(note.id);
              setActiveNoteMode("restore");
              navigate(buildViewPath("trash", note.id));
              return;
            } else if (
              activeView === "archived" ||
              activeView === "favorites"
            ) {
              setSelectedNoteId(note.id);

              navigate(buildViewPath(activeView, note.id));

              setActiveNoteMode("view");
              return;
            }

            const folderName = selectedFolder?.name || "folder";
            const folderId = note.folderId || selectedFolder?.id || "";

            setSelectedNoteId(note.id);
            setActiveView("all");
            setActiveNoteMode("view");
            navigate(buildFolderPath(folderName, folderId, note.id));
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

      {loading && notes.length > 0 && (
        <p className="text-center text-(--text-primary)">Loading...</p>
      )}
      {!hasMore && notes.length > 0 && (
        <p className="text-center text-(--text-secondary)">No more notes</p>
      )}
      </div>
    </div>
  );
};

export default NotesList;
