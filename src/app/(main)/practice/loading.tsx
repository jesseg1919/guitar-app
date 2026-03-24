import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function PracticeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <Skeleton className="mb-2 h-9 w-48" />
      <Skeleton className="mb-8 h-5 w-64" />

      {/* Featured card */}
      <Skeleton className="mb-8 h-36 w-full rounded-2xl" />

      {/* Tool grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
