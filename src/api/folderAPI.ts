import { api } from "./apiClient";
import type {
  GetRecentNotesResponseType,
  GetFoldersResponseType,
  CreateFolderResponseType,
  UpdateResponseType,
  DeleteResponseType,
} from "../components/types/dataTypes";

export const getRecentFolders = () => {
  return api.get<GetRecentNotesResponseType>("/notes/recent");
};

export const getFoldersData = () => {
  return api.get<GetFoldersResponseType>("/folders");
};

export const createFolder = (name: string) => {
  return api.post<CreateFolderResponseType>("/folders", { name });
};

export const updateFolder = (id: string, name: string) => {
  return api.patch<UpdateResponseType>(`/folders/${id}`, { name });
};

export const deleteFolder = (folderId: string) => {
  return api.delete<DeleteResponseType>(`/folders/${folderId}`);
};
