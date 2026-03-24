import React, { useEffect, useState } from "react";
import { Folder, FolderPlus, Plus } from "lucide-react";
import type { folder } from "../types";
import { getFoldersData } from "../../Api/folders";
import { useApp } from "../../context/useApp";
import { createFolder } from "../../Api/folders";

const Folders: React.FC = () => {
  const [folders, setFolder] = useState<folder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { setSelectedFolder } = useApp();

  useEffect(() => {
    const getFolders = async () => {
      try {
        const response = await getFoldersData();
        setFolder(response.data.folders);
      } catch (err) {
        console.log(err);
      }
    };
    getFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName);
      const response = await getFoldersData();
      setFolder(response.data.folders);

      setNewFolderName("");
      setIsCreating(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center h-5 w-80 pr-5 pl-5">
        <p
          className="text-(--text-secondary) font-semibold "
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Folders
        </p>

        <FolderPlus
          className="w-5 h-5 text-(--text-secondary) cursor-pointer"
          onClick={() => setIsCreating(true)}
        />
      </div>
      <div className="flex flex-col w-80 h-60 pr-5 pl-5 gap-1.25 overflow-y-auto overflow-x-hidden">
        {isCreating && (
          <div className="flex w-80 h-39 gap-4 cursor-pointer">
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

        {folders.map((folder) => (
          <div
            className="flex w-80 h-39 gap-4 cursor-pointer"
            key={folder.id}
            onClick={() => setSelectedFolder(folder)}
          >
            <Folder className="w-5 h-5 text-(--text-primary) " />
            <p
              className="text-(--text-primary) font-semibold "
              style={{ fontFamily: "var(--font-primary)" }}
            >
              {folder.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Folders;
