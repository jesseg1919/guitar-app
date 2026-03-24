import { Skeleton, ListItemSkeleton } from "@/components/ui/Skeleton";

export default function SongsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <Skeleton className="mb-2 h-9 w-48" />
      <Skeleton className="mb-8 h-5 w-72" />

      {/* Search & filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-11 w-64 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      {/* Song list */}
      <div className="flex flex-col gap-3">
        {[...Array(8)].map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
