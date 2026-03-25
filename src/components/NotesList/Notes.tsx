import React, { useEffect, useState } from "react";
import type { Note} from "../types";
import { getNotes } from "../../Api/notes";
import { formatDate, getPreview } from "../utils/helpers";
import { useApp } from "../../context/useApp";


const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const {selectedFolder,setSelectedNoteId,activeView,refreshNotes,setActiveNoteMode}=useApp()
  
  useEffect(() => {
  const fetchNotes = async () => {
    try {
      let res;

      if (activeView === "favorites") {
        res = await getNotes({ favorite: true });
      } else if (selectedFolder) {
        res = await getNotes({ folderId: selectedFolder.id });
      }

      if (!res) {
        setNotes([]);
        return;
      }

      console.log("FULL:", res.data);

      const data = res.data.notes || res.data.data;

      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchNotes();
}, [selectedFolder, activeView, refreshNotes]);

  return (
    <>
      <div className="flex flex-col w-100 h-screen pt-7.5 pb-7.5 pl-5 pr-5 gap-5 bg-[#1C1C1C]">
        <h3
          className="w-75 h-7 flex font-semibold text-(--text-primary) text-2xl"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          {activeView==="favorites"?"Favorites":selectedFolder?.name||"Select Folder"}
        </h3>
        {notes.map((note) => (
          <div
            className="flex flex-col h-24.5 w-full pl-5 gap-2.5 rounded-[3px] bg-(--folder-bg)"
            key={note.id} onClick={()=>{setSelectedNoteId(note.id); setActiveNoteMode("view")}}
          >
            <p
              className="w-67.5 h-7 font-semibold text-(--text-primary) text-[18px] "
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {note.title}
            </p>

            <div className="flex gap-4 w-67.5 h-5">
              <span
                className="font-semibold text-[#FFFFFF66] text-[18px] "
                style={{ fontFamily: "var(--font-primary)" }}
              >
                {formatDate(note.createdAt)}
                
              </span>
              <span className="text-(--text-secondary) flex flex-wrap pt-0.5">
               
                {getPreview(note.preview)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Notes;
