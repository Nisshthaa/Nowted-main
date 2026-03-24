import { createContext } from "react";
import type { folder } from "../components/types";

type DataContextType = {
  selectedFolder: folder | null;
  setSelectedFolder: (folder: folder) => void;

  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
};

export const DataContext = createContext<DataContextType | null>(null);

