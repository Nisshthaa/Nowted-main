import type { GetNotesParams } from "../components/types/dataTypes";
import { api } from "./apiClient";

export const getNotes = (params: GetNotesParams) => {
  return api.get("/notes", { params });
};

<<<<<<< HEAD
export const getNotesData = (NotesId: string) => {
  return api.get(`/notes/${NotesId}`);
=======
export const getNotesData = (notesId: string) => {
  return api.get(`/notes/${notesId}`);
>>>>>>> test
};

export const createNote = (data: {
  title: string;
  content: string;
  folderId: string;
}) => {
  return api.post("/notes", data);
};

<<<<<<< HEAD

export const updateNote =async (
  id: string,
  data: { isFavorite?: boolean; isArchived?: boolean; deletedAt?:string|null},
=======
export const updateNote = async (
  id: string,
  data: { isFavorite?: boolean; isArchived?: boolean; deletedAt?: string | null },
>>>>>>> test
) => {
  return await api.patch(`/notes/${id}`, data);
};

<<<<<<< HEAD

export const deleteNote =async (
  id: string,
  data: { deletedAt?: string | null }
) => {
  return await api.delete(`/notes/${id}`, {data});
};

export const restoreNote = async(id: string) => {
=======
export const deleteNote = async (
  id: string,
  data: { deletedAt?: string | null },
) => {
  return await api.delete(`/notes/${id}`, { data });
};

export const restoreNote = async (id: string) => {
>>>>>>> test
  return await api.post(`/notes/${id}/restore`);
};
