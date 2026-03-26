import Folders from "../Sidebar/Folders";
import Header from "../Sidebar/Header";
import Recent from "../Sidebar/Recent";
import More from "../Sidebar/More";
import Notes from "../NotesList/Notes";
import NotesDetails from "../NotesDetail/NotesDetails";

const Layout: React.FC = () => {

  return (
    <div className="h-screen w-full bg-[#181818] flex">
      {/* LEFT */}
      <div className="flex w-90 h-screen flex-col gap-5 pt-7.5 pb-7.5 px-5  ">
        <Header />
        <Recent/>
        <Folders/>
        <More />
      </div>

      {/* MIDDLE */}

      <Notes />

      {/* RIGHT */}
      <div className="flex-1 bg-[#181818]">
        <NotesDetails />
      </div>
    </div>
  );
};

export default Layout;
