"use client";

import { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-neutral-950">
      <div className="mb-6 text-7xl">😵</div>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-neutral-500">
        An unexpected error occurred. Don&apos;t worry — your progress is saved.
        Try refreshing or go back to the home page.
      </p>

      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition hover:border-amber-400 dark:border-neutral-700 dark:text-neutral-300"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
