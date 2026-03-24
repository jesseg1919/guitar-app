"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RefreshCw, Play, Square, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const COMMON_CHORDS = [
  "Em", "Am", "C", "G", "D", "E", "A", "Dm",
  "F", "Bm", "B7", "A7", "D7", "G7", "E7",
];

const DURATIONS = [
  { label: "30s", seconds: 30 },
  { label: "60s", seconds: 60 },
  { label: "90s", seconds: 90 },
  { label: "120s", seconds: 120 },
];

interface Round {
  chord1: string;
  chord2: string;
  duration: number;
  changes: number;
  date: Date;
}

export default function ChordTrainerPage() {
  const [chord1, setChord1] = useState("Em");
  const [chord2, setChord2] = useState("Am");
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [changes, setChanges] = useState(0);
  const [currentChord, setCurrentChord] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<Round[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startDrill = useCallback(() => {
    setChanges(0);
    setTimeLeft(duration);
    setCurrentChord(chord1);
    setShowResults(false);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [chord1, duration]);

  const stopDrill = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    if (changes > 0) setShowResults(true);
  }, [changes]);

  const recordChange = useCallback(() => {
    if (!isRunning) return;
    setChanges((prev) => prev + 1);
    setCurrentChord((prev) => (prev === chord1 ? chord2 : chord1));
  }, [isRunning, chord1, chord2]);

  // Save to history on results
  useEffect(() => {
    if (showResults && changes > 0) {
      setHistory((prev) => [
        { chord1, chord2, duration, changes, date: new Date() },
        ...prev.slice(0, 9),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const changesPerMinute =
    duration > 0 ? ((changes / (duration - timeLeft || duration)) * 60).toFixed(1) : "0";

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
        <RefreshCw className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        Chord Change Trainer
      </h1>
      <p className="mt-2 mb-8 text-neutral-600 dark:text-neutral-400">
        Pick two chords, set a timer, and count your clean changes.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        {!isRunning && !showResults && (
          <>
            {/* Chord Selection */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Chord 1
                </label>
                <select
                  value={chord1}
                  onChange={(e) => setChord1(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {COMMON_CHORDS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Chord 2
                </label>
                <select
                  value={chord2}
                  onChange={(e) => setChord2(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {COMMON_CHORDS.filter((c) => c !== chord1).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Duration
              </label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.seconds}
                    onClick={() => {
                      setDuration(d.seconds);
                      setTimeLeft(d.seconds);
                    }}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-sm font-medium transition",
                      duration === d.seconds
                        ? "bg-amber-500 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startDrill}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 text-lg font-semibold text-white transition hover:bg-amber-600"
            >
              <Play className="h-5 w-5" /> Start Drill
            </button>
          </>
        )}

        {/* Active Drill */}
        {isRunning && (
          <div className="text-center">
            {/* Timer */}
            <div className="mb-6">
              <span className="text-5xl font-bold tabular-nums text-neutral-900 dark:text-white">
                {formatTime(timeLeft)}
              </span>
              {/* Progress bar */}
              <div className="mt-3 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{
                    width: `${((duration - timeLeft) / duration) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Chord */}
            <div className="mb-6">
              <p className="mb-1 text-sm text-neutral-500">Play this chord:</p>
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-50 text-4xl font-bold text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                {currentChord}
              </div>
            </div>

            {/* Changes count */}
            <p className="mb-6 text-lg text-neutral-600 dark:text-neutral-400">
              Changes: <span className="font-bold text-neutral-900 dark:text-white">{changes}</span>
            </p>

            {/* Tap button */}
            <button
              onClick={recordChange}
              className="mb-4 h-20 w-full rounded-2xl bg-emerald-500 text-xl font-bold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              Tap When You Change ({currentChord === chord1 ? chord2 : chord1} next)
            </button>

            <button
              onClick={stopDrill}
              className="flex items-center justify-center gap-2 mx-auto text-sm text-neutral-400 hover:text-red-500 transition"
            >
              <Square className="h-4 w-4" /> Stop early
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">
              Drill Complete!
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <p className="text-2xl font-bold text-amber-600">{changes}</p>
                <p className="text-xs text-neutral-500">Total Changes</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <p className="text-2xl font-bold text-amber-600">{changesPerMinute}</p>
                <p className="text-xs text-neutral-500">Changes/min</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <p className="text-2xl font-bold text-amber-600">
                  {chord1} ↔ {chord2}
                </p>
                <p className="text-xs text-neutral-500">Chords</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowResults(false);
                setTimeLeft(duration);
                setChanges(0);
              }}
              className="mt-6 flex items-center justify-center gap-2 mx-auto rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </button>
          </div>
        )}

        {/* History */}
        {history.length > 0 && !isRunning && (
          <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-700">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Recent History
            </h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-800"
                >
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {r.chord1} ↔ {r.chord2} ({r.duration}s)
                  </span>
                  <span className="font-semibold text-amber-600">
                    {r.changes} changes
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
