import type {
  GetNotesParams,
  CreateNoteData,
  UpdateNoteData,
  DeleteNoteData,
  GetNotesResponseType,
  GetNoteDetailResponseType,
  CreateNoteResponseType,
  UpdateResponseType,
  DeleteResponseType,
  RestoreNoteResponseType,
} from "../components/types/dataTypes";
import { api } from "./apiClient";

export const getNotes = (params: GetNotesParams) => {
  return api.get<GetNotesResponseType>("/notes", { params });
};

export const getNotesData = (notesId: string) => {
  return api.get<GetNoteDetailResponseType>(`/notes/${notesId}`);
};

export const createNote = (data: CreateNoteData) => {
  return api.post<CreateNoteResponseType>("/notes", data);
};

export const updateNote = (id: string, data: UpdateNoteData) => {
  return api.patch<UpdateResponseType>(`/notes/${id}`, data);
};

export const deleteNote = (id: string, data: DeleteNoteData) => {
  return api.delete<DeleteResponseType>(`/notes/${id}`, { data });
};

export const restoreNote = (id: string) => {
  return api.post<RestoreNoteResponseType>(`/notes/${id}/restore`);
};