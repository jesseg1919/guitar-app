"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FretboardDiagram, type FretboardData } from "./FretboardDiagram";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";

interface ChordCardProps {
  id: string;
  name: string;
  shortName: string;
  type: string;
  difficulty: string;
  fretboardData: FretboardData;
  userStatus?: "LEARNING" | "MASTERED" | null;
}

const difficultyColors: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INTERMEDIATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADVANCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const typeLabels: Record<string, string> = {
  OPEN: "Open",
  BARRE: "Barre",
  POWER: "Power",
  SEVENTH: "7th",
  MINOR_SEVENTH: "m7",
  MAJOR_SEVENTH: "Maj7",
  SUSPENDED: "Sus",
  DIMINISHED: "Dim",
  AUGMENTED: "Aug",
  ADD: "Add",
  SLASH: "Slash",
};

export function ChordCard({
  id,
  name,
  shortName,
  type,
  difficulty,
  fretboardData,
  userStatus,
}: ChordCardProps) {
  return (
    <Link
      href={`/chords/${id}`}
      className="group relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
    >
      {/* Status badge */}
      {userStatus && (
        <div className="absolute right-3 top-3">
          {userStatus === "MASTERED" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <BookOpen className="h-5 w-5 text-amber-500" />
          )}
        </div>
      )}

      {/* Fretboard diagram */}
      <FretboardDiagram
        data={fretboardData}
        name={shortName}
        size="md"
      />

      {/* Info */}
      <div className="mt-2 w-full text-center">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {name}
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-2">
          <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {typeLabels[type] || type}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium",
              difficultyColors[difficulty] || "bg-neutral-100 text-neutral-500"
            )}
          >
            {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}
