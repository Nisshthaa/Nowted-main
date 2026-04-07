import type { GetNotesParams } from "../components/types";
import { api } from "./Axios";

export const getNotes = (params: GetNotesParams) => {
  return api.get("/notes", { params });
};

export const getNotesData = (NotesId: string) => {
  return api.get(`/notes/${NotesId}`);
};

export const createNote = (data: {
  title: string;
  content: string;
  folderId: string;
}) => {
  return api.post("/notes", data);
};
export const updateNote =async (
  id: string,
  data: { isFavorite?: boolean; isArchived?: boolean; deletedAt?:string|null},
) => {
  return await api.patch(`/notes/${id}`, data);
};


export const deleteNote =async (
  id: string,
  data: { deletedAt?: string | null }
) => {
  return await api.delete(`/notes/${id}`, {data}); 
};

export const restoreNote = async(id: string) => {
  return await api.post(`/notes/${id}/restore`);
};