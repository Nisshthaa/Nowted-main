import React, { useEffect, useRef, useState } from "react";
import { useAppState } from "../../state/useAppState";
import type { GetNotesParams, Note } from "../types/dataTypes";
import { getNotes } from "../../api/noteAPI";
import { NoteListSkeleton } from "../Loader/LoadData";
import { useNavigate, useLocation } from "react-router-dom";

const NotesList: React.FC = () => {
  const {
    refreshNotes,
    activeView,
    selectedFolder,
    setSelectedNoteId,
    setActiveView,
    setSelectedFolder,
    setActiveNoteMode,
    folders,
  } = useAppState();

  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/favorites") {
      setActiveView("favorites");
      setSelectedFolder(null);
    } else if (location.pathname === "/trash") {
      setActiveView("trash");
      setSelectedFolder(null);
    } else if (location.pathname === "/archived") {
      setActiveView("archived");
      setSelectedFolder(null);
    } else {
      const pathSegments = location.pathname.split("/").filter(Boolean);
      if (pathSegments.length >= 2) {
        const folderId = pathSegments[1];
        const matchingFolder = folders.find(f => f.id === folderId);
        if (matchingFolder) {
          setActiveView("all");
          setSelectedFolder(matchingFolder);
        }
      }
    }
  }, [location.pathname, folders, setActiveView, setSelectedFolder]);

  const filters: GetNotesParams = (() => {
    if (activeView === "favorites") return { favorite: true };
    if (activeView === "archived") return { archived: true };
    if (activeView === "trash") return { deleted: "true" };
    if (selectedFolder) return { folderId: selectedFolder.id };
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
        if (isActive) setLoading(false);
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
        if (!entries[0].isIntersecting || loading || !hasMore) return;

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

          if (data.length < limit) setHasMore(false);

          setPage(nextPage);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [hasMore, loading, page, filtersKey]);

  const sortedNotes = [...notes].sort((a, b) => {
    if (activeView === "trash" && a.deletedAt && b.deletedAt) {
      return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex flex-col w-100 h-screen p-4 gap-5 bg-(--panel-bg)">
      <h3 className="sticky top-0 z-10 w-full min-w-0 shrink-0 bg-(--panel-bg) py-1 font-semibold text-(--text-primary) text-2xl line-clamp-2">
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

        {!loading &&
          sortedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setSelectedNoteId(note.id);

                // Only reset to "view" mode if NOT in trash
                if (activeView !== "trash") {
                  setActiveNoteMode("view");
                }

                if (selectedFolder) {
                  navigate(
                    `/${encodeURIComponent(selectedFolder.name)}/${selectedFolder.id}/${encodeURIComponent(note.title)}/${note.id}`
                  );
                } else {
                  // For favorites, archived, trash views - navigate with view
                  if (activeView === "favorites") {
                    navigate(`/favorites/${encodeURIComponent(note.title)}/${note.id}`);
                  } else if (activeView === "archived") {
                    navigate(`/archived/${encodeURIComponent(note.title)}/${note.id}`);
                  } else if (activeView === "trash") {
                    navigate(`/trash/${encodeURIComponent(note.title)}/${note.id}`);
                  }
                }
              }}
              className="flex flex-col w-full p-4 gap-2 rounded-lg cursor-pointer transition-all duration-200 border border-(--border-color) bg-(--card-bg) hover:bg-(--hover-bg)"
            >
              <p className="font-semibold text-(--text-primary) text-[18px] truncate">
                {note.title.length > 20
                  ? note.title.slice(0, 20) + "..."
                  : note.title}
              </p>

              <div className="flex gap-4">
                <span className="text-(--text-secondary) text-m">
                  {new Date(note.createdAt).toLocaleDateString("en-GB")}
                </span>
                <span className="text-(--text-secondary) text-m">
                  {note.preview.length > 20
                    ? note.preview.slice(0, 20) + "..."
                    : note.preview}
                </span>
              </div>
            </div>
          ))}

        {!loading && notes.length === 0 && (
          <p className="text-center text-(--text-secondary)">
            No notes found
          </p>
        )}

        <div ref={loaderRef} style={{ height: "20px" }} />

        {loading && notes.length > 0 && (
          <p className="text-center text-(--text-primary)">Loading...</p>
        )}

        {!hasMore && notes.length > 0 && (
          <p className="text-center text-(--text-secondary)">
            No more notes
          </p>
        )}
      </div>
    </div>
  );
};

export default NotesList;