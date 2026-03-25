import { createContext } from "react";
import type { folder } from "../components/types";

type DataContextType = {
  selectedFolder: folder | null;
  setSelectedFolder: (folder: folder) => void;

  selectedNoteId: string | null;
  setSelectedNoteId: (id: string|null) => void;

  activeNoteMode: "view" | "create";
  setActiveNoteMode: (mode: "view" | "create") => void;

    refreshNotes: boolean;
  setRefreshNotes: React.Dispatch<React.SetStateAction<boolean>>

  activeView:"all"|"favorites"
  setActiveView:(view:"all"|"favorites")=>void

  folders:folder[]
  setFolder:React.Dispatch<React.SetStateAction<folder[]>>
};



export const DataContext = createContext<DataContextType | null>(null);