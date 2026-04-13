export type BaseNote = {
  id: string;
  title: string;
  createdAt: string;
  isFavorite:boolean;
  isArchived:boolean
};

export type Folder = {
  id: string;
  name: string;
};

export type Note = BaseNote & {
  preview: string;
  folderId?: string;
  deletedAt?: string | null;
  isFavorite?:boolean;
  isArchived?:boolean;
  updatedAt?: string;
};

export type FullNote = BaseNote & {

  content: string;
  folder?: Folder;
  deletedAt?: string | null;
};

export type DeletedFilter = "true" | "false";

export type GetNotesParams = {
  folderId?: string;
  favorite?: boolean;
  archived?: boolean;
  limit?: number;
  deleted?: DeletedFilter;
  page?: number;
  search?: string;
};

export type CreateNoteData = {
  title: string;
  content: string;
  folderId: string;
  isFavorite?:boolean;
  isArchived?:boolean
};

export type UpdateNoteData = {
  isFavorite?: boolean;
  isArchived?: boolean;
  deletedAt?: string | null;
  content?: string | null;
  title?: string | null;
};

export type DeleteNoteData = {
  deletedAt?: string | null;
};

export type RestoreProps = {
  noteId: string;
  noteTitle: string;
};

export type GetNotesResponseType = {
  notes: Note[];
};

export type GetRecentNotesResponseType = {
  recentNotes: Note[];
};

export type GetNoteDetailResponseType = {
  note: FullNote;
};

export type GetFoldersResponseType = {
  folders: Folder[];
};

export type CreateNoteResponseType = {
  id: string;
};

export type CreateFolderResponseType = {
  id: string;
};

export type UpdateResponseType = {
  success: boolean;
};

export type DeleteResponseType = {
  success: boolean;
};

export type RestoreNoteResponseType = {
  success: boolean;
};
