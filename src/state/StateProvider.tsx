import { useState, useEffect } from "react";
import { AppState } from "./AppState";
import { useLocation } from "react-router-dom";
import type { Folder, Note } from "../components/types/dataTypes";
import { parseRouteState } from "../components/utils/urlHelpers";


export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { folderId, view, mode } = parseRouteState(location.pathname);
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

  useEffect(() => {
    const init = () => {
      if (view === "favorites") {
        setActiveView("favorites");
        setSelectedFolder(null);
        setSelectedNoteId(null);
        setActiveNoteMode("view");
        return;
      }

      if (view === "archived") {
        setActiveView("archived");
        setSelectedFolder(null);
        setSelectedNoteId(null);
        setActiveNoteMode("view");
        return;
      }

      if (view === "trash") {
        setActiveView("trash");
        setSelectedFolder(null);
        setSelectedNoteId(null);
        setActiveNoteMode("restore");
        return;
      }

      if (mode === "create") {
        setActiveNoteMode("create");
      }

      if (folderId) {
        const folder = folders.find((f) => f.id === folderId);
        if (folder) {
          setSelectedFolder(folder);
          setActiveView("all");
        }
      }
    };
    init();
  }, [view, folderId, mode, folders]);

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
