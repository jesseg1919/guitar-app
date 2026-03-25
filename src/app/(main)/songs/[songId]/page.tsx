"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Music,
  Guitar,
  Clock,
  ArrowDownUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import ChordProgressionPlayer from "@/components/lessons/ChordProgressionPlayer";

interface SongDetail {
  id: string;
  title: string;
  artist: string;
  genre: string;
  difficulty: string;
  decade: string | null;
  bpm: number | null;
  key: string | null;
  capoFret: number | null;
  timeSignature: string;
  chordsUsed: string[];
  strummingPattern: string | null;
  lyricsWithChords: string;
  simplifiedChords: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  albumArt: string | null;
  isFavorite: boolean;
  relatedSongs: {
    id: string;
    title: string;
    artist: string;
    difficulty: string;
    chordsUsed: string[];
  }[];
}

const difficultyColors: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INTERMEDIATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADVANCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function SongDetailPage() {
  const { songId } = useParams<{ songId: string }>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [useSimplified, setUseSimplified] = useState(false);
  const [showAllChords, setShowAllChords] = useState(false);

  const { data: song, isLoading, error } = useQuery<SongDetail>({
    queryKey: ["song", songId],
    queryFn: async () => {
      const res = await fetch(`/api/songs/${songId}`);
      if (!res.ok) throw new Error("Failed to fetch song");
      return res.json();
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const method = song?.isFavorite ? "DELETE" : "POST";
      const res = await fetch(`/api/songs/${songId}/favorite`, { method });
      if (!res.ok) throw new Error("Failed to update favorite");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song", songId] });
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-lg text-red-500">Song not found.</p>
        <Link
          href="/songs"
          className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Song Library
        </Link>
      </div>
    );
  }

  const lyricsContent = useSimplified && song.simplifiedChords
    ? song.simplifiedChords
    : song.lyricsWithChords;

  // Parse strumming pattern for visual display
  const strumStrokes = song.strummingPattern?.split("") || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/songs"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-amber-600 dark:text-neutral-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Song Library
        </Link>
      </nav>

      {/* Song Header */}
      <div className="mb-8 flex items-start gap-4">
        {/* Album Art */}
        <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 sm:flex">
          {song.albumArt ? (
            <img
              src={song.albumArt}
              alt={song.title}
              className="h-24 w-24 rounded-xl object-cover"
            />
          ) : (
            <Music className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {song.title}
              </h1>
              <p className="mt-1 text-lg text-neutral-500">
                {song.artist}
                {song.decade && ` · ${song.decade}`}
              </p>
            </div>

            {/* Favorite Button */}
            {session && (
              <button
                onClick={() => favoriteMutation.mutate()}
                disabled={favoriteMutation.isPending}
                className={cn(
                  "shrink-0 rounded-full p-2.5 transition",
                  song.isFavorite
                    ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                    : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-red-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                )}
              >
                <Heart
                  className={cn("h-5 w-5", song.isFavorite && "fill-current")}
                />
              </button>
            )}
          </div>

          {/* Meta Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium",
                difficultyColors[song.difficulty]
              )}
            >
              {song.difficulty.charAt(0) + song.difficulty.slice(1).toLowerCase()}
            </span>
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              {song.genre.charAt(0) + song.genre.slice(1).toLowerCase()}
            </span>
            {song.key && (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                Key: {song.key}
              </span>
            )}
            {song.bpm && (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="h-3.5 w-3.5" /> {song.bpm} BPM
              </span>
            )}
            <span className="text-xs text-neutral-500">
              {song.timeSignature}
            </span>
            {song.capoFret && song.capoFret > 0 && (
              <span className="flex items-center gap-1 rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                <Guitar className="h-3.5 w-3.5" /> Capo fret {song.capoFret}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chord Progression Player */}
      {song.chordsUsed.length > 0 && song.bpm && (
        <div className="mb-8">
          <ChordProgressionPlayer
            progression={song.chordsUsed.map((chord) => ({
              chord,
              beats: 4,
            }))}
            defaultBpm={song.bpm}
            lyricsWithChords={song.lyricsWithChords}
            youtubeUrl={song.youtubeUrl}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main Column — Chord Sheet */}
        <div>
          {/* Chord Toggle */}
          {song.simplifiedChords && (
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={() => setUseSimplified(false)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  !useSimplified
                    ? "bg-amber-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                )}
              >
                Original Chords
              </button>
              <button
                onClick={() => setUseSimplified(true)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  useSimplified
                    ? "bg-amber-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                )}
              >
                Simplified
              </button>
            </div>
          )}

          {/* Lyrics with Chords */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              {lyricsContent}
            </pre>
          </div>

          {/* External Links */}
          <div className="mt-4 flex gap-3">
            {song.youtubeUrl && (
              <a
                href={song.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition hover:border-red-300 hover:text-red-600 dark:border-neutral-700 dark:text-neutral-400"
              >
                <ExternalLink className="h-4 w-4" /> YouTube
              </a>
            )}
            {song.spotifyUrl && (
              <a
                href={song.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition hover:border-green-300 hover:text-green-600 dark:border-neutral-700 dark:text-neutral-400"
              >
                <ExternalLink className="h-4 w-4" /> Spotify
              </a>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chords Used */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              <Guitar className="h-4 w-4 text-amber-500" />
              Chords Used ({song.chordsUsed.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {(showAllChords ? song.chordsUsed : song.chordsUsed.slice(0, 6)).map(
                (chord) => (
                  <Link
                    key={chord}
                    href={`/chords?search=${encodeURIComponent(chord)}`}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-amber-300 hover:bg-amber-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-amber-600"
                  >
                    {chord}
                  </Link>
                )
              )}
            </div>
            {song.chordsUsed.length > 6 && (
              <button
                onClick={() => setShowAllChords((s) => !s)}
                className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                {showAllChords ? (
                  <>
                    <ChevronUp className="h-3 w-3" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" /> Show all
                  </>
                )}
              </button>
            )}
          </div>

          {/* Strumming Pattern */}
          {song.strummingPattern && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                <ArrowDownUp className="h-4 w-4 text-amber-500" />
                Strumming Pattern
              </h3>
              <div className="flex items-center justify-center gap-1">
                {song.strummingPattern.split("").map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex h-10 w-8 items-center justify-center rounded text-sm font-bold",
                      s === "D"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : s === "U"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : s === "x"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                    )}
                  >
                    {s === "D" ? "↓" : s === "U" ? "↑" : s === "x" ? "✕" : "·"}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center font-mono text-xs text-neutral-500">
                {song.strummingPattern}
              </p>
              <Link
                href={`/practice/strumming`}
                className="mt-3 block text-center text-xs text-amber-600 hover:underline dark:text-amber-400"
              >
                Practice this pattern →
              </Link>
            </div>
          )}

          {/* Related Songs */}
          {song.relatedSongs.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Similar Songs
              </h3>
              <div className="space-y-2">
                {song.relatedSongs.map((related) => (
                  <Link
                    key={related.id}
                    href={`/songs/${related.id}`}
                    className="block rounded-lg bg-neutral-50 p-3 transition hover:bg-amber-50 dark:bg-neutral-800 dark:hover:bg-amber-900/10"
                  >
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {related.title}
                    </p>
                    <p className="text-xs text-neutral-500">{related.artist}</p>
                    <div className="mt-1 flex gap-1">
                      {related.chordsUsed.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="rounded bg-neutral-200 px-1 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
