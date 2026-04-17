import { createContext } from "react";
import type { Folder, Note } from "../components/types/dataTypes";

export type AppStateType = {
  // folders
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;

  // notes
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  addNoteToList: (note: Note) => void;
  updateNoteInList: (noteId: string, data: Partial<Note>) => void;

  // search
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;

  searchResults: Note[];
  setSearchResults: React.Dispatch<React.SetStateAction<Note[]>>;

  showSearchDropdown: boolean;
  setShowSearchDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppState = createContext<AppStateType | null>(null);