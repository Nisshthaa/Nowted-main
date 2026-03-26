import { Calendar, Folder, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context/useApp";
import { createNote, getNotes } from "../../Api/notes";
import { showError, showSuccess } from "../utils/toaster";

const CreateNoteForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const {
    selectedFolder,
    setActiveNoteMode,
    setSelectedNoteId,
    setRefreshNotes,
  } = useApp();

  const handleCreate = async () => {
    if (!title || !content || !selectedFolder) return;

    try {
      await createNote({
        title,
        content,
        folderId: selectedFolder.id,
      });
      await getNotes({ folderId: selectedFolder.id });
      setRefreshNotes((prev) => !prev);
      setActiveNoteMode("view");
      setSelectedNoteId(null);
      showSuccess("Note Created Successfully!");
    } catch (err) {
      console.log(err);
      showError("Failed to create Note!");
    }
  };

  useEffect(() => {
    const refreshValues = () => {
      setTitle("");
      setContent("");
    };
    refreshValues();
  }, [selectedFolder]);

  return (
    <div className="w-250 h-screen p-12.5 gap-15 flex flex-col ">
      <div className="flex flex-col gap-7.5">
        {/* title */}
        <div className="flex justify-between ">
          <input
            className="font-semibold text-[32px] text-(--text-primary) border "
            style={{ fontFamily: "var(--font-primary)" }}
            placeholder="Enter title...."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* date details */}
        <div className="w-172.5 h-16.75 flex flex-col gap-3.75">
          <div className="w-80 h-4.5 flex justify-between gap-6">
            <div className="flex gap-5">
              <Calendar className="w-4.5 h-6.5 text-(--text-secondary)" />
              <p
                className="font-semibold text-[17px] text-(--text-secondary)"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                Date
              </p>
            </div>
            <p
              className="font-semibold text-[17px] underline text-(--text-primary) "
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          <hr className=" w-200 h-2 text-[#FFFFFF1A]" />

          {/* folder details */}
          <div className="w-80 h-4.5 flex justify-between gap-6">
            <div className="flex gap-5">
              <Folder className="w-4.5 h-6.5 text-(--text-secondary)" />
              <p
                className="font-semibold text-[17px] text-(--text-secondary)"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                Folder
              </p>
            </div>
            <p
              className="font-semibold text-[17px] underline text-(--text-primary) "
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {selectedFolder?.name}
            </p>
          </div>
        </div>
      </div>

      {/* notes details */}
      <textarea
        className="w-225 h-175 text-[16px] text-(--text-primary)  "
        style={{ fontFamily: "var(--font-primary)" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your Note...."
      />

      <button
        className=" flex justify-center items-center gap-3 w-65 h-10  bg-(--btn-bg) text-(--text-primary) cursor-pointer"
        onClick={handleCreate}
      >
        <Plus className="h-5 w-5" /> Add Note
      </button>
    </div>
  );
};

export default CreateNoteForm;
