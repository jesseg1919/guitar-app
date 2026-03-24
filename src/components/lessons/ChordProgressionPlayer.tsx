"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Minus, Plus, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChordStep {
  chord: string;
  beats: number;
}

interface ChordProgressionPlayerProps {
  progression: ChordStep[];
  defaultBpm: number;
}

// Simple chord diagram data for common chords
const CHORD_DIAGRAMS: Record<
  string,
  { strings: (number | -1 | 0)[]; fingers: number[] }
> = {
  A: { strings: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  Am: { strings: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  B: { strings: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1] },
  Bm: { strings: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1] },
  C: { strings: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  D: { strings: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  Dm: { strings: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  E: { strings: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  Em: { strings: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  F: { strings: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  G: { strings: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  A7: { strings: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 1, 0] },
  Am7: { strings: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  B7: { strings: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
  D7: { strings: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
  E7: { strings: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  Em7: { strings: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0] },
  G5: { strings: [3, -1, 5, -1, -1, -1], fingers: [1, 0, 3, 0, 0, 0] },
  A5: { strings: [-1, 0, 2, -1, -1, -1], fingers: [0, 0, 1, 0, 0, 0] },
  C5: { strings: [-1, 3, 5, -1, -1, -1], fingers: [0, 1, 3, 0, 0, 0] },
  D5: { strings: [-1, -1, 0, 2, 3, -1], fingers: [0, 0, 0, 1, 3, 0] },
  Fm: { strings: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
};

function MiniChordDiagram({
  chord,
  isActive,
}: {
  chord: string;
  isActive: boolean;
}) {
  const diagram = CHORD_DIAGRAMS[chord];

  if (!diagram) {
    return (
      <div
        className={cn(
          "flex h-16 w-14 items-center justify-center rounded-lg border-2 text-xs font-bold",
          isActive
            ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/30 dark:text-amber-300"
            : "border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500"
        )}
      >
        {chord}
      </div>
    );
  }

  const frets = 4;
  const stringCount = 6;
  const cellW = 8;
  const cellH = 10;
  const padX = 4;
  const padY = 8;
  const w = padX * 2 + (stringCount - 1) * cellW;
  const h = padY + frets * cellH + 4;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn(
        "h-16 w-14 rounded-lg border-2 p-0.5",
        isActive
          ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/30"
          : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"
      )}
    >
      {/* Nut */}
      <line
        x1={padX}
        y1={padY}
        x2={padX + (stringCount - 1) * cellW}
        y2={padY}
        stroke={isActive ? "#d97706" : "#a3a3a3"}
        strokeWidth={2}
      />
      {/* Fret lines */}
      {Array.from({ length: frets }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={padX}
          y1={padY + (i + 1) * cellH}
          x2={padX + (stringCount - 1) * cellW}
          y2={padY + (i + 1) * cellH}
          stroke={isActive ? "#d97706" : "#d4d4d4"}
          strokeWidth={0.5}
        />
      ))}
      {/* String lines */}
      {Array.from({ length: stringCount }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={padX + i * cellW}
          y1={padY}
          x2={padX + i * cellW}
          y2={padY + frets * cellH}
          stroke={isActive ? "#92400e" : "#a3a3a3"}
          strokeWidth={0.5}
        />
      ))}
      {/* Finger dots and markers */}
      {diagram.strings.map((fret, i) => {
        const x = padX + i * cellW;
        if (fret === -1) {
          return (
            <text
              key={`m-${i}`}
              x={x}
              y={padY - 2}
              textAnchor="middle"
              fontSize={5}
              fill={isActive ? "#d97706" : "#a3a3a3"}
            >
              ×
            </text>
          );
        }
        if (fret === 0) {
          return (
            <circle
              key={`o-${i}`}
              cx={x}
              cy={padY - 3}
              r={2}
              fill="none"
              stroke={isActive ? "#d97706" : "#a3a3a3"}
              strokeWidth={0.5}
            />
          );
        }
        return (
          <circle
            key={`d-${i}`}
            cx={x}
            cy={padY + (fret - 0.5) * cellH}
            r={2.5}
            fill={isActive ? "#d97706" : "#737373"}
          />
        );
      })}
    </svg>
  );
}

export default function ChordProgressionPlayer({
  progression,
  defaultBpm,
}: ChordProgressionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(defaultBpm);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isLooping, setIsLooping] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Calculate ms per beat from BPM
  const msPerBeat = (60 / bpm) * 1000;

  const playClick = useCallback(
    (isDownbeat: boolean) => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = isDownbeat ? 1000 : 800;
        gain.gain.value = isDownbeat ? 0.15 : 0.08;
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.05
        );
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      } catch {
        // Audio not available
      }
    },
    []
  );

  const advance = useCallback(() => {
    setCurrentBeat((prev) => {
      const maxBeats = progression[currentIndex]?.beats ?? 4;
      const nextBeat = prev + 1;
      if (nextBeat >= maxBeats) {
        // Move to next chord
        setCurrentIndex((prevIdx) => {
          const nextIdx = prevIdx + 1;
          if (nextIdx >= progression.length) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return prevIdx;
            }
          }
          return nextIdx;
        });
        return 0;
      }
      return nextBeat;
    });
  }, [currentIndex, progression, isLooping]);

  // Play/pause effect
  useEffect(() => {
    if (isPlaying) {
      // Play the first click immediately
      playClick(currentBeat === 0);

      intervalRef.current = setInterval(() => {
        advance();
      }, msPerBeat);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, msPerBeat, advance, currentBeat, playClick]);

  // Play click on each beat change
  useEffect(() => {
    if (isPlaying) {
      playClick(currentBeat === 0);
    }
  }, [currentBeat, currentIndex, isPlaying, playClick]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setCurrentBeat(0);
  };

  const handleBpmChange = (delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(200, prev + delta)));
  };

  if (!progression || progression.length === 0) return null;

  const currentChord = progression[currentIndex];
  const totalBeats = progression.reduce((sum, s) => sum + s.beats, 0);
  const elapsedBeats =
    progression.slice(0, currentIndex).reduce((sum, s) => sum + s.beats, 0) +
    currentBeat;
  const progressPercent = (elapsedBeats / totalBeats) * 100;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            Chord Progression Player
          </span>
        </div>
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium transition-colors",
            isLooping
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
          )}
        >
          {isLooping ? "Loop On" : "Loop Off"}
        </button>
      </div>

      {/* Current chord - big display */}
      <div className="px-4 py-5 text-center">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
          Now Playing
        </div>
        <div
          className={cn(
            "text-5xl font-black tracking-tight transition-all duration-200",
            isPlaying
              ? "text-amber-600 dark:text-amber-400"
              : "text-neutral-800 dark:text-neutral-200"
          )}
        >
          {currentChord.chord}
        </div>

        {/* Beat indicator dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {Array.from({ length: currentChord.beats }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-3 w-3 rounded-full transition-all duration-100",
                i < currentBeat || (i === 0 && currentBeat === 0 && !isPlaying)
                  ? i === currentBeat && isPlaying
                    ? "scale-125 bg-amber-500 shadow-md shadow-amber-500/30"
                    : "bg-amber-400/60 dark:bg-amber-500/40"
                  : i === currentBeat && isPlaying
                    ? "scale-125 bg-amber-500 shadow-md shadow-amber-500/30"
                    : "bg-neutral-200 dark:bg-neutral-700"
              )}
            />
          ))}
        </div>
        <div className="mt-1 text-xs text-neutral-400">
          Beat {currentBeat + 1} of {currentChord.beats}
        </div>
      </div>

      {/* Chord progression strip */}
      <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {progression.map((step, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setCurrentBeat(0);
              }}
              className="flex flex-col items-center gap-1"
            >
              <MiniChordDiagram
                chord={step.chord}
                isActive={i === currentIndex}
              />
              <span
                className={cn(
                  "text-xs font-semibold transition-colors",
                  i === currentIndex
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-neutral-400 dark:text-neutral-500"
                )}
              >
                {step.chord}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
            style={{
              width: `${progressPercent}%`,
              transitionDuration: `${msPerBeat}ms`,
              transitionTimingFunction: "linear",
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* BPM control */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleBpmChange(-5)}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[4rem] text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {bpm} BPM
          </span>
          <button
            onClick={() => handleBpmChange(5)}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Play/Pause/Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all",
              isPlaying
                ? "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600"
                : "bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600"
            )}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </button>
        </div>

        {/* Spacer for balance */}
        <div className="w-[6rem]" />
      </div>
    </div>
  );
}
