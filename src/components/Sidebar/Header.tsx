import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/useApp";

const Header: React.FC = () => {
  const { setActiveNoteMode, searchText, setSearchText } = useApp();
  const [search, setSearch] = useState(false);

  return (
    <>
      {/* logo+searchbar */}
      <div className="flex justify-between items-center h-13  ">
        <img
          src="src/assets/logo.svg"
          alt="logo"
          className="w-30 h-15.5 opacity-100 transition"
        />
        <Search
          onClick={() => setSearch((prev) => !prev)}
          className="w-6 h-7  text-(--text-primary) cursor-pointer opacity-70 hover:opacity-100 transition"
        />
      </div>

      {/* add new note */}
      {search ? (
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full h-10 px-3 rounded-md bg-[#2a2a2a] text-(--text-primary) outline-none focus:ring-2 focus:ring-[#555]"
          style={{ fontFamily: "var(--font-primary)" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      ) : (
        <div className=" flex justify-center items-center h-13 w-70 pr-5 pl-5 ">
          <button
            className=" flex items-center justify-center gap-2 w-full h-10 bg-[#2a2a2a] hover:bg-[#333] active:scale-[0.98] text-(--text-primary) text-[18px] font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            style={{ fontFamily: "var(--font-primary)" }}
            onClick={() => setActiveNoteMode("create")}
          >
            <Plus className="h-5 w-5" /> New Note
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
