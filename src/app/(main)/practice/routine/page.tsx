"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface RoutineStep {
  type: string;
  duration: number;
  description: string;
}

interface Routine {
  id: string;
  name: string;
  durationMinutes: number;
  isDefault: boolean;
  steps: RoutineStep[];
}

const stepTypeIcons: Record<string, string> = {
  warmup: "🤸",
  chord_practice: "🎸",
  chord_changes: "🔄",
  strumming: "🎵",
  song: "🎶",
  ear_training: "👂",
  review: "📝",
  metronome: "⏱️",
  free_practice: "🎼",
};

const stepTypeLinks: Record<string, string> = {
  chord_changes: "/practice/chord-trainer",
  strumming: "/practice/strumming",
  ear_training: "/practice/ear-training",
  metronome: "/practice/metronome",
};

export default function RoutinePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeLeft, setStepTimeLeft] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [routineComplete, setRoutineComplete] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: async () => {
      const res = await fetch("/api/practice/routines");
      if (!res.ok) throw new Error("Failed to fetch routines");
      return res.json();
    },
    enabled: !!session,
  });

  const logSessionMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      durationMinutes: number;
      details?: Record<string, unknown>;
    }) => {
      const res = await fetch("/api/practice/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to log session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["practiceStats"] });
    },
  });

  const playChime = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  const startRoutine = useCallback(
    (routine: Routine) => {
      setSelectedRoutine(routine);
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      setRoutineComplete(false);
      setTotalElapsed(0);

      const firstStep = routine.steps[0];
      setStepTimeLeft(firstStep.duration * 60);
      setIsRunning(true);
    },
    []
  );

  const advanceStep = useCallback(() => {
    if (!selectedRoutine) return;

    playChime();
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStepIndex);
    setCompletedSteps(newCompleted);

    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= selectedRoutine.steps.length) {
      // Routine complete
      setIsRunning(false);
      setRoutineComplete(true);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Log the practice session
      logSessionMutation.mutate({
        type: "DAILY_ROUTINE",
        durationMinutes: selectedRoutine.durationMinutes,
        details: {
          routineName: selectedRoutine.name,
          stepsCompleted: selectedRoutine.steps.length,
        },
      });
    } else {
      setCurrentStepIndex(nextIndex);
      setStepTimeLeft(selectedRoutine.steps[nextIndex].duration * 60);
    }
  }, [selectedRoutine, currentStepIndex, completedSteps, playChime, logSessionMutation]);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setStepTimeLeft((prev) => {
          if (prev <= 1) {
            advanceStep();
            return 0;
          }
          return prev - 1;
        });
        setTotalElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, advanceStep]);

  const togglePause = () => setIsRunning((r) => !r);

  const resetRoutine = () => {
    setIsRunning(false);
    setSelectedRoutine(null);
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setRoutineComplete(false);
    setTotalElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-neutral-500">
          Please{" "}
          <Link href="/login" className="text-amber-600 hover:underline">
            sign in
          </Link>{" "}
          to use practice routines.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <nav className="mb-6">
        <Link
          href="/practice"
          className="text-sm text-neutral-500 hover:text-amber-600 dark:text-neutral-400"
        >
          ← Practice Toolbox
        </Link>
      </nav>

      <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white">
        <ListChecks className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        Daily Practice Routine
      </h1>
      <p className="mt-2 mb-8 text-neutral-600 dark:text-neutral-400">
        Follow a structured routine to build consistency and track your practice.
      </p>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      )}

      {/* Routine Selection */}
      {!isLoading && !selectedRoutine && !routineComplete && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Choose a Routine
          </h2>
          {routines?.map((routine) => (
            <button
              key={routine.id}
              onClick={() => startRoutine(routine)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-left transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl dark:bg-amber-900/30">
                {routine.isDefault ? "⭐" : "📋"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 group-hover:text-amber-600 dark:text-white">
                  {routine.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {routine.steps.length} steps · {routine.durationMinutes} min
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400 transition group-hover:text-amber-500" />
            </button>
          ))}
        </div>
      )}

      {/* Active Routine */}
      {selectedRoutine && !routineComplete && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">
                {selectedRoutine.name}
              </h2>
              <p className="text-sm text-neutral-500">
                Step {currentStepIndex + 1} of {selectedRoutine.steps.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500">Total time</p>
              <p className="font-mono text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {formatTime(totalElapsed)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{
                width: `${(completedSteps.size / selectedRoutine.steps.length) * 100}%`,
              }}
            />
          </div>

          {/* Current Step */}
          <div className="mb-6 rounded-xl bg-amber-50 p-6 text-center dark:bg-amber-900/20">
            <span className="text-3xl">
              {stepTypeIcons[selectedRoutine.steps[currentStepIndex].type] || "🎯"}
            </span>
            <h3 className="mt-2 text-xl font-bold text-neutral-900 dark:text-white">
              {selectedRoutine.steps[currentStepIndex].description}
            </h3>
            <p className="mt-1 text-sm text-neutral-500 capitalize">
              {selectedRoutine.steps[currentStepIndex].type.replace("_", " ")}
            </p>

            {/* Timer */}
            <div className="mt-4">
              <span className="text-5xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                {formatTime(stepTimeLeft)}
              </span>
            </div>

            {/* Step progress */}
            <div className="mt-3 h-1.5 rounded-full bg-amber-200 dark:bg-amber-800">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{
                  width: `${((selectedRoutine.steps[currentStepIndex].duration * 60 - stepTimeLeft) / (selectedRoutine.steps[currentStepIndex].duration * 60)) * 100}%`,
                }}
              />
            </div>

            {/* Link to relevant tool */}
            {stepTypeLinks[selectedRoutine.steps[currentStepIndex].type] && (
              <Link
                href={stepTypeLinks[selectedRoutine.steps[currentStepIndex].type]}
                target="_blank"
                className="mt-3 inline-block text-xs text-amber-600 hover:underline dark:text-amber-400"
              >
                Open tool in new tab →
              </Link>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={togglePause}
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-white transition",
                isRunning
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </button>
            <button
              onClick={advanceStep}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-amber-400 hover:text-amber-600 dark:border-neutral-600 dark:text-neutral-400"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              onClick={resetRoutine}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-red-400 hover:text-red-500 dark:border-neutral-600 dark:text-neutral-400"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* Step List */}
          <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <h4 className="mb-3 text-sm font-medium text-neutral-500">All Steps</h4>
            <div className="space-y-1.5">
              {selectedRoutine.steps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                    i === currentStepIndex
                      ? "bg-amber-50 font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      : completedSteps.has(i)
                        ? "text-neutral-400 line-through"
                        : "text-neutral-600 dark:text-neutral-400"
                  )}
                >
                  {completedSteps.has(i) ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : i === currentStepIndex ? (
                    <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-[10px] dark:border-neutral-600">
                      {i + 1}
                    </span>
                  )}
                  <span className="flex-1 truncate">{step.description}</span>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {step.duration}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Routine Complete */}
      {routineComplete && selectedRoutine && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <Trophy className="mx-auto h-14 w-14 text-amber-500" />
          <h2 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">
            Routine Complete!
          </h2>
          <p className="mt-1 text-neutral-500">{selectedRoutine.name}</p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <Clock className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                {formatTime(totalElapsed)}
              </p>
              <p className="text-xs text-neutral-500">Duration</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                {selectedRoutine.steps.length}
              </p>
              <p className="text-xs text-neutral-500">Steps Done</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <Flame className="mx-auto h-5 w-5 text-orange-500" />
              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                +{Math.floor(selectedRoutine.durationMinutes / 5) * 5}
              </p>
              <p className="text-xs text-neutral-500">XP Earned</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={resetRoutine}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
            >
              <RotateCcw className="h-4 w-4" /> Choose Another
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-600 transition hover:border-amber-400 dark:border-neutral-600 dark:text-neutral-400"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
