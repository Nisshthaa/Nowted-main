import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppState } from "../../state/useAppState";
import type { GetNotesParams, Note } from "../types/dataTypes";
import { getNotes } from "../../api/noteAPI";
import { NoteListSkeleton } from "../Loader/LoadData";

const NotesList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFavorites = location.pathname.startsWith("/favorites");
  const isArchived = location.pathname.startsWith("/archived");
  const isTrash = location.pathname.startsWith("/trash");

  const { folderId, folderName } = useParams();
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
    searchText,
    notes,
    setNotes,

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

  const filters: GetNotesParams = {
    ...(isFavorites && { favorite: true }),
    ...(isArchived && { archived: true }),
    ...(isTrash && { deleted: "true" }),
    ...(folderId && !isFavorites && !isArchived && !isTrash && { folderId }),
  };

  const filtersKey = JSON.stringify(filters);

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
          ...filters,
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
  }, [debouncedQuery, filtersKey]);

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

    if (pageRef.current === 1) {
      setNotes([]);
    }
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
    const isFavorites = location.pathname.startsWith("/favorites");
    const isArchived = location.pathname.startsWith("/archived");
    const isTrash = location.pathname.startsWith("/trash");

    if (isFavorites) {
      navigate(`/favorites/${encodeURIComponent(note.title)}/${note.id}`);
      return;
    }

    if (isArchived) {
      navigate(`/archived/${encodeURIComponent(note.title)}/${note.id}`);
      return;
    }

    if (isTrash) {
      navigate(`/trash/${encodeURIComponent(note.title)}/${note.id}`);
      return;
    }

    const folder = folders.find((f) => f.id === note.folderId);

    if (!folder) return;

    navigate(
      `/${encodeURIComponent(folder.name)}/${folder.id}/${encodeURIComponent(note.title)}/${note.id}`,
    );
  };

  const displayedNotes = [...notes]
    .filter((note) => {
      if (isTrash) return note.deletedAt;

      if (isArchived) return note.isArchived && !note.deletedAt;

      if (isFavorites)
        return note.isFavorite && !note.deletedAt && !note.isArchived;

      return !note.deletedAt && !note.isArchived;
    })
    .sort((a, b) => {
      if (isTrash && a.deletedAt && b.deletedAt) {
        return (
          new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
        );
      }
      return 0;
    })
    .filter(
      (note, index, self) => self.findIndex((n) => n.id === note.id) === index,
    );

  return (
    <div className="flex flex-col w-100 h-screen p-4 gap-5 bg-(--panel-bg)">
      <div className="sticky top-0 z-20 bg-(--panel-bg)">
        <h3 className="w-full min-w-0 shrink-0 py-1 font-semibold text-(--text-primary) text-2xl line-clamp-2">
          {isFavorites
            ? "Favorites"
            : isArchived
              ? "Archived"
              : isTrash
                ? "Trash"
                : folderName || "All Notes"}
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

        {!hasMore && displayedNotes.length > 0 && (
          <p className="text-center text-(--text-secondary)">No more notes</p>
        )}
      </div>
    </div>
  );
};

export default NotesList;
