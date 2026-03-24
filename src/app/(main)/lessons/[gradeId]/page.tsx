"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { ModuleCard } from "@/components/lessons/ModuleCard";

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  durationMinutes: number;
  completed: boolean;
  isLocked: boolean;
  videoProgress: number;
  chordsIntroduced: string[];
}

interface GradeWithModules {
  id: string;
  number: number;
  title: string;
  description: string;
  modules: Module[];
}

export default function GradeDetailPage() {
  const params = useParams();
  const gradeId = params.gradeId as string;

  const { data: grade, isLoading } = useQuery<GradeWithModules>({
    queryKey: ["grade", gradeId],
    queryFn: async () => {
      const res = await fetch(`/api/grades/${gradeId}/modules`);
      if (!res.ok) throw new Error("Failed to fetch grade");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!grade) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <p className="text-neutral-500">Grade not found.</p>
      </div>
    );
  }

  const completedCount = grade.modules.filter((m) => m.completed).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Back link */}
      <Link
        href="/lessons"
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All Grades
      </Link>

      {/* Grade header */}
      <div className="mb-8">
        <div className="mb-2 inline-flex rounded-lg bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Grade {grade.number}
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {grade.title}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {grade.description}
        </p>

        {/* Progress summary */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-neutral-500">
              <span>
                {completedCount} / {grade.modules.length} modules complete
              </span>
              <span>
                {grade.modules.length > 0
                  ? Math.round(
                      (completedCount / grade.modules.length) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{
                  width: `${
                    grade.modules.length > 0
                      ? (completedCount / grade.modules.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {grade.modules.map((mod) => (
          <ModuleCard
            key={mod.id}
            {...mod}
            gradeId={gradeId}
          />
        ))}
      </div>

      {grade.modules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="text-neutral-500">
            No modules in this grade yet. Seed the database to populate lessons.
          </p>
        </div>
      )}
    </div>
  );
}
