import {useState } from "react";
import type { folder } from "../components/types";
import { DataContext } from "./DataContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFolder, setSelectedFolder] = useState<folder | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <DataContext.Provider
      value={{
        selectedFolder,
        setSelectedFolder,
        selectedNoteId,
        setSelectedNoteId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


