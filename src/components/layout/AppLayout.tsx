import React from "react";
import FolderList from "../sidebar/FolderList";
import SidebarHeader from "../sidebar/SidebarHeader";
import RecentNotes from "../sidebar/RecentNotes";
import QuickLinks from "../sidebar/More";
import NotesList from "../notesList/NotesList";
import NoteView from "../noteDetail/NoteView";

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen w-full bg-(--sidebar-bg) flex">
      <div className="flex w-90 h-screen flex-col gap-5 pt-7.5 pb-7.5 px-5">
        <div className="flex flex-col gap-6 flex-1 min-h-0">
          <SidebarHeader />
          <RecentNotes />
          <FolderList />
        </div>
        <div className="mt-auto">
          <QuickLinks />
        </div>
      </div>

      <NotesList />

      <div className="flex-1">
        <NoteView />
      </div>
    </div>
  );
};

export default AppLayout;
