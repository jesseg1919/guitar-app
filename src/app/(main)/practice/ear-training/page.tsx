"use client";

import { useState, useCallback, useRef } from "react";
import { Ear, Play, Check, X, RotateCcw, Volume2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Mode = "notes" | "intervals" | "chords";

const NOTES = [
  { name: "C", freq: 261.63 },
  { name: "C#", freq: 277.18 },
  { name: "D", freq: 293.66 },
  { name: "D#", freq: 311.13 },
  { name: "E", freq: 329.63 },
  { name: "F", freq: 349.23 },
  { name: "F#", freq: 369.99 },
  { name: "G", freq: 392.0 },
  { name: "G#", freq: 415.3 },
  { name: "A", freq: 440.0 },
  { name: "A#", freq: 466.16 },
  { name: "B", freq: 493.88 },
];

const INTERVALS = [
  { name: "Minor 2nd", semitones: 1 },
  { name: "Major 2nd", semitones: 2 },
  { name: "Minor 3rd", semitones: 3 },
  { name: "Major 3rd", semitones: 4 },
  { name: "Perfect 4th", semitones: 5 },
  { name: "Tritone", semitones: 6 },
  { name: "Perfect 5th", semitones: 7 },
  { name: "Minor 6th", semitones: 8 },
  { name: "Major 6th", semitones: 9 },
  { name: "Minor 7th", semitones: 10 },
  { name: "Major 7th", semitones: 11 },
  { name: "Octave", semitones: 12 },
];

const CHORD_TYPES = [
  { name: "Major", intervals: [0, 4, 7] },
  { name: "Minor", intervals: [0, 3, 7] },
  { name: "Diminished", intervals: [0, 3, 6] },
  { name: "Augmented", intervals: [0, 4, 8] },
  { name: "Sus2", intervals: [0, 2, 7] },
  { name: "Sus4", intervals: [0, 5, 7] },
];

function playFreq(freq: number, duration = 0.8): AudioContext {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  gain.gain.value = 0.25;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
  return ctx;
}

function playChordFreqs(freqs: number[]) {
  const ctx = new AudioContext();
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  });
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function EarTrainingPage() {
  const [mode, setMode] = useState<Mode>("notes");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = useRef<{
    answer: string;
    rootFreq: number;
    freqs: number[];
  } | null>(null);

  const QUESTIONS_PER_ROUND = 10;

  const generateQuestion = useCallback(() => {
    if (mode === "notes") {
      const note = NOTES[randomInt(NOTES.length)];
      currentQuestion.current = {
        answer: note.name,
        rootFreq: note.freq,
        freqs: [note.freq],
      };
    } else if (mode === "intervals") {
      const rootIdx = randomInt(NOTES.length);
      const interval = INTERVALS[randomInt(INTERVALS.length)];
      const root = NOTES[rootIdx];
      const secondFreq =
        root.freq * Math.pow(2, interval.semitones / 12);
      currentQuestion.current = {
        answer: interval.name,
        rootFreq: root.freq,
        freqs: [root.freq, secondFreq],
      };
    } else {
      const rootIdx = randomInt(NOTES.length);
      const chordType = CHORD_TYPES[randomInt(CHORD_TYPES.length)];
      const root = NOTES[rootIdx];
      const freqs = chordType.intervals.map(
        (semi) => root.freq * Math.pow(2, semi / 12)
      );
      currentQuestion.current = {
        answer: chordType.name,
        rootFreq: root.freq,
        freqs,
      };
    }
    setAnswer(currentQuestion.current.answer);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [mode]);

  const startRound = useCallback(() => {
    setCorrect(0);
    setTotal(0);
    setQuestionIndex(0);
    setShowSummary(false);
    generateQuestion();
  }, [generateQuestion]);

  const playSound = useCallback(() => {
    if (!currentQuestion.current) return;
    const { freqs } = currentQuestion.current;
    if (mode === "notes") {
      playFreq(freqs[0]);
    } else if (mode === "intervals") {
      playFreq(freqs[0], 0.6);
      setTimeout(() => playFreq(freqs[1], 0.6), 700);
    } else {
      playChordFreqs(freqs);
    }
  }, [mode]);

  const handleAnswer = useCallback(
    (chosen: string) => {
      if (selectedAnswer) return; // already answered
      setSelectedAnswer(chosen);
      const wasCorrect = chosen === answer;
      setIsCorrect(wasCorrect);
      setTotal((t) => t + 1);
      if (wasCorrect) setCorrect((c) => c + 1);
    },
    [answer, selectedAnswer]
  );

  const nextQuestion = useCallback(() => {
    const next = questionIndex + 1;
    if (next >= QUESTIONS_PER_ROUND) {
      setShowSummary(true);
    } else {
      setQuestionIndex(next);
      generateQuestion();
    }
  }, [questionIndex, generateQuestion]);

  const getOptions = useCallback(() => {
    if (mode === "notes") return NOTES.map((n) => n.name);
    if (mode === "intervals") return INTERVALS.map((i) => i.name);
    return CHORD_TYPES.map((c) => c.name);
  }, [mode]);

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
        <Ear className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        Ear Training
      </h1>
      <p className="mt-2 mb-8 text-neutral-600 dark:text-neutral-400">
        Train your ear to identify notes, intervals, and chord qualities.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Mode Selection */}
        <div className="mb-6 flex gap-2">
          {(["notes", "intervals", "chords"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setAnswer(null);
                setShowSummary(false);
              }}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition",
                mode === m
                  ? "bg-amber-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Not started */}
        {!answer && !showSummary && (
          <div className="text-center py-8">
            <p className="mb-4 text-neutral-500">
              Listen to {mode === "notes" ? "a note" : mode === "intervals" ? "two notes" : "a chord"} and identify it.
            </p>
            <button
              onClick={startRound}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
            >
              <Play className="h-5 w-5" /> Start Round ({QUESTIONS_PER_ROUND} questions)
            </button>
          </div>
        )}

        {/* Active Question */}
        {answer && !showSummary && (
          <div>
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between text-sm text-neutral-500">
              <span>
                Question {questionIndex + 1} of {QUESTIONS_PER_ROUND}
              </span>
              <span>
                {correct}/{total} correct
              </span>
            </div>
            <div className="mb-6 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{
                  width: `${((questionIndex + (selectedAnswer ? 1 : 0)) / QUESTIONS_PER_ROUND) * 100}%`,
                }}
              />
            </div>

            {/* Play Button */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={playSound}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
              >
                <Volume2 className="h-8 w-8" />
              </button>
            </div>
            <p className="mb-6 text-center text-sm text-neutral-500">
              Click to play the sound, then select your answer below
            </p>

            {/* Answer Options */}
            <div
              className={cn(
                "grid gap-2",
                mode === "notes"
                  ? "grid-cols-4"
                  : mode === "intervals"
                    ? "grid-cols-3"
                    : "grid-cols-3"
              )}
            >
              {getOptions().map((opt) => {
                let btnClass =
                  "border-neutral-200 text-neutral-700 hover:border-amber-300 dark:border-neutral-700 dark:text-neutral-300";

                if (selectedAnswer) {
                  if (opt === answer) {
                    btnClass =
                      "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
                  } else if (opt === selectedAnswer && !isCorrect) {
                    btnClass =
                      "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
                  } else {
                    btnClass =
                      "border-neutral-100 text-neutral-300 dark:border-neutral-800 dark:text-neutral-600";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selectedAnswer}
                    className={cn(
                      "rounded-lg border px-2 py-2.5 text-sm font-medium transition",
                      btnClass
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {selectedAnswer && (
              <div className="mt-6 text-center">
                <div
                  className={cn(
                    "mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                    isCorrect
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  {isCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Correct!
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" /> Incorrect — it was {answer}
                    </>
                  )}
                </div>
                <div>
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    {questionIndex + 1 >= QUESTIONS_PER_ROUND
                      ? "See Results"
                      : "Next Question →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {showSummary && (
          <div className="text-center py-4">
            <Trophy className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">
              Round Complete!
            </h2>
            <p className="mt-2 text-neutral-500">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} identification
            </p>

            <div className="mt-6 inline-flex items-baseline gap-1">
              <span className="text-5xl font-bold text-amber-600">
                {correct}
              </span>
              <span className="text-2xl text-neutral-400">
                / {QUESTIONS_PER_ROUND}
              </span>
            </div>

            <p className="mt-2 text-lg font-medium text-neutral-600 dark:text-neutral-400">
              {correct === QUESTIONS_PER_ROUND
                ? "Perfect score!"
                : correct >= QUESTIONS_PER_ROUND * 0.8
                  ? "Great job!"
                  : correct >= QUESTIONS_PER_ROUND * 0.5
                    ? "Good effort!"
                    : "Keep practicing!"}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={startRound}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
              >
                <RotateCcw className="h-4 w-4" /> Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
