import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-neutral-950">
      {/* Guitar emoji illustration */}
      <div className="mb-6 text-8xl">🎸</div>

      <h1 className="text-6xl font-extrabold text-neutral-900 dark:text-white">
        404
      </h1>
      <p className="mt-3 text-xl text-neutral-600 dark:text-neutral-400">
        Looks like this string broke.
      </p>
      <p className="mt-1 text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/lessons"
          className="flex items-center gap-2 rounded-xl border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition hover:border-amber-400 dark:border-neutral-700 dark:text-neutral-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Link>
      </div>
    </div>
  );
}
