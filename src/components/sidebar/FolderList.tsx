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
} from "../../api/folderAPI";
import { useAppState } from "../../state/useAppState";
import { showError, showSuccess } from "../utils/notifications";
import type { Folder as FolderType } from "../types/dataTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { buildFolderPath, parseRouteState } from "../utils/urlHelpers";
import { FolderListSkeleton } from "../Loader/LoadData";

const FolderList: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [loadingFolders, setLoadingFolders] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { folderId, view } = parseRouteState(location.pathname);

  const {
    setSelectedFolder,
    setActiveNoteMode,
    folders,
    setFolders,
    setActiveView,
    setSelectedNoteId,
    selectedFolder,
    searchText,
  } = useAppState();

  const initialFolderId = useRef(folderId);
  const initialView = useRef(view);
  const initialSelectedFolder = useRef(selectedFolder);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    const getFolders = async () => {
      try {
        setLoadingFolders(true);
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
      } finally {
        setLoadingFolders(false);
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
      setSelectedFolder(null);

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

          navigate(buildFolderPath(next.name, next.id));
        } else {
          setSelectedFolder(null);
          navigate("/");
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
    <div className="flex flex-col flex-1 gap-4 min-h-0  ">
      <div className="flex justify-between items-center h-5  ">
        <p className="text-(--text-heading) px-2 font-semibold text-[18px]">
          Folders
        </p>

        <FolderPlus
          className="w-6 h-6 ursor-pointer text-(--text-heading)"
          onClick={() => {
            setIsCreating((prev) => !prev);
            setNewFolderName("");
          }}
        />
      </div>

      <div className="flex flex-col flex-1 gap-3 overflow-y-auto min-h-0">
        {loadingFolders && <FolderListSkeleton />}

        {!loadingFolders && isCreating && (
          <div className="flex justify-between items-center  ">
            <input
              type="text"
              value={newFolderName}
              autoFocus
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-(--card-bg) text-(--text-primary) px-2 py-1 rounded border border-(--border-color) outline-none"
              placeholder="New folder name"
            />

            <Plus
              onClick={handleCreateFolder}
              className="w-6 h-6 cursor-pointer text-(--text-primary)"
            />
          </div>
        )}

        {!loadingFolders && debouncedSearch && filteredFolders.length === 0 && (
          <p className="text-(--text-secondary)">No folders found</p>
        )}

        {!loadingFolders && filteredFolders.map((folder) => {
          const isActive = selectedFolder?.id === folder.id;

          return (
            <div
              key={folder.id}
              className={`group flex items-center gap-3 w-full h-18.5 py-1 px-1 rounded-md cursor-pointer transition-all ${
                isActive ? "bg-(--hover-bg)" : "hover:bg-(--hover-bg)"
              }`}
              onClick={() => {
                setSelectedFolder(folder);
                setActiveNoteMode("view");
                setActiveView("all");
                navigate(buildFolderPath(folder.name, folder.id));
              }}
            >
              {isActive ? (
                <>
                  <FolderOpen className="w-6 h-7 text-(--text-primary)" />
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
                          className="w-6 h-6 text-green-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveFolder(folder.id);
                          }}
                        />
                      ) : (
                        <Pencil
                          className="w-6 h-6 text-(--text-primary) cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(folder);
                          }}
                        />
                      )}
                      <Trash2
                        className="w-6 h-6 text-(--text-primary)"
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
                  <Folder className="w-6 h-6 text-(--text-secondary) group-hover:text-(--text-primary)" />
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

export default FolderList;
