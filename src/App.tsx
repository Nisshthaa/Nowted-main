import React from "react";
import { Routes, Route } from "react-router-dom";
import { StateProvider } from "./state/StateProvider";
import { Toaster } from "react-hot-toast";

import AppLayout from "./components/layout/AppLayout";
import NoteView from "./components/noteDetail/NoteView";

const App: React.FC = () => {
  return (
    <StateProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<NoteView />} />

          <Route path="create" element={<NoteView />} />

          <Route path="favorites" element={<NoteView />} />
          <Route path="favorites/:noteName/:noteId" element={<NoteView />} />

          <Route path="trash" element={<NoteView />} />
          <Route path="trash/:noteName/:noteId" element={<NoteView />} />

          <Route path="archived" element={<NoteView />} />
          <Route path="archived/:noteName/:noteId" element={<NoteView />} />

          <Route path=":folderName/:folderId" element={<NoteView />} />
          <Route path=":folderName/:folderId/create" element={<NoteView />} />
          <Route
            path=":folderName/:folderId/:noteName/:noteId"
            element={<NoteView />}
          />
        </Route>
      </Routes>

      <Toaster />
    </StateProvider>
  );
};

export default App;