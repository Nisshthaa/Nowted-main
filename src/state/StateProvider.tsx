import { useState } from "react";
import { AppState } from "./AppState";
import type { Folder, Note } from "../components/types/dataTypes";

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

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

  return (
    <AppState.Provider
      value={{
        folders,
        setFolders,
        notes,
        setNotes,
        addNoteToList,
        updateNoteInList,
        searchText,
        setSearchText,
        searchResults,
        setSearchResults,
        showSearchDropdown,
        setShowSearchDropdown,
      }}
    >
      {children}
    </AppState.Provider>
  );
};