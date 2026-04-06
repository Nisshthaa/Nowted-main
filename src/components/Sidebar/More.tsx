import React from "react";
import { useApp } from "../../context/useApp";
import { Archive, Star, Trash } from "lucide-react";
import { useURLState } from "../../hooks/useURLState";

const Features: React.FC = () => {
  const { setActiveView, setSelectedNoteId, setActiveNoteMode } = useApp();
  const { updateURL } = useURLState();

  return (
    <div className="flex flex-col w-80 h-39 gap-2 ">
      <p
        className="text-(--text-heading) text-[18px] font-semibold"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        More
      </p>

      <div
        className="flex w-80 h-39 gap-4 hover:bg-(--btn-hover) items-center p-1 rounded-[3px]"
        onClick={() => {
          setActiveView("favorites");
          setActiveNoteMode("view");
          setSelectedNoteId(null);

          updateURL({
            view: "favorites",
            folder: null,
            note: null,
          });
        }}
      >
        <Star className="w-5 h-6 text-(--text-secondary) " />

        <p
          className="text-(--text-secondary) text-[18px] font-semibold  cursor-pointer"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Favorites
        </p>
      </div>

      <div
        className="flex w-80 h-39 gap-4 hover:bg-(--btn-hover) p-1 rounded-[3px]"
        onClick={() => {
          setActiveView("trash");
          setActiveNoteMode("restore");
          setSelectedNoteId(null);

          updateURL({
            view: "trash",
            note: null,
            folder: null,
          });
        }}
      >
        <Trash className="w-5 h-7 text-(--text-secondary)" />

        <p
          className="text-(--text-secondary)  font-semibold text-[18px] cursor-pointer"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Trash
        </p>
      </div>

      <div
        className="flex w-80 h-39 gap-4 hover:bg-(--btn-hover) p-1 rounded-[3px]"
        onClick={() => {
          setActiveView("archived");
          setActiveNoteMode("view");
          setSelectedNoteId(null);

          updateURL({
            view: "archived",
            note: null,
            folder: null,
          });
        }}
      >
        <Archive className="w-5 h-7 text-(--text-secondary)" />
        <p
          className="text-(--text-secondary) font-semibold  cursor-pointer text-[18px]"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Archived Notes
        </p>
      </div>
    </div>
  );
};

export default Features;
