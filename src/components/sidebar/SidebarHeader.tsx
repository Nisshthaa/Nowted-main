import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppState } from "../../state/useAppState";
import { Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarHeader: React.FC = () => {
  const {
    setActiveNoteMode,
    searchText,
    setSearchText,
    activeNoteMode,
    selectedFolder,
    setSelectedNoteId,
  } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

  return (
    <div className="flex flex-col gap-4  ">
      <div className="flex justify-between items-center  h-13 ">
        {theme === "dark" ? (
          <img src="/src/assets/logo.svg" alt="logo" className="w-30 h-15.5" />
        ) : (
          <img
            src="/src/assets/logo.svg"
            alt="logo"
            className="w-30 h-15.5 filter invert sepia hue-rotate-200 saturate-500"
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
              setSearch((prev) => !prev);
              setSearchText("");
            }}
            className="w-6 h-7 text-(--text-primary) cursor-pointer opacity-70 hover:opacity-100 transition"
          />
        </div>
      </div>

      {search ? (
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full h-10 px-3 rounded-md bg-(--panel-bg) text-(--text-primary) outline-none border border-(--border-color) focus:ring-2 focus:ring-(--accent)"
          style={{ fontFamily: "var(--font-primary)" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      ) : (
        <div className=" flex justify-center items-center  h-13 w-70 pr-5 pl-5 ">
          <button
            className=" flex items-center justify-center gap-2 w-full h-10 bg-(--btn-bg) hover:bg-(--btn-hover) active:scale-[0.98] text-(--text-primary) text-[18px] font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            style={{ fontFamily: "var(--font-primary)" }}
            onClick={() => {
              if (!selectedFolder) return;

              setSelectedNoteId(null);

              const folderPath = `/${selectedFolder.name}/${selectedFolder.id}`;
              const createPath = `${folderPath}/create`;

              const onCreatePath = location.pathname === createPath;

              if (activeNoteMode === "create" || onCreatePath) {
                setActiveNoteMode("view");
                navigate(folderPath);
                return;
              }

              setActiveNoteMode("create");
              navigate(createPath);
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
