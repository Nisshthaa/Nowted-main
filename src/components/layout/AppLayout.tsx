import React from "react";
import SidebarHeader from "../sidebar/SidebarHeader";
import FolderList from "../sidebar/FolderList";
import RecentNotes from "../sidebar/RecentNotes";
import More from "../sidebar/More";
import NotesList from "../notesList/NotesList";

import { Outlet } from "react-router-dom";

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--bg-primary)">
      <aside className="flex h-full w-80 flex-col gap-6 border-r border-(--border-color) bg-(--sidebar-bg) p-5">
        <SidebarHeader />
        <RecentNotes />
        <FolderList />

        <More />
      </aside>

      <NotesList />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
