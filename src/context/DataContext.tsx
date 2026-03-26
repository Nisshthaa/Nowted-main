import { createContext } from "react";
import type { folder } from "../components/types";

type DataContextType = {
  selectedFolder: folder | null;
  setSelectedFolder: (folder: folder) => void;

  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  activeNoteMode: "view" | "create";
  setActiveNoteMode: (mode: "view" | "create") => void;

  refreshNotes: boolean;
  setRefreshNotes: React.Dispatch<React.SetStateAction<boolean>>;

  activeView: "all" | "favorites" | "archived";
  setActiveView: (view: "all" | "favorites" | "archived") => void;

  folders: folder[];
  setFolder: React.Dispatch<React.SetStateAction<folder[]>>;

  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

export const DataContext = createContext<DataContextType | null>(null);
