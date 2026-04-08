
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export const getPreview = (text: string) =>
  text.length > 20 ? text.slice(0, 20) + "..." : text;

export type RouteView = "favorites" | "archived" | "trash";

export type RouteState = {
  view: RouteView | null;
  folderName: string | null;
  folderId: string | null;
  noteId: string | null;
  mode: "create" | null;
};

const VIEW_SET = new Set<RouteView>(["favorites", "archived", "trash"]);

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const safeEncode = (value: string) => encodeURIComponent(value.trim() || "folder");

export const parseRouteState = (pathname: string): RouteState => {
  const parts = pathname
    .split("/")
    .filter(Boolean)
    .map(safeDecode);

  if (parts.length === 0) {
    return {
      view: null,
      folderName: null,
      folderId: null,
      noteId: null,
      mode: null,
    };
  }

  const [first, second, third] = parts;

  if (VIEW_SET.has(first as RouteView)) {
    return {
      view: first as RouteView,
      folderName: null,
      folderId: null,
      noteId: second ?? null,
      mode: null,
    };
  }

  if (!second) {
    return {
      view: null,
      folderName: first,
      folderId: null,
      noteId: null,
      mode: null,
    };
  }

  return {
    view: null,
    folderName: first,
    folderId: second,
    noteId: third && third !== "create" ? third : null,
    mode: third === "create" ? "create" : null,
  };
};

export const buildViewPath = (view: RouteView, noteId?: string | null) =>
  noteId ? `/${view}/${safeEncode(noteId)}` : `/${view}`;

export const buildFolderPath = (
  folderName: string,
  folderId: string,
  modeOrNote?: string | null,
) => {
  const base = `/${safeEncode(folderName)}/${safeEncode(folderId)}`;
  return modeOrNote ? `${base}/${safeEncode(modeOrNote)}` : base;
};
