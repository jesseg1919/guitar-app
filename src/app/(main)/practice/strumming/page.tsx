"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowDownUp, Play, Pause, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Stroke = "D" | "U" | "x" | "-";

interface Pattern {
  name: string;
  difficulty: string;
  strokes: Stroke[];
  description: string;
}

const PATTERNS: Pattern[] = [
  {
    name: "All Downstrokes",
    difficulty: "Beginner",
    strokes: ["D", "D", "D", "D", "D", "D", "D", "D"],
    description: "The most basic pattern. Strum down on every beat.",
  },
  {
    name: "Down-Up",
    difficulty: "Beginner",
    strokes: ["D", "U", "D", "U", "D", "U", "D", "U"],
    description: "Alternating down and up strokes. Foundation of most strumming.",
  },
  {
    name: "Folk Pattern",
    difficulty: "Beginner",
    strokes: ["D", "-", "D", "U", "-", "U", "D", "U"],
    description: "Classic folk/country pattern. Skip the up on beat 1 and down on beat 3.",
  },
  {
    name: "Pop Rock",
    difficulty: "Intermediate",
    strokes: ["D", "-", "U", "-", "U", "D", "-", "U"],
    description: "Popular in pop and rock songs. Has a driving feel.",
  },
  {
    name: "Reggae Offbeat",
    difficulty: "Intermediate",
    strokes: ["-", "D", "U", "-", "-", "D", "U", "-"],
    description: "Emphasizes the offbeats. Classic reggae/ska sound.",
  },
  {
    name: "Syncopated Funk",
    difficulty: "Advanced",
    strokes: ["D", "-", "U", "x", "-", "U", "x", "U"],
    description: "Funky pattern with muted strums (x). Add palm muting on x strokes.",
  },
];

const strokeLabels: Record<Stroke, { symbol: string; label: string; color: string }> = {
  D: { symbol: "↓", label: "Down", color: "bg-amber-500 text-white" },
  U: { symbol: "↑", label: "Up", color: "bg-blue-500 text-white" },
  x: { symbol: "✕", label: "Mute", color: "bg-red-400 text-white" },
  "-": { symbol: "·", label: "Rest", color: "bg-neutral-200 text-neutral-400 dark:bg-neutral-700" },
};

export default function StrummingPage() {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(-1);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const strokeRef = useRef(0);

  const pattern = PATTERNS[selectedPattern];

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playStrokeSound = useCallback(
    (stroke: Stroke) => {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (stroke === "D") {
        osc.frequency.value = 200;
        gain.gain.value = 0.3;
      } else if (stroke === "U") {
        osc.frequency.value = 300;
        gain.gain.value = 0.2;
      } else if (stroke === "x") {
        osc.type = "sawtooth";
        osc.frequency.value = 100;
        gain.gain.value = 0.15;
      } else {
        return; // rest — no sound
      }

      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    },
    [getAudioCtx]
  );

  const start = useCallback(() => {
    strokeRef.current = 0;
    setCurrentStroke(0);
    playStrokeSound(pattern.strokes[0]);

    // Eighth notes at given BPM
    const ms = (60 / bpm / 2) * 1000;
    intervalRef.current = setInterval(() => {
      strokeRef.current =
        (strokeRef.current + 1) % pattern.strokes.length;
      setCurrentStroke(strokeRef.current);
      playStrokeSound(pattern.strokes[strokeRef.current]);
    }, ms);

    setIsPlaying(true);
  }, [bpm, pattern.strokes, playStrokeSound]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
    setCurrentStroke(-1);
  }, []);

  // Restart on bpm / pattern change if playing
  useEffect(() => {
    if (isPlaying) {
      stop();
      // small delay to avoid double-play
      const t = setTimeout(() => start(), 50);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, selectedPattern]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
        <ArrowDownUp className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        Strumming Patterns
      </h1>
      <p className="mt-2 mb-8 text-neutral-600 dark:text-neutral-400">
        Learn and practice common strumming patterns with a built-in beat.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Pattern Selector */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Choose a Pattern
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PATTERNS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedPattern(i);
                  if (isPlaying) stop();
                }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition",
                  selectedPattern === i
                    ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20"
                    : "border-neutral-200 hover:border-amber-300 dark:border-neutral-700"
                )}
              >
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {p.name}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs",
                    p.difficulty === "Beginner"
                      ? "text-emerald-600"
                      : p.difficulty === "Intermediate"
                        ? "text-amber-600"
                        : "text-red-500"
                  )}
                >
                  {p.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pattern description */}
        <p className="mb-6 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          {pattern.description}
        </p>

        {/* Visual Pattern */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {pattern.strokes.map((stroke, i) => {
              const info = strokeLabels[stroke];
              const isActive = i === currentStroke;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  {i % 2 === 0 && (
                    <span className="text-[10px] text-neutral-400">
                      {Math.floor(i / 2) + 1}
                    </span>
                  )}
                  {i % 2 === 1 && (
                    <span className="text-[10px] text-neutral-300">&</span>
                  )}
                  <div
                    className={cn(
                      "flex h-12 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all sm:h-14 sm:w-12 sm:text-xl",
                      info.color,
                      isActive && "scale-110 ring-2 ring-amber-300 ring-offset-2 dark:ring-offset-neutral-900"
                    )}
                  >
                    {info.symbol}
                  </div>
                  <span className="text-[10px] text-neutral-400">{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BPM Control */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setBpm((b) => Math.max(40, b - 5))}
            className="rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="text-center">
            <span className="text-3xl font-bold tabular-nums text-neutral-900 dark:text-white">
              {bpm}
            </span>
            <p className="text-xs text-neutral-500">BPM</p>
          </div>
          <button
            onClick={() => setBpm((b) => Math.min(200, b + 5))}
            className="rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 px-8">
          <input
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Play/Stop */}
        <div className="flex justify-center">
          <button
            onClick={isPlaying ? stop : start}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full text-white transition",
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
            )}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </button>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded bg-amber-500" /> Down
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded bg-blue-500" /> Up
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded bg-red-400" /> Mute
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded bg-neutral-200 dark:bg-neutral-700" /> Rest
          </span>
        </div>
      </div>
    </div>
  );
}
