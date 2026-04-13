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
    searchText,
    setSelectedNoteId,
    setActiveView,
    setSelectedFolder,
    setActiveNoteMode,
    folders,
    setSearchResults,
    setShowSearchDropdown,
  } = useAppState();

  const [notes, setNotes] = useState<Note[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const navigate = useNavigate();
  const location = useLocation();

//pagination
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  //debouncing 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchText.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  //show notes based on view
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
        const matchingFolder = folders.find((f) => f.id === folderId);
        if (matchingFolder) {
          setActiveView("all");
          setSelectedFolder(matchingFolder);
        }
      }
    }
  }, [location.pathname, folders, setActiveView, setSelectedFolder]);

  //sending params to url
  const filters: GetNotesParams = (() => {
    if (activeView === "favorites") {
      return { favorite: true };
    }
    if (activeView === "archived") {
      return { archived: true };
    }
    if (activeView === "trash") {
      return { deleted: "true" };
    }
    if (selectedFolder) return { folderId: selectedFolder.id };
    return {};
  })();

  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      try {
        const res = await getNotes({ ...filters, search: debouncedQuery });
        const data = res.data.notes ?? [];
        setSearchResults(data);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, filters]);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    if (debouncedQuery.trim()) return;

    let isActive = true;

    const loadNotes = async () => {
      setLoading(true);

      try {
        const res = await getNotes({
          ...filters,
          page: 1,
          limit,
        });

        const data = res.data.notes ?? [];

        if (!isActive) return;

        setNotes(data);
        pageRef.current = 1;

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
    pageRef.current = 1;
    setHasMore(true);
    loadNotes();

    return () => {
      isActive = false;
    };
  }, [refreshNotes, filtersKey, debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) return;

    const currentRef = loaderRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loadingRef.current || !hasMoreRef.current) return;

        setLoading(true);

        try {
          const nextPage = pageRef.current + 1;
          const res = await getNotes({
            ...filters,
            page: nextPage,
            limit,
          });

          const data = res.data.notes ?? [];

          setNotes((prev) => [...prev, ...data]);

          if (data.length < limit) {
            setHasMore(false);
          } else {
            pageRef.current = nextPage;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [filtersKey, debouncedQuery]);

  const displayedNotes = [...notes].sort((a, b) => {
    if (activeView === "trash" && a.deletedAt && b.deletedAt) {
      return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex flex-col w-100 h-screen p-4 gap-5 bg-(--panel-bg)">
      <div className="sticky top-0 z-20 bg-(--panel-bg)">
        <h3 className="w-full min-w-0 shrink-0 py-1 font-semibold text-(--text-primary) text-2xl line-clamp-2">
          {activeView === "favorites"
            ? "Favorites"
            : activeView === "archived"
              ? "Archived"
              : activeView === "trash"
                ? "Trash"
                : selectedFolder?.name || "Select Folder"}
        </h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-7.5">
        {loading && notes.length === 0 && <NoteListSkeleton count={limit} />}

        {!loading &&
          displayedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setSelectedNoteId(note.id);
                const shouldSearchAllNotes =
                  debouncedQuery !== "" && activeView === "all";

                if (activeView !== "trash") {
                  setActiveNoteMode("view");
                }

                if (selectedFolder && !shouldSearchAllNotes) {
                  navigate(
                    `/${encodeURIComponent(selectedFolder.name)}/${selectedFolder.id}/${encodeURIComponent(note.title)}/${note.id}`,
                  );
                } else if (activeView === "all") {
                  const noteFolder = folders.find(
                    (folder) => folder.id === note.folderId,
                  );
                  if (noteFolder) {
                    setSelectedFolder(noteFolder);
                    navigate(
                      `/${encodeURIComponent(noteFolder.name)}/${noteFolder.id}/${encodeURIComponent(note.title)}/${note.id}`,
                    );
                  }
                } else {
                  if (activeView === "favorites") {
                    navigate(
                      `/favorites/${encodeURIComponent(note.title)}/${note.id}`,
                    );
                  } else if (activeView === "archived") {
                    navigate(
                      `/archived/${encodeURIComponent(note.title)}/${note.id}`,
                    );
                  } else if (activeView === "trash") {
                    navigate(
                      `/trash/${encodeURIComponent(note.title)}/${note.id}`,
                    );
                  }
                }
              }}
              className="flex flex-col w-full h-21 p-3 gap-2 rounded-lg cursor-pointer transition-all duration-200 border border-(--border-color) bg-(--card-bg) hover:bg-(--hover-bg) "
            >
              <p className="font-semibold text-(--text-primary) text-[18px] truncate">
                {note.title.length > 20
                  ? note.title.slice(0, 20) + "..."
                  : note.title}
              </p>

              <div className="flex gap-4 ">
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

        {!loading && displayedNotes.length === 0 && (
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
