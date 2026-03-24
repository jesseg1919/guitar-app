import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function LessonsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <Skeleton className="mb-2 h-9 w-64" />
      <Skeleton className="mb-8 h-5 w-96" />

      {/* Progress overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Skeleton className="mb-3 h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Grade cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
