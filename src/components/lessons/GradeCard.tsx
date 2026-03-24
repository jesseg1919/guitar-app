"use client";

import Link from "next/link";
import { ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradeCardProps {
  id: string;
  number: number;
  title: string;
  description: string;
  totalModules: number;
  completedModules: number;
  progressPercent: number;
  isCurrentGrade?: boolean;
}

export function GradeCard({
  id,
  number,
  title,
  description,
  totalModules,
  completedModules,
  progressPercent,
  isCurrentGrade,
}: GradeCardProps) {
  const isComplete = progressPercent === 100;

  return (
    <Link
      href={`/lessons/${id}`}
      className={cn(
        "group relative rounded-2xl border p-6 transition-all hover:shadow-md",
        isCurrentGrade
          ? "border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20"
          : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
        isComplete && "border-emerald-300 dark:border-emerald-800"
      )}
    >
      {/* Badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex rounded-lg px-3 py-1 text-sm font-semibold",
            isComplete
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : isCurrentGrade
                ? "bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          )}
        >
          Grade {number}
        </span>
        {isComplete && (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        )}
        {isCurrentGrade && !isComplete && (
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Current
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>

      {/* Module count & progress */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-neutral-500">
          <span>
            {completedModules} / {totalModules} modules
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isComplete
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-amber-500 to-orange-500"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-amber-500 dark:text-neutral-600" />
    </Link>
  );
}
