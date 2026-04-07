import React, { useEffect, useRef, useState } from "react";
import {
  Folder,
  FolderPlus,
  Plus,
  FolderOpen,
  Trash2,
  Pencil,
  Check,
} from "lucide-react";
import {
  getFoldersData,
  createFolder,
  deleteFolder,
  updateFolder,
} from "../../Api/folders";
import { useApp } from "../../context/useApp";
import { showError, showSuccess } from "../utils/toaster";
import type { Folder as FolderType } from "../types";
import { useURLState } from "../../hooks/useURLState";

const Folders: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false); 
  const [newFolderName, setNewFolderName] = useState(""); 
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const { folderId, view, updateURL } = useURLState(); 

  const {
    setSelectedFolder,
    setActiveNoteMode,
    folders,
    setFolders,
    setActiveView,
    setSelectedNoteId,
    selectedFolder,
    searchText,
  } = useApp();

  const initialFolderId = useRef(folderId);
  const initialView = useRef(view);
  const initialSelectedFolder = useRef(selectedFolder);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

 
  useEffect(() => {
    const getFolders = async () => {
      try {
        const response = await getFoldersData(); 
        const foldersData: FolderType[] = response.data.folders;

        setFolders(foldersData);

        if (initialView.current === "archived") {
          setSelectedFolder(null);
          setActiveView("archived");
          return;
        }

        if (initialView.current === "favorites") {
          setSelectedFolder(null);
          setActiveView("favorites");
          return;
        }

        
        if (initialFolderId.current) {
          const found = foldersData.find(
            (f) => f.id === initialFolderId.current,
          );

          if (found) {
            setSelectedFolder(found);
            return;
          }
        }

        
        if (
          !initialSelectedFolder.current &&
          !initialView.current &&
          foldersData.length > 0
        ) {
          setSelectedFolder(foldersData[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getFolders();
  }, [setFolders, setSelectedFolder, setActiveView]);

  
  const filteredFolders =
    debouncedSearch.trim() === ""
      ? folders
      : folders.filter((folder) =>
          folder.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );


  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName); 

      const response = await getFoldersData();
      setFolders(response.data.folders); 

      setNewFolderName(""); 
      setIsCreating(false); 

      showSuccess("Folder Created Successfully!");
    } catch (err) {
      console.log(err);
      showError("Failed to create Folder!");
    }
  };

  const handleEditClick = (folder: FolderType) => {
    setEditingFolderId(folder.id);
    setEditedName(folder.name);
  };

  const handleSaveFolder = async (folderId: string) => {
    if (!editedName.trim()) return;

    try {
      await updateFolder(folderId, editedName);

   
      setFolders((prev) =>
        prev.map((f) => (f.id === folderId ? { ...f, name: editedName } : f)),
      );

      setEditingFolderId(null);
      setEditedName("");
      setSelectedFolder(null)
      

      showSuccess("Folder renamed successfully!");
    } catch (err) {
      console.log(err);
      showError("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);


      setFolders((prev) => prev.filter((f) => f.id !== folderId));

      if (selectedFolder?.id === folderId) {
        const remaining = folders.filter((f) => f.id !== folderId);

        if (remaining.length > 0) {
          const next = remaining[0];

          setSelectedFolder(next);

          updateURL({
            folder: next.id,
            note: null,
            view: null,
          });
        } else {
          setSelectedFolder(null);

          updateURL({
            folder: null,
            note: null,
            view: null,
          });
        }

        setSelectedNoteId(null);
        setActiveNoteMode("view");
      }

      showSuccess("Folder deleted successfully!");
    } catch (err) {
      console.log(err);
      showError("Failed to delete folder");
    }
  };

  return (
    <div className="h-55 flex flex-col gap-1">
      {/* Header */}
      <div className="flex justify-between items-center h-5  ">
        <p className="text-(--text-heading) px-2 font-semibold text-[16px]">
          Folders
        </p>

        <FolderPlus
          className="w-5 h-5  cursor-pointer text-(--text-heading)"
          onClick={() => setIsCreating((prev) => !prev)}
        />
      </div>

      {/* Folder List */}
      <div className="flex flex-col h-50 gap-3 overflow-y-auto">
        {/* Create Folder Input */}
        {isCreating && (
          <div className="flex  items-center px-2 gap-15">
            <input
              type="text"
              value={newFolderName}
              autoFocus
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-(--card-bg) text-(--text-primary) px-2 py-2 rounded border border-(--border-color) outline-none"
              placeholder="New folder name"
            />

            <Plus
              onClick={handleCreateFolder}
              className="w-5 h-5 cursor-pointer text-(--text-primary)"
            />
          </div>
        )}

        {/* No result */}
        {searchText && filteredFolders.length === 0 && (
          <p className="text-(--text-secondary)">No folders found</p>
        )}

        {/* Folder list */}
        {filteredFolders.map((folder) => {
          const isActive = selectedFolder?.id === folder.id;

          return (
            <div
              key={folder.id}
              className={`group flex items-center gap-3 w-full h-auto py-1 px-2 rounded-md cursor-pointer transition-all ${
                isActive ? "bg-(--hover-bg)" : "hover:bg-(--hover-bg)"
              }`}
              onClick={() => {
                setSelectedFolder(folder);
                setActiveNoteMode("view");
                setActiveView("all");

                updateURL({
                  folder: folder.id,
                  note: null,
                  view: null,
                });
              }}
            >
              {/* if clicked on the folder then icon will be different based on isActive value */}
              {isActive ? (
                <>
                  <FolderOpen className="w-5 h-5 text-(--text-primary)" />
                  <div className="flex justify-between w-full ">
                    {editingFolderId === folder.id ? (
                      <input
                        value={editedName}
                        autoFocus
                        onChange={(e) => setEditedName(e.target.value)}
                        className="bg-(--card-bg) text-(--text-primary) px-2 py-1 rounded border border-(--border-color) outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p
                        className={`font-semibold text-[18px] ${
                          isActive
                            ? "text-(--text-primary)"
                            : "text-(--text-secondary) group-hover:text-(--text-primary)"
                        }`}
                      >
                        {folder.name}
                      </p>
                    )}

                    <div className="flex gap-3">
                      {editingFolderId === folder.id ? (
                        <Check
                          className="w-5 h-5 text-green-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveFolder(folder.id);
                          }}
                        />
                      ) : (
                        <Pencil
                          className="w-5 h-5 text-(--text-primary) cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(folder);
                          }}
                        />
                      )}
                      {/* <Pencil className="w-5 h-5 text-(--text-primary)" /> */}
                      <Trash2
                        className="w-5 h-5 text-(--text-primary)"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Folder className="w-5 h-5 text-(--text-secondary) group-hover:text-(--text-primary)" />
                  <div className="flex justify-between w-full">
                    <p
                      className={`font-semibold text-[18px] ${
                        isActive
                          ? "text-(--text-primary)"
                          : "text-(--text-secondary) group-hover:text-(--text-primary)"
                      }`}
                    >
                      {" "}
                      {folder.name}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Folders;
