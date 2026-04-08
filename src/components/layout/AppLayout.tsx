import React from "react";
import SidebarHeader from "../sidebar/SidebarHeader";
import FolderList from "../sidebar/FolderList";
import RecentNotes from "../sidebar/RecentNotes";
import QuickLinks from "../sidebar/More";
import NotesList from "../notesList/NotesList";
import NoteView from "../noteDetail/NoteView";

const AppLayout: React.FC = () => {
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
};

export default AppLayout;
