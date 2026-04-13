import { Calendar, Folder } from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppState } from "../../state/useAppState";
import { createNote, updateNote } from "../../api/noteAPI";
import { showError } from "../utils/notifications";
import { useNavigate, useLocation } from "react-router-dom";

const NoteForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef<string | null>(null);

  const {
    selectedFolder,
    setActiveNoteMode,
    setRefreshNotes,
  } = useAppState();

  
  const debouncedSave = useCallback(
    async (titleValue: string, contentValue: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!titleValue.trim() || !contentValue.trim() || !selectedFolder) {
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          setIsSaving(true);

         
          if (!noteIdRef.current) {
            const res = await createNote({
              title: titleValue,
              content: contentValue,
              folderId: selectedFolder.id,
            });
            const newNoteId = res.data.id;
            noteIdRef.current = newNoteId;

            setRefreshNotes((prev) => !prev);
          } else {
           
            await updateNote(noteIdRef.current, {
              title: titleValue,
              content: contentValue,
            });
            setRefreshNotes((prev) => !prev);
          }
        } catch (err) {
          console.error(err);
          showError("Failed to save note!");
        } finally {
          setIsSaving(false);
        }
      }, 500); 
    },
    [selectedFolder, setRefreshNotes, setActiveNoteMode, navigate, location.pathname]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(title, newContent);
  };

  useEffect(() => {
    const init = () => {
      setTitle("");
      setContent("");
      noteIdRef.current = null;
    };
    init();
  }, [selectedFolder]);

  
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen p-8 gap-8 bg-(--sidebar-bg)">
      <input
        className="text-3xl font-semibold text-(--text-primary) bg-transparent outline-none border-b border-(--border-color) pb-2"
        placeholder="Enter title..."
        value={title}
        onChange={handleTitleChange}
      />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between max-w-md">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-(--text-secondary)" />
            <p className="text-(--text-secondary)">Date</p>
          </div>

          <p className="text-(--text-primary)">
            {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        <hr className="border-(--border-color)" />

        <div className="flex justify-between max-w-md">
          <div className="flex items-center gap-3">
            <Folder className="w-5 h-5 text-(--text-secondary)" />
            <p className="text-(--text-secondary)">Folder</p>
          </div>

          <p className="text-(--text-primary)">{selectedFolder?.name}</p>
        </div>

        {isSaving && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-(--card-bg) border border-(--border-color)">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-(--accent) rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-(--accent) rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-(--accent) rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-(--text-primary) text-base font-semibold">Saving...</p>
          </div>
        )}
      </div>

      <textarea
        className="flex-1 bg-(--card-bg) border border-(--border-color) rounded-lg p-5 text-(--text-primary) outline-none resize-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Write your note..."
      />
    </div>
  );
};

export default NoteForm;
