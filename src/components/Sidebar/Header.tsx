import { Plus } from "lucide-react";
import React from "react";
import { useApp } from "../../context/useApp";

const Header: React.FC = () => {
  const { setActiveNoteMode } = useApp();
  return (
    <>
      {/* logo+searchbar */}
      <div className="flex justify-between items-center h-13  ">
        <img
          src="src/assets/logo.svg"
          alt="logo"
          className="w-25.25 h-15.5 object-contain opacity-90 hover:opacity-100 transition"
        />
        <img
          src="src/assets/search.svg"
          alt="search"
          className="w-6 h-7 cursor-pointer opacity-70 hover:opacity-100 transition"
        />
      </div>

      {/* add new note */}
      <div className=" flex justify-center items-center h-13 w-80 pr-5 pl-5 ">
        <button
          className=" flex items-center justify-center gap-2 w-full h-10 bg-[#2a2a2a] hover:bg-[#333] active:scale-[0.98] text-white text-[16px] font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          style={{ fontFamily: "var(--font-primary)" }}
          onClick={() => setActiveNoteMode("create")}
        >
          <Plus className="h-5 w-5" /> New Note
        </button>
      </div>
    </>
  );
};

export default Header;
