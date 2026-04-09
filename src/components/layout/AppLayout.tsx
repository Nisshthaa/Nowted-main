import FolderList from "../sidebar/FolderList";
import SidebarHeader from "../sidebar/SidebarHeader";
import RecentNotes from "../sidebar/RecentNotes";
<<<<<<< HEAD
import More from "../sidebar/More";
=======
import QuickLinks from "../sidebar/More";
>>>>>>> test
import NotesList from "../notesList/NotesList";
import NoteView from "../noteDetail/NoteView";

const AppLayout: React.FC = () => {
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
};

export default AppLayout;
