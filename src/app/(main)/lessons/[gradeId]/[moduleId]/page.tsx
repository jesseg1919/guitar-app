"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Clock,
  Lightbulb,
  ListChecks,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ModuleData {
  id: string;
  gradeId: string;
  title: string;
  description: string;
  order: number;
  videoUrl: string | null;
  durationMinutes: number;
  contentMarkdown: string;
  keyTakeaways: string[];
  practiceChecklist: string[];
  chordsIntroduced: string[];
  grade: {
    id: string;
    number: number;
    title: string;
  };
  prevModule: { id: string; title: string; order: number } | null;
  nextModule: { id: string; title: string; order: number } | null;
  totalModulesInGrade: number;
  userProgress: {
    completed: boolean;
    completedAt: string | null;
    videoProgress: number;
    checklistCompleted: string[];
  } | null;
}

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const gradeId = params.gradeId as string;
  const moduleId = params.moduleId as string;

  const [showCelebration, setShowCelebration] = useState(false);

  const { data: module, isLoading } = useQuery<ModuleData>({
    queryKey: ["module", moduleId],
    queryFn: async () => {
      const res = await fetch(`/api/modules/${moduleId}`);
      if (!res.ok) throw new Error("Failed to fetch module");
      return res.json();
    },
  });

  // Progress mutations
  const progressMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/modules/${moduleId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module", moduleId] });
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  const toggleChecklist = (item: string) => {
    if (!module?.userProgress || !session) return;
    const current = module.userProgress.checklistCompleted || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    progressMutation.mutate({ checklistCompleted: updated });
  };

  const markComplete = () => {
    progressMutation.mutate(
      { completed: true },
      {
        onSuccess: (data) => {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        },
      }
    );
  };

  const markIncomplete = () => {
    progressMutation.mutate({ completed: false });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <p className="text-neutral-500">Module not found.</p>
      </div>
    );
  }

  const isComplete = module.userProgress?.completed ?? false;
  const checklistCompleted = module.userProgress?.checklistCompleted ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-bounce rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-neutral-900">
            <Trophy className="mx-auto mb-4 h-16 w-16 text-amber-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Lesson Complete!
            </h2>
            <p className="mt-2 text-neutral-500">+25 XP earned</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link
          href="/lessons"
          className="hover:text-neutral-900 dark:hover:text-white"
        >
          Lessons
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/lessons/${gradeId}`}
          className="hover:text-neutral-900 dark:hover:text-white"
        >
          Grade {module.grade.number}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-900 dark:text-white">
          Module {module.order}
        </span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Grade {module.grade.number} &middot; Module {module.order} of{" "}
            {module.totalModulesInGrade}
          </span>
          {isComplete && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {module.title}
        </h1>
        {module.durationMinutes > 0 && (
          <p className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
            <Clock className="h-4 w-4" />
            {module.durationMinutes} minute lesson
          </p>
        )}
      </div>

      {/* Video player */}
      {module.videoUrl ? (
        <div className="mb-8 overflow-hidden rounded-xl">
          <div className="aspect-video">
            <iframe
              src={module.videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="mb-8 flex aspect-video items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <p className="text-neutral-400">Video coming soon</p>
        </div>
      )}

      {/* Lesson content */}
      <div className="mb-8">
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:text-neutral-900 dark:prose-headings:text-white prose-a:text-amber-600 dark:prose-a:text-amber-400">
          {/* Render markdown as simple paragraphs (a markdown renderer can be added later) */}
          {module.contentMarkdown.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="mt-8 mb-4 text-xl font-bold">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={i} className="mt-6 mb-3 text-lg font-semibold">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            return (
              <p key={i} className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Key Takeaways */}
      {module.keyTakeaways.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/20">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
            <Lightbulb className="h-5 w-5" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {module.keyTakeaways.map((takeaway, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practice Checklist */}
      {module.practiceChecklist.length > 0 && (
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
            <ListChecks className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Practice This
          </h3>
          {!session ? (
            <p className="text-sm text-neutral-500">
              <Link href="/login" className="text-amber-600 hover:underline dark:text-amber-400">
                Sign in
              </Link>{" "}
              to track your practice checklist progress.
            </p>
          ) : (
            <ul className="space-y-2">
              {module.practiceChecklist.map((item, i) => {
                const checked = checklistCompleted.includes(item);
                return (
                  <li key={i}>
                    <button
                      onClick={() => toggleChecklist(item)}
                      className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      {checked ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-neutral-300 dark:text-neutral-600" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          checked
                            ? "text-neutral-400 line-through"
                            : "text-neutral-700 dark:text-neutral-300"
                        )}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Complete / Mark as incomplete button */}
      {session && (
        <div className="mb-8">
          {isComplete ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Lesson complete!</span>
              </div>
              <button
                onClick={markIncomplete}
                className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                Mark as incomplete
              </button>
            </div>
          ) : (
            <button
              onClick={markComplete}
              disabled={progressMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-5 w-5" />
              {progressMutation.isPending
                ? "Saving..."
                : "Mark Lesson Complete"}
            </button>
          )}
        </div>
      )}

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-800">
        {module.prevModule ? (
          <Link
            href={`/lessons/${gradeId}/${module.prevModule.id}`}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{module.prevModule.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {module.nextModule ? (
          <Link
            href={`/lessons/${gradeId}/${module.nextModule.id}`}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            <span className="hidden sm:inline">{module.nextModule.title}</span>
            <span className="sm:hidden">Next Lesson</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/lessons/${gradeId}`}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Back to Grade
          </Link>
        )}
      </div>
    </div>
  );
}
