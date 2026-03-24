import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-5">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Skeleton className="mx-auto mb-2 h-8 w-12" />
            <Skeleton className="mx-auto h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Badges section */}
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
