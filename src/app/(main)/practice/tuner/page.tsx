"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const GUITAR_STRINGS = [
  { note: "E", octave: 4, freq: 329.63, label: "1st (High E)" },
  { note: "B", octave: 3, freq: 246.94, label: "2nd (B)" },
  { note: "G", octave: 3, freq: 196.0, label: "3rd (G)" },
  { note: "D", octave: 3, freq: 146.83, label: "4th (D)" },
  { note: "A", octave: 2, freq: 110.0, label: "5th (A)" },
  { note: "E", octave: 2, freq: 82.41, label: "6th (Low E)" },
];

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  let r1 = 0,
    r2 = size - 1;
  const threshold = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < threshold) { r1 = i; break; }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < threshold) { r2 = size - i; break; }
  }

  buf = buf.slice(r1, r2);
  size = buf.length;

  const c = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxVal = -1,
    maxPos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
  }

  let t0 = maxPos;
  if (t0 > 0 && t0 < size - 1) {
    const x1 = c[t0 - 1],
      x2 = c[t0],
      x3 = c[t0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) t0 -= b / (2 * a);
  }

  return sampleRate / t0;
}

function freqToNote(freq: number) {
  const noteNum = 12 * Math.log2(freq / 440);
  const roundedNote = Math.round(noteNum);
  const cents = Math.round((noteNum - roundedNote) * 100);
  const noteIndex = ((roundedNote % 12) + 12) % 12;
  const octave = Math.floor((roundedNote + 69) / 12) - 1;
  return { note: NOTE_NAMES[noteIndex], octave, cents, freq };
}

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false);
  const [detected, setDetected] = useState<{
    note: string;
    octave: number;
    cents: number;
    freq: number;
  } | null>(null);
  const [selectedString, setSelectedString] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      analyserRef.current = analyser;
      setIsListening(true);

      const buf = new Float32Array(analyser.fftSize);
      const detect = () => {
        analyser.getFloatTimeDomainData(buf);
        const freq = autoCorrelate(buf, ctx.sampleRate);
        if (freq > 50 && freq < 1000) {
          setDetected(freqToNote(freq));
        }
        rafRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch {
      alert("Microphone access is required for the tuner.");
    }
  }, []);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    setIsListening(false);
    setDetected(null);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioCtxRef.current?.close();
    };
  }, []);

  const playReference = (freq: number) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    osc.start();
    osc.stop(ctx.currentTime + 2);
  };

  const centsDisplay = detected ? detected.cents : 0;
  const tuningQuality =
    Math.abs(centsDisplay) <= 5
      ? "in-tune"
      : Math.abs(centsDisplay) <= 15
        ? "close"
        : "off";

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
        <Mic className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        Guitar Tuner
      </h1>
      <p className="mt-2 mb-8 text-neutral-600 dark:text-neutral-400">
        Use your microphone to detect pitch, or play reference tones for each
        string.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Note Display */}
        <div className="mb-6 text-center">
          <div
            className={cn(
              "inline-flex h-28 w-28 items-center justify-center rounded-full border-4 text-5xl font-bold transition-colors",
              !isListening || !detected
                ? "border-neutral-200 text-neutral-300 dark:border-neutral-700 dark:text-neutral-600"
                : tuningQuality === "in-tune"
                  ? "border-emerald-400 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : tuningQuality === "close"
                    ? "border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "border-red-400 text-red-500 bg-red-50 dark:bg-red-900/20"
            )}
          >
            {detected ? detected.note : "—"}
          </div>
          {detected && (
            <div className="mt-3 space-y-1">
              <p className="text-sm text-neutral-500">
                {detected.note}
                {detected.octave} · {detected.freq.toFixed(1)} Hz
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  tuningQuality === "in-tune"
                    ? "text-emerald-600"
                    : tuningQuality === "close"
                      ? "text-amber-600"
                      : "text-red-500"
                )}
              >
                {centsDisplay > 0 ? `+${centsDisplay}` : centsDisplay} cents
                {tuningQuality === "in-tune"
                  ? " — In Tune!"
                  : centsDisplay > 0
                    ? " (sharp)"
                    : " (flat)"}
              </p>
            </div>
          )}
        </div>

        {/* Cents Meter */}
        <div className="mb-8 px-4">
          <div className="relative h-3 rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="absolute left-1/2 top-0 h-3 w-0.5 bg-neutral-400" />
            {detected && (
              <div
                className={cn(
                  "absolute top-0 h-3 w-3 -translate-x-1/2 rounded-full transition-all",
                  tuningQuality === "in-tune"
                    ? "bg-emerald-500"
                    : tuningQuality === "close"
                      ? "bg-amber-500"
                      : "bg-red-500"
                )}
                style={{
                  left: `${Math.max(5, Math.min(95, 50 + centsDisplay))}%`,
                }}
              />
            )}
          </div>
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>-50¢</span>
            <span>0</span>
            <span>+50¢</span>
          </div>
        </div>

        {/* Mic Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition",
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-amber-500 hover:bg-amber-600"
            )}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" /> Start Listening
              </>
            )}
          </button>
        </div>

        {/* Guitar Strings — Reference Tones */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Reference Tones
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GUITAR_STRINGS.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedString(i);
                  playReference(s.freq);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition",
                  selectedString === i
                    ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    : "border-neutral-200 text-neutral-600 hover:border-amber-300 dark:border-neutral-700 dark:text-neutral-400"
                )}
              >
                <Volume2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">
                  {s.note}
                  {s.octave}
                </span>
                <span className="text-xs text-neutral-400">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
