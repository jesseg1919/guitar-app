"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Timer, Play, Pause, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TIME_SIGNATURES = [
  { label: "4/4", beats: 4 },
  { label: "3/4", beats: 3 },
  { label: "6/8", beats: 6 },
  { label: "2/4", beats: 2 },
];

const PRESETS = [
  { label: "Slow", bpm: 60 },
  { label: "Moderate", bpm: 90 },
  { label: "Medium", bpm: 120 },
  { label: "Fast", bpm: 160 },
];

export default function MetronomePage() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [timeSig, setTimeSig] = useState(TIME_SIGNATURES[0]);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatRef = useRef(0);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback(
    (accent: boolean) => {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = accent ? 1000 : 800;
      gain.gain.value = accent ? 0.6 : 0.3;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    },
    [getAudioCtx]
  );

  const start = useCallback(() => {
    beatRef.current = 0;
    setCurrentBeat(0);
    playClick(true);

    const ms = (60 / bpm) * 1000;
    intervalRef.current = setInterval(() => {
      beatRef.current = (beatRef.current + 1) % timeSig.beats;
      setCurrentBeat(beatRef.current);
      playClick(beatRef.current === 0);
    }, ms);

    setIsPlaying(true);
  }, [bpm, timeSig.beats, playClick]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
    setCurrentBeat(-1);
  }, []);

  // Restart if bpm or timeSig changes while playing
  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      beatRef.current = 0;
      setCurrentBeat(0);
      playClick(true);
      const ms = (60 / bpm) * 1000;
      intervalRef.current = setInterval(() => {
        beatRef.current = (beatRef.current + 1) % timeSig.beats;
        setCurrentBeat(beatRef.current);
        playClick(beatRef.current === 0);
      }, ms);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, timeSig.beats]);

  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...tapTimes, now].filter((t) => now - t < 5000).slice(-6);
    setTapTimes(newTaps);

    if (newTaps.length >= 2) {
      const diffs: number[] = [];
      for (let i = 1; i < newTaps.length; i++) {
        diffs.push(newTaps[i] - newTaps[i - 1]);
      }
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const tappedBpm = Math.round(60000 / avg);
      if (tappedBpm >= 30 && tappedBpm <= 300) {
        setBpm(tappedBpm);
      }
    }
  };

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.max(30, Math.min(300, prev + delta)));
  };

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
        <Timer className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        Metronome
      </h1>
      <p className="mt-2 mb-8 text-neutral-600 dark:text-neutral-400">
        Keep time while you practice. Adjust BPM, time signature, or use tap tempo.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Beat Indicators */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {Array.from({ length: timeSig.beats }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-all duration-100",
                i === currentBeat
                  ? i === 0
                    ? "scale-125 border-amber-500 bg-amber-500 shadow-lg shadow-amber-300"
                    : "scale-110 border-amber-400 bg-amber-400"
                  : "border-neutral-300 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800"
              )}
            />
          ))}
        </div>

        {/* BPM Display */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => adjustBpm(-5)}
              className="rounded-full bg-neutral-100 p-2 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <Minus className="h-5 w-5" />
            </button>
            <div>
              <span className="text-6xl font-bold tabular-nums text-neutral-900 dark:text-white">
                {bpm}
              </span>
              <p className="text-sm text-neutral-500">BPM</p>
            </div>
            <button
              onClick={() => adjustBpm(5)}
              className="rounded-full bg-neutral-100 p-2 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* BPM Slider */}
        <div className="mb-6 px-4">
          <input
            type="range"
            min={30}
            max={300}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-neutral-400">
            <span>30</span>
            <span>300</span>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setBpm(p.bpm)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                bpm === p.bpm
                  ? "bg-amber-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              )}
            >
              {p.label} ({p.bpm})
            </button>
          ))}
        </div>

        {/* Time Signature */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {TIME_SIGNATURES.map((ts) => (
            <button
              key={ts.label}
              onClick={() => setTimeSig(ts)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition",
                timeSig.label === ts.label
                  ? "bg-amber-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              )}
            >
              {ts.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isPlaying ? stop : start}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full text-white transition-all",
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
            )}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleTap}
            className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:border-amber-400 hover:bg-amber-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-amber-600 dark:hover:bg-amber-900/20"
          >
            Tap Tempo
          </button>
        </div>
      </div>
    </div>
  );
}
