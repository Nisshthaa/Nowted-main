export type Note = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  folderId:string
};

export type FullNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type folder = {
  id: string;
  name: string;
};

export type GetNotesParams = {
  folderId?: string;
  favorite?: boolean;
};
