"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Play,
  Lock,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

interface ModuleCardProps {
  id: string;
  gradeId: string;
  title: string;
  description: string;
  order: number;
  durationMinutes: number;
  completed: boolean;
  isLocked: boolean;
  videoProgress: number;
  chordsIntroduced?: string[];
}

export function ModuleCard({
  id,
  gradeId,
  title,
  description,
  order,
  durationMinutes,
  completed,
  isLocked,
  videoProgress,
  chordsIntroduced,
}: ModuleCardProps) {
  const content = (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border p-4 transition-all",
        isLocked
          ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60 dark:border-neutral-800 dark:bg-neutral-900/50"
          : completed
            ? "border-emerald-200 bg-emerald-50/50 hover:shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20"
            : "border-neutral-200 bg-white hover:border-amber-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
      )}
    >
      {/* Module number / status icon */}
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
          isLocked
            ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500"
            : completed
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        )}
      >
        {isLocked ? (
          <Lock className="h-4 w-4" />
        ) : completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          order
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-neutral-900 dark:text-white">
          {title}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          {durationMinutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {durationMinutes} min
            </span>
          )}
          {chordsIntroduced && chordsIntroduced.length > 0 && (
            <span className="flex items-center gap-1">
              Chords: {chordsIntroduced.join(", ")}
            </span>
          )}
        </div>

        {/* Video progress bar */}
        {!isLocked && !completed && videoProgress > 0 && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${videoProgress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Play / locked indicator */}
      {!isLocked && (
        <div className="flex-shrink-0 self-center">
          {completed ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Complete
            </span>
          ) : (
            <Play className="h-5 w-5 text-neutral-300 transition-colors group-hover:text-amber-500 dark:text-neutral-600" />
          )}
        </div>
      )}
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link href={`/lessons/${gradeId}/${id}`}>
      {content}
    </Link>
  );
}
