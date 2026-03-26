import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type {Note} from "../types";
import { getRecentFolders } from "../../Api/folders";
import { useApp } from "../../context/useApp";



const Recent: React.FC= () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const {setSelectedFolder,setSelectedNoteId,setActiveView,setActiveNoteMode }=useApp()
  useEffect(() => {
    const getRecent = async () => {
      try {
        const response = await getRecentFolders()
        setNotes(response.data.recentNotes);
      } catch (err) {
        console.log(err);
      }
    };
    getRecent();
  }, []);

  const {folders}=useApp()

  return (
    // recent-folders
    <div className="flex flex-col h-39 cursor-pointer ">
      <p
        className="text-(--text-secondary) p-1 font-semibold text-[17px] "
        style={{ fontFamily: "var(--font-primary)" }}
      >
        Recents
      </p>

      {notes.map((note) => (
        <div
          onClick={() => {  const folderName = folders.find(f => f.id === note.folderId)?.name;

            setActiveId(note.id);
            setSelectedFolder({id: note.folderId, name: folderName||"Unknown FOlder"})
          setSelectedNoteId(note.id); setActiveView("all"); setActiveNoteMode("view");

          }}
            className={`flex items-center gap-3 w-full h-12 p-1 rounded-md cursor-pointer transition-all duration-200 ${activeId === note.id  ? "bg-[#705dcf] text-white"  : "text-(--text-secondary) hover:bg-[#2a2a2a] hover:text-white"}`}          key={note.id}
        >
          <FileText className="w-5 h-5 text-(--text-primary) " />
          <p
            className="text-(--text-primary) font-semibold text-[18px]"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            {note.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Recent;
