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

export const updateNote = (id: string, data: { isFavorite?: boolean }) => {
  return api.patch(`/notes/${id}`, data);
};