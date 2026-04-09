import React from "react";
import { StateProvider } from "./state/StateProvider";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import { Navigate, Route, Routes } from "react-router-dom";



const App: React.FC = () => {
  return (
    <StateProvider>
      <Routes>
        <Route path="/" element={<AppLayout />} />

        <Route path="/favorites" element={<AppLayout />} />
        <Route path="/favorites/:noteId" element={<AppLayout />} />

        <Route path="/archived" element={<AppLayout />} />
        <Route path="/archived/:noteId" element={<AppLayout />} />

        <Route path="/trash" element={<AppLayout />} />
        <Route path="/trash/:noteId" element={<AppLayout />} />

        <Route path="/folder/:folderId" element={<AppLayout />} />
        <Route path="/folder/:folderId/create" element={<AppLayout />} />
        <Route path="/folder/:folderId/:noteId" element={<AppLayout />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </StateProvider>
  );
};

export default App;
