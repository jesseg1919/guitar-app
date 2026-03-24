"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Library, Loader2, Search, X } from "lucide-react";
import { ChordCard } from "@/components/chords/ChordCard";
import { cn } from "@/lib/utils";
import type { FretboardData } from "@/components/chords/FretboardDiagram";

interface Chord {
  id: string;
  name: string;
  shortName: string;
  type: string;
  difficulty: string;
  fretboardData: FretboardData;
  userStatus: "LEARNING" | "MASTERED" | null;
}

const chordTypes = [
  { value: "", label: "All Types" },
  { value: "OPEN", label: "Open" },
  { value: "BARRE", label: "Barre" },
  { value: "POWER", label: "Power" },
  { value: "SEVENTH", label: "7th" },
  { value: "MINOR_SEVENTH", label: "Minor 7th" },
  { value: "MAJOR_SEVENTH", label: "Major 7th" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DIMINISHED", label: "Diminished" },
  { value: "AUGMENTED", label: "Augmented" },
  { value: "ADD", label: "Add" },
  { value: "SLASH", label: "Slash" },
];

const difficultyLevels = [
  { value: "", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export default function ChordsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const { data: chords = [], isLoading } = useQuery<Chord[]>({
    queryKey: ["chords", search, type, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (type) params.set("type", type);
      if (difficulty) params.set("difficulty", difficulty);
      const res = await fetch(`/api/chords?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch chords");
      return res.json();
    },
  });

  const hasFilters = search || type || difficulty;

  const clearFilters = () => {
    setSearch("");
    setType("");
    setDifficulty("");
  };

  // Group chords by difficulty for display
  const grouped = chords.reduce<Record<string, Chord[]>>((acc, chord) => {
    const key = chord.difficulty;
    if (!acc[key]) acc[key] = [];
    acc[key].push(chord);
    return acc;
  }, {});

  const difficultyOrder = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white">
          <Library className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          Chord Library
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Interactive chord diagrams for open chords, barre chords, power chords, and more.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chords... (e.g., Am, G Major)"
            className="w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          {chordTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          {difficultyLevels.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active filters indicator */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-neutral-500">
            {chords.length} chord{chords.length !== 1 ? "s" : ""} found
          </span>
          <button
            onClick={clearFilters}
            className="ml-2 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && chords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Library className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 text-lg font-medium text-neutral-600 dark:text-neutral-400">
            {hasFilters ? "No chords match your filters" : "No chords yet"}
          </p>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
            {hasFilters
              ? "Try adjusting your search or filter criteria."
              : "Run the seed script to populate the chord library."}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Chord Grid — grouped by difficulty */}
      {!isLoading && chords.length > 0 && !hasFilters && (
        <div className="space-y-10">
          {difficultyOrder.map((level) => {
            const group = grouped[level];
            if (!group || group.length === 0) return null;

            const label = level.charAt(0) + level.slice(1).toLowerCase();

            return (
              <section key={level}>
                <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  {label}
                  <span className="ml-2 text-sm font-normal text-neutral-400">
                    ({group.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {group.map((chord) => (
                    <ChordCard
                      key={chord.id}
                      id={chord.id}
                      name={chord.name}
                      shortName={chord.shortName}
                      type={chord.type}
                      difficulty={chord.difficulty}
                      fretboardData={chord.fretboardData}
                      userStatus={chord.userStatus}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Flat grid when filters are active */}
      {!isLoading && chords.length > 0 && hasFilters && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {chords.map((chord) => (
            <ChordCard
              key={chord.id}
              id={chord.id}
              name={chord.name}
              shortName={chord.shortName}
              type={chord.type}
              difficulty={chord.difficulty}
              fretboardData={chord.fretboardData}
              userStatus={chord.userStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
