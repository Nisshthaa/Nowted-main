

import { useApp } from "../context/useApp";
import { useURLState } from "./useURLState";

export const useNoteActions = () => {
  const { setSelectedNoteId, setActiveView, setActiveNoteMode } = useApp();

  const { updateURL } = useURLState();

  const openNote = (noteId: string, folderId: string) => {
    setSelectedNoteId(noteId); 
    setActiveView("all"); 
    setActiveNoteMode("view"); 

    updateURL({
      folder: folderId,
      note: noteId,
      view: null,
    });
  };

  return { openNote };
};
