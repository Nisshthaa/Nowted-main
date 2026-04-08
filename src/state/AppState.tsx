import { createContext } from "react";
import type { Folder, Note } from "../components/types/dataTypes";

type NoteMode = "view" | "create" | "restore" | null;
type ActiveView = "all" | "favorites" | "archived" | "trash"|null;

export type AppStateType = {


  selectedFolder: Folder | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder | null>>;

  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;


  selectedNoteId: string | null;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

  activeNoteMode: NoteMode;
  setActiveNoteMode: React.Dispatch<React.SetStateAction<NoteMode>>;

  refreshNotes: boolean;
  setRefreshNotes: React.Dispatch<React.SetStateAction<boolean>>;

  activeView: ActiveView;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;


  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;

};

export const AppState = createContext<AppStateType | null>(null);
