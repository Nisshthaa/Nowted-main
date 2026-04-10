import { useState } from "react";
import { AppState } from "./AppState";
import type { Folder, Note } from "../components/types/dataTypes";

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [activeNoteMode, setActiveNoteMode] = useState<
    "view" | "create" | "restore" | null
  >("view");

  const [folders, setFolders] = useState<Folder[]>([]);

  const [notes, setNotes] = useState<Note[]>([]);

  const [refreshNotes, setRefreshNotes] = useState(false);

  const [activeView, setActiveView] = useState<
    "all" | "favorites" | "archived" | "trash" | null
  >("all");

  const [searchText, setSearchText] = useState("");

  return (
    <AppState.Provider
      value={{
        selectedFolder,
        setSelectedFolder,

        selectedNoteId,
        setSelectedNoteId,

        activeNoteMode,
        setActiveNoteMode,

        refreshNotes,
        setRefreshNotes,

        activeView,
        setActiveView,

        folders,
        setFolders,

        notes,
        setNotes,

        searchText,
        setSearchText,
      }}
    >
      {children}
    </AppState.Provider>
  );
};
