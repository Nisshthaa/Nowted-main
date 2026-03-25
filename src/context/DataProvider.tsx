import {useState } from "react";
import type { folder } from "../components/types";
import { DataContext } from "./DataContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFolder, setSelectedFolder] = useState<folder | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeNoteMode, setActiveNoteMode] = useState<"view" | "create">("view");
  const [refreshNotes, setRefreshNotes] = useState(false);

  return (
    <DataContext.Provider
      value={{
        selectedFolder,
        setSelectedFolder,
        selectedNoteId,
        setSelectedNoteId,
        activeNoteMode,
setActiveNoteMode,
refreshNotes, setRefreshNotes
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


