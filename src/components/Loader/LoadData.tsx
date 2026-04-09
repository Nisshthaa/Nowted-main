import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const NoteSkeleton = () => (
  <div className="flex flex-col w-full p-4 gap-2 rounded-lg border border-(--border-color) bg-(--card-bg)">
    <Skeleton height={24} width="80%" />
    <div className="flex gap-4">
      <Skeleton height={16} width="30%" />
      <Skeleton height={16} width="40%" />
    </div>
  </div>
);

export const NoteListSkeleton = () => (
  <div className="flex flex-col gap-5">
    {Array.from({ length: 5 }).map((_, i) => (
      <NoteSkeleton key={i} />
    ))}
  </div>
);

export const FolderSkeleton = () => (
  <div className="flex items-center gap-3 w-full h-18.5 py-1 px-1 rounded-md">
    <Skeleton height={24} width={24} circle />
    <Skeleton height={24} width="60%" />
  </div>
);

export const FolderListSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <FolderSkeleton key={i} />
    ))}
  </div>
);

export const NoteViewSkeleton = () => (
  <div className="flex flex-col h-screen p-8 gap-8 bg-(--panel-bg)">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <Skeleton height={36} width="60%" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-25 max-w-md">
          <Skeleton height={20} width="120px" />
          <Skeleton height={20} width="150px" />
        </div>

        <hr className="border-(--border-color)" />

        <div className="flex gap-25 max-w-md">
          <Skeleton height={20} width="120px" />
          <Skeleton height={20} width="150px" />
        </div>
      </div>
    </div>

    <div className="flex-1 border border-(--border-color) rounded-lg p-6">
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} height={20} width="100%" />
        ))}
      </div>
    </div>
  </div>
);

export const RecentNotesSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} height={20} width="100%" />
    ))}
  </div>
);
