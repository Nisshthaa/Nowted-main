import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppState } from "../../state/useAppState";
import { Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Note } from "../types/dataTypes";
import logo from "/logo.svg";

const SidebarHeader: React.FC = () => {
  const {
    setActiveNoteMode,
    searchText,
    setSearchText,

    setSelectedNoteId,
    showSearchDropdown,
    setShowSearchDropdown,
    folders,
    setActiveView,
    searchResults,
    activeView,
  } = useAppState();

  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  //get search text
  useEffect(() => {
    const init = () => {
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get("search");

      if (searchQuery) {
        setSearchText(searchQuery);
        setSearch(true);
      } else {
        setSearch(false);
      }
    };
    init();
  }, [location.search, setSearchText]);

  //get and set theme
  useEffect(() => {
    const init = () => {
      const saved = localStorage.getItem("theme") as "light" | "dark";

      if (saved) {
        setTheme(saved);

        if (saved === "dark") {
          document.documentElement.classList.add("dark");
        }
      }
    };
    init();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  //show search result
  const handleSearchResultClick = (note: Note) => {
    setSelectedNoteId(note.id);
    setActiveNoteMode("view");

    if (activeView === "favorites") {
      navigate(`/favorites/${encodeURIComponent(note.title)}/${note.id}`);
    } else if (activeView === "trash") {
      navigate(`/trash/${encodeURIComponent(note.title)}/${note.id}`);
    } else if (activeView === "archived") {
      navigate(`/archived/${encodeURIComponent(note.title)}/${note.id}`);
    } else {
      const noteFolder = folders.find((folder) => folder.id === note.folderId);
      if (noteFolder) {
        setActiveView("all");
        navigate(
          `/${encodeURIComponent(noteFolder.name)}/${noteFolder.id}/${encodeURIComponent(note.title)}/${note.id}`,
        );
      }
    }

    setShowSearchDropdown(false);
    setSearchText("");
    setSearch(false);
  };

  //handle search url
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchText(query);

    if (query.trim()) {
      const params = new URLSearchParams(location.search);
      params.set("search", query);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else {
      const params = new URLSearchParams(location.search);
      params.delete("search");
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, {
        replace: true,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4  ">
      <div className="flex justify-between items-center  h-13 ">
        {theme === "dark" ? (
          <img className="w-30 h-15.5" src={logo} />
        ) : (
          <img
            className="w-30 h-15.5 filter invert sepia hue-rotate-200 saturate-500"
            src={logo}
          />
        )}
        <div className="flex gap-5 justify-center">
          <div onClick={toggleTheme} className="cursor-pointer ">
            {theme === "dark" ? (
              <Sun className="w-6 h-6 text-(--text-primary) opacity-70 transition-all duration-300 hover:opacity-100 hover:scale-110 hover:rotate-12 hover:brightness-125 drop-shadow-[0_0_8px_rgba(255,200,0,0.7)]" />
            ) : (
              <Moon className="w-6 h-6 text-(--text-primary) opacity-70 transition-all duration-300 hover:opacity-100 hover:scale-110 hover:rotate-12 hover:brightness-125 drop-shadow-[0_0_8px_rgba(255,200,0,0.7)]" />
            )}
          </div>

          <Search
            onClick={() => {
              setSearch((prev) => {
                const newSearch = !prev;
                if (!newSearch) {
                  const params = new URLSearchParams(location.search);
                  params.delete("search");
                  const newSearchStr = params.toString();
                  navigate(
                    `${location.pathname}${newSearchStr ? `?${newSearchStr}` : ""}`,
                    { replace: true },
                  );
                  setSearchText("");
                }
                return newSearch;
              });
            }}
            className="w-6 h-7 text-(--text-primary) cursor-pointer opacity-70 hover:opacity-100 transition"
          />
        </div>
      </div>

      {search ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full h-10 px-3 rounded-md bg-(--panel-bg) text-(--text-primary) outline-none border border-(--border-color) focus:ring-2 focus:ring-(--accent)"
            style={{ fontFamily: "var(--font-primary)" }}
            value={searchText}
            onChange={handleSearchChange}
          />

          {showSearchDropdown && (
            <div className="bg-(--card-bg) border border-(--border-color) rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSearchResultClick(note)}
                    className="flex flex-col p-3 gap-1 border-b border-(--border-color) cursor-pointer hover:bg-(--hover-bg) transition-all last:border-b-0"
                  >
                    <p className="font-semibold text-(--text-primary) text-m truncate">
                      {note.title}
                    </p>
                    <p className="text-(--text-secondary) text-m truncate">
                      {note.preview}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-(--text-secondary) text-m">
                    No notes found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className=" flex justify-center items-center  h-13 w-70 pr-5 pl-5 ">
          <button
            className=" flex items-center justify-center gap-2 w-full h-10 bg-(--btn-bg) hover:bg-(--btn-hover) active:scale-[0.98] text-(--text-primary) text-[18px] font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            style={{ fontFamily: "var(--font-primary)" }}
            onClick={() => {
              const isSpecialView =
                location.pathname.startsWith("/favorites") ||
                location.pathname.startsWith("/trash") ||
                location.pathname.startsWith("/archived");
              if (isSpecialView) return;

              const pathParts = location.pathname.split("/").filter(Boolean);
              if (pathParts.length < 2) return;

              const folderName = decodeURIComponent(pathParts[0]);
              const folderId = pathParts[1];

              setSelectedNoteId(null);

              setSelectedNoteId(null);
              setActiveNoteMode("create");

              
            navigate(`/${folderName}/${folderId}/create`);
            }}
          >
            <Plus className="h-6 w-6" /> New Note
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
