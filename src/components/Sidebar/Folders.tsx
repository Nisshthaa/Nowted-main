import React, { useEffect, useState } from "react";
import { Folder, FolderPlus, Plus, FolderOpen } from "lucide-react";
import { getFoldersData, createFolder } from "../../Api/folders";
import { useApp } from "../../context/useApp";
import { showError, showSuccess } from "../utils/toaster";

const Folders: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  const {
    setSelectedFolder,
    setActiveNoteMode,
    folders,
    setFolder,
    setActiveView,
    selectedFolder,
    searchText,
  } = useApp();

    useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300); // 300ms delay

    return () => clearTimeout(handler); 
  }, [searchText]);

  useEffect(() => {
    const getFolders = async () => {
      try {
        const response = await getFoldersData();
        setFolder(response.data.folders);

        if (response.data.folders.length > 0) {
          setSelectedFolder(response.data.folders[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getFolders();
  }, []);

  const filteredFolders =
    debouncedSearch.trim() === ""
      ? folders
      : folders.filter((folder) =>
          folder.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName);

      const response = await getFoldersData();
      setFolder(response.data.folders);

      setNewFolderName("");
      setIsCreating(false);
      showSuccess("Folder Created Successfully!")
    } catch (err) {
      console.log(err);
      showError("Failed to create Folder!")
    }
  };
  return (
    <div >
      {/* Header */}
      <div className="flex justify-between items-center h-5 ">
        <p className="text-(--text-secondary) font-semibold text-[16px]">
          Folders
        </p>

        <FolderPlus
          className="w-5 h-5 text-(--text-secondary) cursor-pointer"
          onClick={() => setIsCreating(true)}
        />
      </div>

      {/* Folder List */}
      <div className="flex flex-col h-50 gap-1.25 overflow-y-auto overflow-x-hidden">
        {/* Create Folder Input */}
        {isCreating && (
          <div className="flex h-39 gap-4">
            <FolderPlus className="w-5 h-5 text-(--text-secondary)" />
            <input
              type="text"
              value={newFolderName}
              autoFocus
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-[#2a2a2a] text-white px-2 py-1 rounded outline-none"
              placeholder="New folder name"
            />
            <Plus
              onClick={handleCreateFolder}
              className="w-5 h-5 text-(--text-secondary) cursor-pointer"
            />
          </div>
        )}

        {/* No result */}
        {searchText && filteredFolders.length === 0 && (
          <p className="text-(--text-secondary)">No folders found</p>
        )}

        {/* Folders */}
        {filteredFolders.map((folder) => {
          const isActive = selectedFolder?.id === folder.id;

          return (
            <div
              key={folder.id}
              className="flex items-center py-2 gap-4 cursor-pointer hover:bg-[#FFFFFF1A]"
              onClick={() => {
                setSelectedFolder(folder);
                setActiveNoteMode("view");
                setActiveView("all");
              }}
            >
              {isActive ? (
                <>
                  <FolderOpen className="w-5 h-5 text-(--text-primary)" />
                  <p className="text-(--text-primary) font-semibold text-[18px]">
                    {folder.name}
                  </p>
                </>
              ) : (
                <>
                  <Folder className="w-5 h-5 text-(--text-secondary)" />
                  <p className="text-(--text-secondary) font-semibold text-[18px] hover:text-white">
                    {folder.name}
                  </p>
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
