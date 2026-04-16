import { useState } from "react";
import { AppState } from "./AppState";
import type { Folder, Note } from "../components/types/dataTypes";

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [activeNoteMode, setActiveNoteMode] = useState<
    "view" | "create" | "restore" | null
  >("view");

  const [folders, setFolders] = useState<Folder[]>([]);


  const [activeView, setActiveView] = useState<
    "all" | "favorites" | "archived" | "trash" | null
  >("all");

  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState<Note[]>([]);

const [notes, setNotes] = useState<Note[]>([]);

const updateNoteInList = (noteId: string, data: Partial<Note>) => {
  setNotes((prev) =>
    prev.map((note) =>
      note.id === noteId ? { ...note, ...data } : note
    )
  );
};

const addNoteToList = (note: Note) => {
  setNotes((prev) => [note, ...prev]);
};

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  return (
    <AppState.Provider
      value={{
        selectedNoteId,
        setSelectedNoteId,
        activeNoteMode,
        setActiveNoteMode,

        activeView,
        setActiveView,
        folders,
        setFolders,
        searchText,
        setSearchText,
        searchResults,
        setSearchResults,
        showSearchDropdown,
        setShowSearchDropdown,
        notes,
  setNotes,
  addNoteToList,
        updateNoteInList
      }}
    >
      {children}
    </AppState.Provider>
  );
};
