import React from "react";
import SidebarHeader from "../sidebar/SidebarHeader";
import FolderList from "../sidebar/FolderList";
import RecentNotes from "../sidebar/RecentNotes";
<<<<<<< HEAD
import More from "../sidebar/More";
=======
import QuickLinks from "../sidebar/More";
>>>>>>> test
import NotesList from "../notesList/NotesList";
import NoteView from "../noteDetail/NoteView";

const AppLayout: React.FC = () => {
<<<<<<< HEAD
  return (
    <div className="h-screen w-full bg-(--sidebar-bg) flex">
<<<<<<< HEAD
      {/* left */}
      <div className="flex w-90 h-screen flex-col gap-5 pt-7.5 pb-7.5 px-5  ">
        <div className="flex flex-col gap-6 flex-1 min-h-0 ">
=======
      <div className="flex w-90 h-screen flex-col gap-5 pt-7.5 pb-7.5 px-5">
        <div className="flex flex-col gap-6 flex-1 min-h-0">
>>>>>>> test
          <SidebarHeader />
          <RecentNotes />
          <FolderList />
        </div>
        <div className="mt-auto">
<<<<<<< HEAD
          <More/>
        </div>
      </div>

      {/* MIDDLE */}

      <NotesList />

      {/* RIGHT */}
      <div className="flex-1 ">
=======
          <QuickLinks />
        </div>
      </div>

      <NotesList />

      <div className="flex-1">
>>>>>>> test
        <NoteView />
      </div>
    </div>
  );
=======
	return (
		<div className="flex h-screen w-full overflow-hidden bg-(--bg-primary)">
			<aside className="flex h-full w-80 flex-col gap-6 border-r border-(--border-color) bg-(--sidebar-bg) p-5">
				<SidebarHeader />
				<QuickLinks />
				<FolderList />
				<RecentNotes />
			</aside>

			<NotesList />
			<main className="min-w-0 flex-1">
				<NoteView />
			</main>
		</div>
	);
>>>>>>> test
};

export default AppLayout;
