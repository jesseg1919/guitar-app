"use client";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}
    />
  );
}

// Reusable skeleton patterns
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      <Skeleton className="mb-4 h-5 w-2/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-4/5" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
