"use client";

import { BookOpen, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GradeCard } from "@/components/lessons/GradeCard";

interface Grade {
  id: string;
  number: number;
  title: string;
  description: string;
  totalModules: number;
  completedModules: number;
  progressPercent: number;
}

export default function LessonsPage() {
  const { user } = useCurrentUser();

  const { data: grades, isLoading } = useQuery<Grade[]>({
    queryKey: ["grades"],
    queryFn: async () => {
      const res = await fetch("/api/grades");
      if (!res.ok) throw new Error("Failed to fetch grades");
      return res.json();
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white">
          <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          Lessons
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Follow the structured curriculum from Grade 1 through to advanced
          playing. Complete each module to unlock the next.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : grades && grades.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grades.map((grade) => (
            <GradeCard
              key={grade.id}
              {...grade}
              isCurrentGrade={user?.currentGradeId === grade.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            No lessons yet
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            Lessons will appear here once the database is seeded. Run{" "}
            <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
              npx prisma db seed
            </code>{" "}
            to get started.
          </p>
        </div>
      )}
    </div>
  );
}
