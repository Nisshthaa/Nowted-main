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
};

export type RestoreProps = {
  noteId: string;
  noteTitle:string
};
