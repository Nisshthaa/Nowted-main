import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "../../state/useAppState";
import type { GetNotesParams, Note } from "../types/dataTypes";
import { getNotes } from "../../api/noteAPI";
import { NoteListSkeleton } from "../Loader/LoadData";

const NotesList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const {
    activeView,
    searchText,
    notes,
    setNotes,
    setSelectedNoteId,
    setActiveView,
    setActiveNoteMode,
    folders,
    setSearchResults,
    setShowSearchDropdown,
  } = useAppState();

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  //search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchText.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  //sync URL to activeView
  useEffect(() => {
    if (location.pathname.startsWith("/favorites")) {
      setActiveView("favorites");
    } else if (location.pathname.startsWith("/trash")) {
      setActiveView("trash");
    } else if (location.pathname.startsWith("/archived")) {
      setActiveView("archived");
    } else {
      setActiveView("all");
    }
  }, [location.pathname, setActiveView]);


  const getFolderIdFromUrl = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (
      pathParts.length >= 2 &&
      !location.pathname.startsWith("/favorites") &&
      !location.pathname.startsWith("/trash") &&
      !location.pathname.startsWith("/archived")
    ) {
      return pathParts[1];
    }
    return null;
  };

  const folderIdFromUrl = getFolderIdFromUrl();

  //show notes on the basis of filters
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
    if (folderIdFromUrl) return { folderId: folderIdFromUrl };
    return {};
  })();

  //search on fav,archive or trash
  const searchFilters: GetNotesParams = (() => {
    if (activeView === "favorites") {
      return { favorite: true };
    }
    if (activeView === "archived") {
      return { archived: true };
    }
    if (activeView === "trash") {
      return { deleted: "true" };
    }
    return {};
  })();

  const filtersKey = JSON.stringify(filters);
  const searchFiltersKey = JSON.stringify(searchFilters);

  //show search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      try {
        const res = await getNotes({
          ...searchFilters,
          search: debouncedQuery,
        });
        const data = res.data.notes ?? [];
        setSearchResults(data);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, searchFiltersKey]);

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
  }, [filtersKey, debouncedQuery]);

  //render notes with pagination
  useEffect(() => {
    if (debouncedQuery.trim()) return;

    const currentRef = loaderRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          !entries[0].isIntersecting ||
          loadingRef.current ||
          !hasMoreRef.current
        )
          return;

        setIsFetchingMore(true);

        const scrollContainer = currentRef.closest(
          ".overflow-y-auto",
        ) as HTMLElement | null;
        const scrollPos = scrollContainer?.scrollTop ?? 0;

        try {
          const nextPage = pageRef.current + 1;
          const res = await getNotes({
            ...filters,
            page: nextPage,
            limit,
          });

          const data = res.data.notes ?? [];

          setNotes((prev) => {
            const updated = [...prev, ...data];

            setTimeout(() => {
              if (scrollContainer) {
                scrollContainer.scrollTop = scrollPos;
              }
            }, 0);

            return updated;
          });

          if (data.length < limit) {
            setHasMore(false);
          } else {
            pageRef.current = nextPage;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingMore(false);
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [filtersKey, debouncedQuery]);

  const handleClick = (note: Note) => {
    setSelectedNoteId(note.id);
    const shouldSearchAllNotes = debouncedQuery !== "" && activeView === "all";

    if (activeView !== "trash") {
      setActiveNoteMode("view");
    }

    if (activeView === "favorites") {
      navigate(`/favorites/${encodeURIComponent(note.title)}/${note.id}`);
    } else if (activeView === "archived") {
      navigate(`/archived/${encodeURIComponent(note.title)}/${note.id}`);
    } else if (activeView === "trash") {
      navigate(`/trash/${encodeURIComponent(note.title)}/${note.id}`);
    } else if (folderIdFromUrl && !shouldSearchAllNotes) {
      const notebook = folders.find((f) => f.id === folderIdFromUrl);
      if (notebook) {
        navigate(
          `/${encodeURIComponent(notebook.name)}/${notebook.id}/${encodeURIComponent(note.title)}/${note.id}`,
        );
      }
    } else if (activeView === "all") {
      const noteFolder = folders.find((folder) => folder.id === note.folderId);
      if (noteFolder) {
        navigate(
          `/${encodeURIComponent(noteFolder.name)}/${noteFolder.id}/${encodeURIComponent(note.title)}/${note.id}`,
        );
      }
    }
  };

const displayedNotes = [...notes]
  .filter((note) => {
    if (activeView === "trash") return note.deletedAt;

    if (activeView === "archived")
      return note.isArchived && !note.deletedAt;

    if (activeView === "favorites")
      return note.isFavorite && !note.deletedAt && !note.isArchived;


    return !note.deletedAt && !note.isArchived;
  })
  .sort((a, b) => {
    if (activeView === "trash" && a.deletedAt && b.deletedAt) {
      return (
        new Date(b.deletedAt).getTime() -
        new Date(a.deletedAt).getTime()
      );
    }
    return 0;
  })
  .filter(
    (note, index, self) =>
      self.findIndex((n) => n.id === note.id) === index
  );

  const getFolderNameFromUrl = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (
      pathParts.length >= 1 &&
      !location.pathname.startsWith("/favorites") &&
      !location.pathname.startsWith("/trash") &&
      !location.pathname.startsWith("/archived")
    ) {
      return decodeURIComponent(pathParts[0]);
    }
    return "Select Folder";
  };

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
                : getFolderNameFromUrl()}
        </h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-7.5">
        {loading && notes.length === 0 && <NoteListSkeleton count={limit} />}

        {!loading &&
          displayedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleClick(note)}
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
                  {note.preview
                    ? note.preview.length > 20
                      ? note.preview.slice(0, 20) + "..."
                      : note.preview
                    : ""}
                </span>
              </div>
            </div>
          ))}

        {!loading && displayedNotes.length === 0 && (
          <p className="text-center text-(--text-secondary)">No notes found</p>
        )}

        <div ref={loaderRef} style={{ height: "20px" }} />

        {isFetchingMore && hasMore && notes.length > 0 && (
          <p className="text-center text-(--text-primary)">Loading more...</p>
        )}

        {!hasMore && notes.length > 0 && (
          <p className="text-center text-(--text-secondary)">No more notes</p>
        )}
      </div>
    </div>
  );
};

export default NotesList;
