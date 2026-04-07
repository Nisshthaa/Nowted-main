import Folders from "../Sidebar/Folders";
import Header from "../Sidebar/Header";
import Recent from "../Sidebar/Recent";
import More from "../Sidebar/More";
import Notes from "../NotesList/Notes";
import NotesDetails from "../NotesDetail/NotesDetails";

const Layout: React.FC = () => {
  return (
    <div className="h-screen w-full bg-(--sidebar-bg) flex">
      {/* left */}
      <div className="flex w-90 h-screen flex-col justify-between pt-7.5 pb-7.5 px-5  ">
        <div className="flex w-90 flex-col gap-6   ">
          <Header />
          <Recent />
          <Folders />
        </div>
        <More />
      </div>

      {/* MIDDLE */}

      <Notes />

      {/* RIGHT */}
      <div className="flex-1 ">
        <NotesDetails />
      </div>
    </div>
  );
};

export default Layout;
