import {
  Archive,
  Calendar,
  CircleEllipsis,
  FileText,
  Folder,
  Star,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FullNote } from "../types";
import { getNotesData, updateNote } from "../../Api/notes";
import { formatDate } from "../utils/helpers";
import { useApp } from "../../context/useApp";
import CreateNoteForm from "./CreateNoteForm";
import { showError, showSuccess } from "../utils/toaster";

const NotesDetails: React.FC = () => {
  const {
    selectedNoteId,
    selectedFolder,
    activeNoteMode,
    setRefreshNotes,
    setSelectedNoteId,
  } = useApp();
  const [fullNote, setfullNote] = useState<FullNote | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleArchive = async () => {
    if (!fullNote) return;

    try {
      await updateNote(fullNote.id, {
        isArchived: true,
      });

      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(null);
      showSuccess("Folder Archived!");
    } catch (err) {
      console.log(err);
      showError("Failed to Archive");
    }
  };

  const handleFavorite = async () => {
    if (!fullNote) return;

    try {
      await updateNote(fullNote.id, {
        isFavorite: true,
      });

      setRefreshNotes((prev) => !prev);
      setSelectedNoteId(fullNote.id);
      showSuccess("Added to Favorites!");
    } catch (err) {
      console.log(err);
      showError("Failed to Add!");
    }
  };

  useEffect(() => {
    if (!selectedNoteId) return;

    const fetchNotes = async () => {
      try {
        setfullNote(null);
        const res = await getNotesData(selectedNoteId);
        setfullNote(res.data.note);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotes();
  }, [selectedNoteId]);

  if (activeNoteMode === "create") {
    return <CreateNoteForm />;
  }

  if (!selectedNoteId)
    return (
      <div className="w-250 h-screen p-12.5 gap-2.5 flex flex-col justify-center items-center ">
        <FileText
          className="w-20 h-20 text-(--text-primary) "
          strokeWidth={1}
        />
        <p
          className="text-(--text-primary) text-[30px] font-semibold"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Select a note to view
        </p>

        <div className="w-120 h-9 flex flex-col justify-center items-center ">
          <p
            className="text-(--text-secondary) text-[16px] font-regular flex flex-col flex-wrap"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            Choose a note from the list on the left to view its contents,or
            create a
          </p>
          <p
            className="text-(--text-secondary) text-[16px] font-regular"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            new note to add to your collection.
          </p>
        </div>
      </div>
    );

  if (!fullNote) return <div className="p-10 text-white">Loading....</div>;
  return (
    // notes-details
    <div className="w-250 h-screen p-12.5 gap-10 flex flex-col ">
      <div className="flex flex-col gap-7.5">
        {/* title */}
        <div className="flex justify-between ">
          <h3
            className="font-semibold text-[32px] text-(--text-primary)"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            {fullNote.title}
          </h3>
          <div className="relative">
            <CircleEllipsis
              className="text-(--text-secondary) w-7.5 h-7.5 rounded-[100px] absolute cursor-pointer"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="flex flex-col w-53.5 h-37.5 bg-[#333333] p-3.75 justify-between gap-5 rounded-md absolute top-10 right-0.5">
                <div className="flex flex-col gap-3 ">
                  <div
                    className="flex w-35 h-5 gap-3.75"
                    onClick={handleFavorite}
                  >
                    <Star className="h-5 w-5 text-(--text-primary)" />
                    <p
                      className="font-regular text-[16px] text-(--text-primary)"
                      style={{ fontFamily: "var(--font-primary)" }}
                    >
                      Add to favorites
                    </p>
                  </div>
                  <div
                    className="flex w-35 h-5 gap-3.75"
                    onClick={handleArchive}
                  >
                    <Archive className="h-5 w-5 text-(--text-primary)" />
                    <p
                      className="font-regular text-[16px] text-(--text-primary)"
                      style={{ fontFamily: "var(--font-primary)" }}
                    >
                      Archived
                    </p>
                  </div>
                </div>

                <hr className="w-43 h-1 text-[#FFFFFF1A]" />

                <div className="flex w-35 h-5 gap-3.75">
                  <Trash className="h-5 w-5 text-(--text-primary)" />
                  <p
                    className="font-regular text-[16px] text-(--text-primary)"
                    style={{ fontFamily: "var(--font-primary)" }}
                  >
                    Delete
                  </p>
                </div>
              </div>
            )}
          </div>
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
              {formatDate(fullNote.createdAt)}
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
      <div
        className="w-225 h-175 text-[17px] text-(--text-primary) overflow-y-auto "
        style={{ fontFamily: "var(--font-primary)" ,whiteSpace: "pre-wrap"}}
      >
        {fullNote.content}
      </div>
    </div>
  );
};

export default NotesDetails;
