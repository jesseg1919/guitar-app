"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FretboardDiagram, type FretboardData } from "@/components/chords/FretboardDiagram";
import { ChordCard } from "@/components/chords/ChordCard";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Music,
  Hand,
  Lightbulb,
} from "lucide-react";

interface ChordDetail {
  id: string;
  name: string;
  shortName: string;
  type: string;
  difficulty: string;
  fretboardData: FretboardData;
  notes?: string;
  tips?: string;
  commonSongs?: string;
  userProgress: {
    status: "LEARNING" | "MASTERED";
    startedAt: string;
    masteredAt: string | null;
  } | null;
  relatedChords: {
    id: string;
    name: string;
    shortName: string;
    difficulty: string;
    fretboardData: FretboardData;
  }[];
}

const difficultyColors: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INTERMEDIATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADVANCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const typeLabels: Record<string, string> = {
  OPEN: "Open Chord",
  BARRE: "Barre Chord",
  POWER: "Power Chord",
  SEVENTH: "7th Chord",
  MINOR_SEVENTH: "Minor 7th",
  MAJOR_SEVENTH: "Major 7th",
  SUSPENDED: "Suspended",
  DIMINISHED: "Diminished",
  AUGMENTED: "Augmented",
  ADD: "Add Chord",
  SLASH: "Slash Chord",
};

export default function ChordDetailPage() {
  const { chordId } = useParams<{ chordId: string }>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: chord, isLoading, error } = useQuery<ChordDetail>({
    queryKey: ["chord", chordId],
    queryFn: async () => {
      const res = await fetch(`/api/chords/${chordId}`);
      if (!res.ok) throw new Error("Failed to fetch chord");
      return res.json();
    },
  });

  const progressMutation = useMutation({
    mutationFn: async (status: "LEARNING" | "MASTERED") => {
      const res = await fetch(`/api/chords/${chordId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chord", chordId] });
      queryClient.invalidateQueries({ queryKey: ["chords"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/chords/${chordId}/progress`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chord", chordId] });
      queryClient.invalidateQueries({ queryKey: ["chords"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !chord) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-lg text-red-500">Chord not found.</p>
        <Link
          href="/chords"
          className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Chord Library
        </Link>
      </div>
    );
  }

  const currentStatus = chord.userProgress?.status || null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/chords"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Chord Library
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left Column — Diagram */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <FretboardDiagram
              data={chord.fretboardData}
              name={chord.shortName}
              size="lg"
              showFingers
            />
          </div>

          {/* Progress Buttons */}
          {session && (
            <div className="mt-6 flex w-full flex-col gap-2">
              {currentStatus !== "LEARNING" && currentStatus !== "MASTERED" && (
                <button
                  onClick={() => progressMutation.mutate("LEARNING")}
                  disabled={progressMutation.isPending}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                >
                  <BookOpen className="h-4 w-4" />
                  Start Learning
                </button>
              )}

              {currentStatus === "LEARNING" && (
                <>
                  <button
                    onClick={() => progressMutation.mutate("MASTERED")}
                    disabled={progressMutation.isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Mark as Mastered
                  </button>
                  <button
                    onClick={() => removeMutation.mutate()}
                    disabled={removeMutation.isPending}
                    className="text-sm text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    Remove from learning
                  </button>
                </>
              )}

              {currentStatus === "MASTERED" && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Mastered!</span>
                  </div>
                  <button
                    onClick={() => progressMutation.mutate("LEARNING")}
                    disabled={progressMutation.isPending}
                    className="text-sm text-neutral-400 hover:text-amber-500 transition-colors"
                  >
                    Move back to learning
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column — Details */}
        <div>
          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {chord.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {typeLabels[chord.type] || chord.type}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium",
                    difficultyColors[chord.difficulty] || "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {chord.difficulty.charAt(0) + chord.difficulty.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Finger Placement */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
              <Hand className="h-5 w-5 text-amber-500" />
              Finger Placement
            </h2>
            <div className="mt-3 space-y-2">
              {chord.fretboardData.strings.map((fret, i) => {
                const stringNames = ["Low E (6th)", "A (5th)", "D (4th)", "G (3rd)", "B (2nd)", "High E (1st)"];
                const finger = chord.fretboardData.fingers[i];
                const fingerNames = ["", "Index", "Middle", "Ring", "Pinky"];

                let description = "";
                if (fret === -1) {
                  description = "Muted — do not play";
                } else if (fret === 0) {
                  description = "Open string";
                } else {
                  const actualFret = fret + (chord.fretboardData.baseFret - 1);
                  description = `Fret ${actualFret}`;
                  if (finger > 0) {
                    description += ` — ${fingerNames[finger]} finger`;
                  }
                }

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-800/50"
                  >
                    <span className="w-24 font-medium text-neutral-600 dark:text-neutral-400">
                      {stringNames[i]}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          {chord.tips && (
            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Tips
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {chord.tips}
              </p>
            </div>
          )}

          {/* Common Songs */}
          {chord.commonSongs && (
            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                <Music className="h-5 w-5 text-amber-500" />
                Common Songs
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {chord.commonSongs}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Chords */}
      {chord.relatedChords.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
            Similar Chords
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {chord.relatedChords.map((related) => (
              <ChordCard
                key={related.id}
                id={related.id}
                name={related.name}
                shortName={related.shortName}
                type={chord.type}
                difficulty={related.difficulty}
                fretboardData={related.fretboardData as FretboardData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
