import React, { useEffect, useState } from "react";
import { Folder, FolderPlus, Plus, FolderOpen } from "lucide-react";
import { getFoldersData } from "../../Api/folders";
import { useApp } from "../../context/useApp";
import { createFolder } from "../../Api/folders";

const Folders: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { setSelectedFolder, setActiveNoteMode,folders,setFolder,setActiveView, selectedFolder } = useApp();

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
  },[]);

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
      <div className="flex justify-between items-center h-5 ">
        <p
          className="text-(--text-secondary) font-semibold text-[16px]"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Folders
        </p>

        <FolderPlus
          className="w-5 h-5 text-(--text-secondary) cursor-pointer"
          onClick={() => setIsCreating(true)}
        />
      </div>
      <div className="flex flex-col h-50 gap-1.25 overflow-y-auto overflow-x-hidden">
        {isCreating && (
          <div className="flex  h-39 gap-4 cursor-pointer">
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

        {folders.map((folder) => {
          const isActive = selectedFolder?.id === folder.id;
          return (
            <div
              className="flex h-25items-center py-2 gap-4 cursor-pointer hover:bg-[#FFFFFF1A]
]"
              key={folder.id}
              onClick={() => {
                setSelectedFolder(folder);
                setActiveNoteMode("view");
                setActiveView("all")
              }}
            >
              {isActive ? (
                <>
                <FolderOpen className="w-5 h-5 text-(--text-primary) " />
                 <p
                className="text-(--text-primary) font-semibold text-[18px] hover:text-white"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                {folder.name}
              </p>
                </>
              ) : (
                <>
                <Folder className="w-5 h-5 text-(--text-primary) " />
                 <p
                className="text-(--text-secondary) font-semibold text-[18px] hover:text-white"
                style={{ fontFamily: "var(--font-primary)" }}
              >
                {folder.name}
              </p>
                </>
              )}
             
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Folders;
