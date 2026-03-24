"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Music,
  Search,
  X,
  Loader2,
  Heart,
  Clock,
  Guitar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  difficulty: string;
  decade: string | null;
  bpm: number | null;
  key: string | null;
  capoFret: number | null;
  chordsUsed: string[];
  strummingPattern: string | null;
  albumArt: string | null;
  youtubeUrl: string | null;
  isFavorite: boolean;
}

const genres = [
  { value: "", label: "All Genres" },
  { value: "ROCK", label: "Rock" },
  { value: "POP", label: "Pop" },
  { value: "COUNTRY", label: "Country" },
  { value: "BLUES", label: "Blues" },
  { value: "FOLK", label: "Folk" },
  { value: "INDIE", label: "Indie" },
  { value: "ALTERNATIVE", label: "Alternative" },
  { value: "METAL", label: "Metal" },
  { value: "JAZZ", label: "Jazz" },
  { value: "RNB", label: "R&B" },
  { value: "CLASSICAL", label: "Classical" },
  { value: "REGGAE", label: "Reggae" },
  { value: "PUNK", label: "Punk" },
];

const difficulties = [
  { value: "", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const difficultyColors: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INTERMEDIATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADVANCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const genreColors: Record<string, string> = {
  ROCK: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  POP: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  COUNTRY: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  BLUES: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  FOLK: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  INDIE: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  ALTERNATIVE: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export default function SongsPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const { data: session } = useSession();

  const { data: songs = [], isLoading } = useQuery<Song[]>({
    queryKey: ["songs", search, genre, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (difficulty) params.set("difficulty", difficulty);
      const res = await fetch(`/api/songs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch songs");
      return res.json();
    },
  });

  const hasFilters = search || genre || difficulty;

  const clearFilters = () => {
    setSearch("");
    setGenre("");
    setDifficulty("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white">
          <Music className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          Song Library
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Learn real songs with chord charts, strumming patterns, and play-along tools.
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
            placeholder="Search songs or artists..."
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
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          {genres.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          {difficulties.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter info */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-neutral-500">
            {songs.length} song{songs.length !== 1 ? "s" : ""} found
          </span>
          <button
            onClick={clearFilters}
            className="ml-2 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
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
      {!isLoading && songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Music className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 text-lg font-medium text-neutral-600 dark:text-neutral-400">
            {hasFilters ? "No songs match your filters" : "No songs yet"}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            {hasFilters
              ? "Try adjusting your search or filter criteria."
              : "Run the seed script to populate the song library."}
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

      {/* Song List */}
      {!isLoading && songs.length > 0 && (
        <div className="space-y-3">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/songs/${song.id}`}
              className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
            >
              {/* Album Art / Placeholder */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                {song.albumArt ? (
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <Music className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                )}
              </div>

              {/* Song Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-neutral-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                    {song.title}
                  </h3>
                  {song.isFavorite && (
                    <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
                  )}
                </div>
                <p className="truncate text-sm text-neutral-500">
                  {song.artist}
                  {song.decade && ` · ${song.decade}`}
                </p>
              </div>

              {/* Chords Used */}
              <div className="hidden items-center gap-1.5 md:flex">
                {song.chordsUsed.slice(0, 4).map((chord) => (
                  <span
                    key={chord}
                    className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    {chord}
                  </span>
                ))}
                {song.chordsUsed.length > 4 && (
                  <span className="text-xs text-neutral-400">
                    +{song.chordsUsed.length - 4}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="hidden shrink-0 items-center gap-3 lg:flex">
                {song.capoFret && song.capoFret > 0 && (
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Guitar className="h-3.5 w-3.5" />
                    Capo {song.capoFret}
                  </span>
                )}
                {song.bpm && (
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock className="h-3.5 w-3.5" />
                    {song.bpm} BPM
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-medium",
                    difficultyColors[song.difficulty] || "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {song.difficulty.charAt(0) + song.difficulty.slice(1).toLowerCase()}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-medium",
                    genreColors[song.genre] || "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  )}
                >
                  {song.genre.charAt(0) + song.genre.slice(1).toLowerCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
