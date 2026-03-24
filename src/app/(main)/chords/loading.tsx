import { Skeleton } from "@/components/ui/Skeleton";

export default function ChordsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <Skeleton className="mb-2 h-9 w-48" />
      <Skeleton className="mb-8 h-5 w-80" />

      {/* Search & filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-11 w-64 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      {/* Chord grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Skeleton className="mx-auto mb-3 h-28 w-20 rounded-lg" />
            <Skeleton className="mx-auto mb-2 h-5 w-16" />
            <Skeleton className="mx-auto h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
