"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, xpForLevel, xpProgress } from "@/lib/utils";
import {
  Play,
  Flame,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Music,
  Wrench,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface DashboardData {
  user: {
    name: string | null;
    xp: number;
    level: number;
    streakCount: number;
    totalPracticeMinutes: number;
  };
  currentGrade: {
    id: string;
    number: number;
    title: string;
  } | null;
  nextModule: {
    id: string;
    title: string;
    order: number;
    gradeId: string;
    durationMinutes: number;
  } | null;
  recentPractice: {
    type: string;
    durationMinutes: number;
    date: string;
    score: number | null;
  }[];
  completedModulesCount: number;
  badgeCount: number;
}

export function Dashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!data) return null;

  const { user, currentGrade, nextModule } = data;
  const progress = xpProgress(user.xp);
  const xpNeeded = xpForLevel(user.level);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-neutral-500">
          {currentGrade
            ? `You're on Grade ${currentGrade.number} — ${currentGrade.title}`
            : "Start your guitar journey today"}
        </p>
      </div>

      {/* Continue learning card */}
      {nextModule && (
        <Link
          href={`/lessons/${nextModule.gradeId}/${nextModule.id}`}
          className="group mb-8 block rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 transition-all hover:shadow-lg dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Continue Learning
              </p>
              <h2 className="mt-1 text-xl font-bold text-neutral-900 dark:text-white">
                {nextModule.title}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                <span>
                  Grade {currentGrade?.number} &middot; Module{" "}
                  {nextModule.order}
                </span>
                {nextModule.durationMinutes > 0 && (
                  <>
                    <span>&middot;</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{nextModule.durationMinutes} min</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-md transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 pl-0.5" />
            </div>
          </div>
        </Link>
      )}

      {/* Stats row */}
      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <TrendingUp className="mb-2 h-5 w-5 text-blue-500" />
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {user.level}
          </div>
          <div className="text-xs text-neutral-500">Level</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-1 text-[10px] text-neutral-400">
            {Math.round(progress * xpNeeded)}/{xpNeeded} XP
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <Flame className="mb-2 h-5 w-5 text-orange-500" />
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {user.streakCount}
          </div>
          <div className="text-xs text-neutral-500">Day Streak</div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <Clock className="mb-2 h-5 w-5 text-emerald-500" />
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {formatDuration(user.totalPracticeMinutes)}
          </div>
          <div className="text-xs text-neutral-500">Total Practice</div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <BookOpen className="mb-2 h-5 w-5 text-purple-500" />
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {data.completedModulesCount}
          </div>
          <div className="text-xs text-neutral-500">Lessons Done</div>
        </div>
      </div>

      {/* Recent Practice */}
      {data.recentPractice.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
            Recent Practice
          </h2>
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            {data.recentPractice.map((session, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < data.recentPractice.length - 1
                    ? "border-b border-neutral-100 dark:border-neutral-800"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-sm dark:bg-amber-900/30">
                    {session.type === "CHORD_CHANGE"
                      ? "🔄"
                      : session.type === "STRUMMING"
                        ? "🎵"
                        : session.type === "EAR_TRAINING"
                          ? "👂"
                          : session.type === "METRONOME"
                            ? "⏱️"
                            : session.type === "DAILY_ROUTINE"
                              ? "📋"
                              : session.type === "SONG_PRACTICE"
                                ? "🎶"
                                : "🎸"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {session.type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(session.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {session.durationMinutes} min
                  </p>
                  {session.score !== null && (
                    <p className="text-xs text-amber-600">Score: {session.score}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
        Quick Access
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href: "/lessons",
            icon: BookOpen,
            title: "Lessons",
            desc: "Continue your curriculum",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-100 dark:bg-amber-900/30",
          },
          {
            href: "/practice",
            icon: Wrench,
            title: "Practice Tools",
            desc: "Metronome, tuner, and more",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            href: "/practice/routine",
            icon: Award,
            title: "Daily Routine",
            desc: "Start your daily practice",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-100 dark:bg-orange-900/30",
          },
          {
            href: "/songs",
            icon: Music,
            title: "Songs",
            desc: "Play along to real songs",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
          },
        ].map(({ href, icon: Icon, title, desc, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
          >
            <div className={`rounded-lg p-2.5 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-neutral-500">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-1 dark:text-neutral-600" />
          </Link>
        ))}
      </div>
    </div>
  );
}
