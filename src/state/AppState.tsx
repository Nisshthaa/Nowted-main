import { createContext } from "react";
import type { Folder, Note } from "../components/types/dataTypes";

type NoteMode = "view" | "create" | "restore" | null;
type ActiveView = "all" | "favorites" | "archived" | "trash" | null;

export type AppStateType = {
  //folders state
  selectedFolder: Folder | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>;

  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;

  //notes state

  selectedNoteId: string | null;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  activeNoteMode: NoteMode;
  setActiveNoteMode: React.Dispatch<React.SetStateAction<NoteMode>>;

  //fetch data
  refreshNotes: boolean;
  setRefreshNotes: React.Dispatch<React.SetStateAction<boolean>>;

  activeView: ActiveView;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;

  //search notes
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;

  searchResults: Note[];
  setSearchResults: React.Dispatch<React.SetStateAction<Note[]>>;

  showSearchDropdown: boolean;
  setShowSearchDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppState = createContext<AppStateType | null>(null);
