import { Skeleton } from "@/components/ui/Skeleton";

export default function AchievementsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <Skeleton className="mb-2 h-9 w-56" />
      <Skeleton className="mb-8 h-5 w-72" />

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Skeleton className="mx-auto mb-2 h-8 w-12" />
            <Skeleton className="mx-auto h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Badge grid */}
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Skeleton className="mb-3 h-14 w-14 rounded-full" />
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
