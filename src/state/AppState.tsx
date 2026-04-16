import { createContext } from "react";
import type { Folder, Note } from "../components/types/dataTypes";

type NoteMode = "view" | "create" | "restore" | null;
type ActiveView = "all" | "favorites" | "archived" | "trash" | null;

export type AppStateType = {
  //folders state
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;

  //notes state
notes: Note[];
setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  selectedNoteId: string | null;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

  activeNoteMode: NoteMode;
  setActiveNoteMode: React.Dispatch<React.SetStateAction<NoteMode>>;

  
  activeView: ActiveView;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;

  //search notes
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;

  searchResults: Note[];
  setSearchResults: React.Dispatch<React.SetStateAction<Note[]>>;

  showSearchDropdown: boolean;
  setShowSearchDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  
  addNoteToList: (note: Note) => void;
  updateNoteInList: (noteId: string, data: Partial<Note>) => void;
};

export const AppState = createContext<AppStateType | null>(null);
