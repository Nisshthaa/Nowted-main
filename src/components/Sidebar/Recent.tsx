import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type {Note} from "../types";
import { getRecentFolders } from "../../Api/folders";
import { useApp } from "../../context/useApp";



const Recent: React.FC= () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const {setSelectedFolder,setSelectedNoteId}=useApp()
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

  return (
    // recent-folders
    <div className="flex flex-col w-80 h-39 gap-2 cursor-pointer pr-5 pl-5">
      <p
        className="text-(--text-secondary) font-semibold "
        style={{ fontFamily: "var(--font-primary)" }}
      >
        Recents
      </p>

      {notes.map((note) => (
        <div
          onClick={() => {setActiveId(note.id);
            setSelectedFolder({id: note.folderId, name: note.title})
          setSelectedNoteId(note.id)
          }}
            
          className={`flex gap-4 w-80 h-16  items-center rounded-md cursor-pointer pr-0 pl-0 transition-colors duration-200 ${activeId === note.id ? "bg-amber-500" : "hover:bg-[#2a2a2a]"}`}
          key={note.id}
        >
          <FileText className="w-5 h-5 text-(--text-primary) " />
          <p
            className="text-(--text-primary) font-semibold "
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
