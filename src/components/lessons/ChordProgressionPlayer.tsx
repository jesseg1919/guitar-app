"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Play, Pause, RotateCcw, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChordStep {
  chord: string;
  beats: number;
  lyrics?: string;
}

interface ChordProgressionPlayerProps {
  progression: ChordStep[];
  defaultBpm: number;
  lyricsWithChords?: string;
}

// Chord colors for the bars
const CHORD_COLORS: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  C:    { bg: "bg-red-500",     border: "border-red-600",    dot: "bg-red-300",     text: "bg-red-600 text-white" },
  Cm:   { bg: "bg-red-600",     border: "border-red-700",    dot: "bg-red-300",     text: "bg-red-700 text-white" },
  D:    { bg: "bg-orange-500",  border: "border-orange-600", dot: "bg-orange-300",  text: "bg-orange-600 text-white" },
  Dm:   { bg: "bg-orange-600",  border: "border-orange-700", dot: "bg-orange-300",  text: "bg-orange-700 text-white" },
  D7:   { bg: "bg-orange-500",  border: "border-orange-600", dot: "bg-orange-300",  text: "bg-orange-600 text-white" },
  E:    { bg: "bg-yellow-500",  border: "border-yellow-600", dot: "bg-yellow-300",  text: "bg-yellow-600 text-white" },
  Em:   { bg: "bg-yellow-600",  border: "border-yellow-700", dot: "bg-yellow-300",  text: "bg-yellow-700 text-white" },
  E7:   { bg: "bg-yellow-500",  border: "border-yellow-600", dot: "bg-yellow-300",  text: "bg-yellow-600 text-white" },
  Em7:  { bg: "bg-yellow-600",  border: "border-yellow-700", dot: "bg-yellow-300",  text: "bg-yellow-700 text-white" },
  F:    { bg: "bg-green-500",   border: "border-green-600",  dot: "bg-green-300",   text: "bg-green-600 text-white" },
  Fm:   { bg: "bg-green-600",   border: "border-green-700",  dot: "bg-green-300",   text: "bg-green-700 text-white" },
  G:    { bg: "bg-cyan-500",    border: "border-cyan-600",   dot: "bg-cyan-300",    text: "bg-cyan-600 text-white" },
  G5:   { bg: "bg-cyan-500",    border: "border-cyan-600",   dot: "bg-cyan-300",    text: "bg-cyan-600 text-white" },
  A:    { bg: "bg-blue-500",    border: "border-blue-600",   dot: "bg-blue-300",    text: "bg-blue-600 text-white" },
  Am:   { bg: "bg-blue-600",    border: "border-blue-700",   dot: "bg-blue-300",    text: "bg-blue-700 text-white" },
  A7:   { bg: "bg-blue-500",    border: "border-blue-600",   dot: "bg-blue-300",    text: "bg-blue-600 text-white" },
  Am7:  { bg: "bg-blue-600",    border: "border-blue-700",   dot: "bg-blue-300",    text: "bg-blue-700 text-white" },
  A5:   { bg: "bg-blue-500",    border: "border-blue-600",   dot: "bg-blue-300",    text: "bg-blue-600 text-white" },
  B:    { bg: "bg-purple-500",  border: "border-purple-600", dot: "bg-purple-300",  text: "bg-purple-600 text-white" },
  Bm:   { bg: "bg-purple-600",  border: "border-purple-700", dot: "bg-purple-300",  text: "bg-purple-700 text-white" },
  B7:   { bg: "bg-purple-500",  border: "border-purple-600", dot: "bg-purple-300",  text: "bg-purple-600 text-white" },
  C5:   { bg: "bg-red-500",     border: "border-red-600",    dot: "bg-red-300",     text: "bg-red-600 text-white" },
  D5:   { bg: "bg-orange-500",  border: "border-orange-600", dot: "bg-orange-300",  text: "bg-orange-600 text-white" },
  Dsus4:{ bg: "bg-orange-400",  border: "border-orange-500", dot: "bg-orange-200",  text: "bg-orange-500 text-white" },
  Fmaj7:{ bg: "bg-green-500",   border: "border-green-600",  dot: "bg-green-300",   text: "bg-green-600 text-white" },
};

const DEFAULT_COLOR = { bg: "bg-violet-500", border: "border-violet-600", dot: "bg-violet-300", text: "bg-violet-600 text-white" };

function getChordColor(chord: string) {
  return CHORD_COLORS[chord] || DEFAULT_COLOR;
}

// Chord diagram data
const CHORD_DIAGRAMS: Record<string, { strings: (number | -1 | 0)[]; fingers: number[] }> = {
  A:  { strings: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  Am: { strings: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  B:  { strings: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1] },
  Bm: { strings: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1] },
  C:  { strings: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  D:  { strings: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  Dm: { strings: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  E:  { strings: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  Em: { strings: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  F:  { strings: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  G:  { strings: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  A7: { strings: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 1, 0] },
  Am7:{ strings: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  B7: { strings: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
  D7: { strings: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
  E7: { strings: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  Em7:{ strings: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0] },
  G5: { strings: [3, -1, 5, -1, -1, -1], fingers: [1, 0, 3, 0, 0, 0] },
  A5: { strings: [-1, 0, 2, -1, -1, -1], fingers: [0, 0, 1, 0, 0, 0] },
  C5: { strings: [-1, 3, 5, -1, -1, -1], fingers: [0, 1, 3, 0, 0, 0] },
  D5: { strings: [-1, -1, 0, 2, 3, -1], fingers: [0, 0, 0, 1, 3, 0] },
  Fm: { strings: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
};

// Parse "[C]lyrics text [G]more lyrics" into chord steps with lyrics
function parseLyricsWithChords(
  lyricsWithChords: string,
  defaultBeats: number,
  bpm: number
): ChordStep[] {
  const lines = lyricsWithChords.split("\n");
  const steps: ChordStep[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    // Split by chord markers [X]
    const parts = line.split(/\[([^\]]+)\]/);
    // parts alternates: text, chord, text, chord, text...

    for (let i = 1; i < parts.length; i += 2) {
      const chord = parts[i];
      const lyrics = (parts[i + 1] || "").trim();
      steps.push({ chord, beats: defaultBeats, lyrics });
    }
  }

  return steps;
}

// Chord diagram SVG component
function ChordDiagram({ chord }: { chord: string }) {
  const diagram = CHORD_DIAGRAMS[chord];
  const color = getChordColor(chord);

  if (!diagram) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center rounded-xl border-2", color.border, "bg-neutral-900/50")}>
        <span className={cn("rounded-lg px-3 py-1.5 text-lg font-bold", color.text)}>{chord}</span>
      </div>
    );
  }

  const frets = 4;
  const stringCount = 6;
  const cellW = 14;
  const cellH = 16;
  const padX = 12;
  const padY = 14;
  const w = padX * 2 + (stringCount - 1) * cellW;
  const h = padY + frets * cellH + 8;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
        {/* Nut */}
        <line x1={padX} y1={padY} x2={padX + (stringCount - 1) * cellW} y2={padY} stroke="white" strokeWidth={3} />
        {/* Fret lines */}
        {Array.from({ length: frets }).map((_, i) => (
          <line key={`fret-${i}`} x1={padX} y1={padY + (i + 1) * cellH} x2={padX + (stringCount - 1) * cellW} y2={padY + (i + 1) * cellH} stroke="#555" strokeWidth={1} />
        ))}
        {/* String lines */}
        {Array.from({ length: stringCount }).map((_, i) => (
          <line key={`str-${i}`} x1={padX + i * cellW} y1={padY} x2={padX + i * cellW} y2={padY + frets * cellH} stroke="#888" strokeWidth={0.8} />
        ))}
        {/* Finger dots and markers */}
        {diagram.strings.map((fret, i) => {
          const x = padX + i * cellW;
          if (fret === -1) {
            return <text key={`m-${i}`} x={x} y={padY - 3} textAnchor="middle" fontSize={8} fill="#888">×</text>;
          }
          if (fret === 0) {
            return <circle key={`o-${i}`} cx={x} cy={padY - 4} r={3} fill="none" stroke="#aaa" strokeWidth={1} />;
          }
          return <circle key={`d-${i}`} cx={x} cy={padY + (fret - 0.5) * cellH} r={4.5} fill="white" />;
        })}
      </svg>
    </div>
  );
}

export default function ChordProgressionPlayer({
  progression,
  defaultBpm,
  lyricsWithChords,
}: ChordProgressionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(defaultBpm);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [barProgress, setBarProgress] = useState(0); // 0 to 1 within current bar
  const [isLooping, setIsLooping] = useState(true);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevBeatRef = useRef<number>(-1);

  // Build the steps - either from parsed lyrics or from plain progression
  const steps = useMemo(() => {
    if (lyricsWithChords) {
      const parsed = parseLyricsWithChords(lyricsWithChords, 4, defaultBpm);
      if (parsed.length > 0) return parsed;
    }
    return progression;
  }, [lyricsWithChords, progression, defaultBpm]);

  const msPerBeat = (60 / bpm) * 1000;

  const playClick = useCallback((isDownbeat: boolean) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = isDownbeat ? 1000 : 800;
      gain.gain.value = isDownbeat ? 0.12 : 0.06;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch { /* Audio not available */ }
  }, []);

  // Animation loop using requestAnimationFrame for smooth bar progress
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    setBarProgress((prev) => {
      const currentStep = steps[currentIndex];
      if (!currentStep) return prev;
      const barDuration = currentStep.beats * msPerBeat;
      const newProgress = prev + delta / barDuration;

      // Check if we should play a click
      const currentBeat = Math.floor(newProgress * currentStep.beats);
      if (currentBeat !== prevBeatRef.current && currentBeat < currentStep.beats) {
        prevBeatRef.current = currentBeat;
        playClick(currentBeat === 0);
      }

      if (newProgress >= 1) {
        // Move to next chord
        setCurrentIndex((prevIdx) => {
          const nextIdx = prevIdx + 1;
          if (nextIdx >= steps.length) {
            if (isLooping) {
              prevBeatRef.current = -1;
              return 0;
            } else {
              setIsPlaying(false);
              return prevIdx;
            }
          }
          prevBeatRef.current = -1;
          return nextIdx;
        });
        return 0;
      }
      return newProgress;
    });

    animFrameRef.current = requestAnimationFrame(animate);
  }, [currentIndex, steps, msPerBeat, isLooping, playClick]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      prevBeatRef.current = -1;
      playClick(true);
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, animate, playClick]);

  // Auto-scroll to keep current bar visible
  useEffect(() => {
    if (scrollRef.current) {
      const activeBar = scrollRef.current.querySelector('[data-active="true"]');
      if (activeBar) {
        activeBar.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentIndex]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setBarProgress(0);
    prevBeatRef.current = -1;
  };

  const handleBpmChange = (delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(200, prev + delta)));
  };

  if (!steps || steps.length === 0) return null;

  const currentChord = steps[currentIndex]?.chord || "";
  const totalBeats = steps.reduce((sum, s) => sum + s.beats, 0);
  const elapsedBeats = steps.slice(0, currentIndex).reduce((sum, s) => sum + s.beats, 0) + barProgress * (steps[currentIndex]?.beats || 4);
  const overallProgress = (elapsedBeats / totalBeats) * 100;

  // Show a window of bars around the current index
  const VISIBLE_RANGE = 40;
  const startIdx = Math.max(0, currentIndex - 3);
  const endIdx = Math.min(steps.length, startIdx + VISIBLE_RANGE);
  const visibleSteps = steps.slice(startIdx, endIdx);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      {/* Scrolling chord bars area */}
      <div ref={scrollRef} className="relative overflow-y-auto px-3 py-4 sm:px-5" style={{ maxHeight: "340px" }}>
        <div className="flex flex-col gap-1">
          {visibleSteps.map((step, vi) => {
            const realIdx = startIdx + vi;
            const isActive = realIdx === currentIndex;
            const isPast = realIdx < currentIndex;
            const color = getChordColor(step.chord);

            return (
              <div key={`${realIdx}-${step.chord}`} data-active={isActive ? "true" : undefined}>
                {/* Chord bar row */}
                <div
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 transition-all duration-200",
                    isActive ? "scale-[1.01]" : isPast ? "opacity-40" : "opacity-70"
                  )}
                  onClick={() => {
                    setCurrentIndex(realIdx);
                    setBarProgress(0);
                    prevBeatRef.current = -1;
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Chord name badge */}
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black sm:h-9 sm:w-9 sm:text-sm",
                    color.text,
                    isActive && "ring-2 ring-white/40 ring-offset-1 ring-offset-neutral-950"
                  )}>
                    {step.chord}
                  </div>

                  {/* The bar */}
                  <div className="relative flex-1 overflow-hidden rounded-full" style={{ height: "28px" }}>
                    {/* Background bar */}
                    <div className={cn("absolute inset-0 rounded-full", color.bg, isActive ? "opacity-90" : "opacity-50")} />

                    {/* Progress fill (playhead) for active bar */}
                    {isActive && (
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/20"
                        style={{ width: `${barProgress * 100}%`, transition: "none" }}
                      />
                    )}

                    {/* Playhead line */}
                    {isActive && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                        style={{ left: `${barProgress * 100}%`, transition: "none" }}
                      />
                    )}

                    {/* Beat dots */}
                    <div className="absolute inset-0 flex items-center justify-evenly px-3">
                      {Array.from({ length: step.beats }).map((_, bi) => {
                        const dotPosition = (bi + 0.5) / step.beats;
                        const isLit = isActive && barProgress >= dotPosition;
                        return (
                          <div
                            key={bi}
                            className={cn(
                              "h-2 w-2 rounded-full transition-all sm:h-2.5 sm:w-2.5",
                              isActive
                                ? isLit ? "bg-white scale-110" : color.dot + " opacity-60"
                                : color.dot + " opacity-40"
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lyrics under the bar */}
                {step.lyrics && (
                  <div className={cn(
                    "ml-10 sm:ml-12 mt-0.5 mb-1 text-sm tracking-wide transition-opacity",
                    isActive ? "text-white font-medium" : isPast ? "text-neutral-600" : "text-neutral-500"
                  )}>
                    {step.lyrics}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="flex items-center gap-3 border-t border-neutral-800 bg-neutral-900 px-3 py-2.5 sm:px-5">
        {/* Overall progress bar */}
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-amber-500"
            style={{ width: `${overallProgress}%`, transition: isPlaying ? "none" : "width 0.3s" }}
          />
        </div>

        {/* Controls cluster */}
        <div className="flex items-center gap-1.5">
          {/* BPM */}
          <button onClick={() => handleBpmChange(-5)} className="rounded p-1 text-neutral-400 hover:text-white"><Minus className="h-3.5 w-3.5" /></button>
          <span className="min-w-[3.5rem] text-center text-xs font-semibold text-neutral-300">{bpm} BPM</span>
          <button onClick={() => handleBpmChange(5)} className="rounded p-1 text-neutral-400 hover:text-white"><Plus className="h-3.5 w-3.5" /></button>

          <div className="mx-1 h-4 w-px bg-neutral-700" />

          {/* Loop */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", isLooping ? "bg-amber-600 text-white" : "bg-neutral-800 text-neutral-500")}
          >
            Loop
          </button>

          {/* Reset */}
          <button onClick={handleReset} className="rounded p-1.5 text-neutral-400 hover:text-white"><RotateCcw className="h-3.5 w-3.5" /></button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all",
              isPlaying
                ? "bg-white text-neutral-900 hover:bg-neutral-200"
                : "bg-amber-500 text-white hover:bg-amber-400"
            )}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
        </div>

        {/* Chord diagram - show on right side */}
        <div className="hidden h-16 w-14 shrink-0 sm:block">
          <ChordDiagram chord={currentChord} />
        </div>
      </div>
    </div>
  );
}
