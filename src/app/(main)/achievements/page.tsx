"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { levelFromXp, xpForLevel, xpProgress } from "@/lib/utils";
import {
  Trophy,
  Loader2,
  Lock,
  CheckCircle2,
  Flame,
  Clock,
  BookOpen,
  Music,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: string;
  criteria: { type: string; threshold: number };
  xpReward: number;
  earned: boolean;
  earnedAt: string | null;
}

const categoryLabels: Record<string, { label: string; icon: typeof Trophy }> = {
  STREAK: { label: "Streak", icon: Flame },
  PRACTICE: { label: "Practice Time", icon: Clock },
  MILESTONE: { label: "Milestones", icon: BookOpen },
  MASTERY: { label: "Chord Mastery", icon: Music },
  SPECIAL: { label: "Special", icon: Star },
  SOCIAL: { label: "Social", icon: Sparkles },
};

const categoryOrder = ["STREAK", "PRACTICE", "MILESTONE", "MASTERY", "SPECIAL", "SOCIAL"];

export default function AchievementsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: badges = [], isLoading } = useQuery<Badge[]>({
    queryKey: ["badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
  });

  const checkMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/badges/check", { method: "POST" });
      if (!res.ok) throw new Error("Failed to check badges");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.count > 0) {
        queryClient.invalidateQueries({ queryKey: ["badges"] });
      }
    },
  });

  // Group badges by category
  const grouped = badges.reduce<Record<string, Badge[]>>((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {});

  const totalBadges = badges.length;
  const earnedCount = badges.filter((b) => b.earned).length;
  const totalXpFromBadges = badges
    .filter((b) => b.earned)
    .reduce((sum, b) => sum + b.xpReward, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white">
            <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            Achievements
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Earn badges by practicing consistently, mastering chords, and completing lessons.
          </p>
        </div>
        {session && (
          <button
            onClick={() => checkMutation.mutate()}
            disabled={checkMutation.isPending}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
          >
            {checkMutation.isPending ? "Checking..." : "Check for New Badges"}
          </button>
        )}
      </div>

      {/* New badge notification */}
      {checkMutation.data?.count > 0 && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
            You earned {checkMutation.data.count} new badge{checkMutation.data.count > 1 ? "s" : ""}!
          </p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-500">
            {checkMutation.data.newBadges.join(", ")}
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <Trophy className="mx-auto mb-1 h-6 w-6 text-amber-500" />
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {earnedCount}
            <span className="text-sm font-normal text-neutral-400">/{totalBadges}</span>
          </p>
          <p className="text-xs text-neutral-500">Badges Earned</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <TrendingUp className="mx-auto mb-1 h-6 w-6 text-blue-500" />
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {totalXpFromBadges}
          </p>
          <p className="text-xs text-neutral-500">XP from Badges</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <Star className="mx-auto mb-1 h-6 w-6 text-emerald-500" />
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0}%
          </p>
          <p className="text-xs text-neutral-500">Completion</p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      )}

      {/* Badge Categories */}
      {!isLoading && (
        <div className="space-y-8">
          {categoryOrder.map((cat) => {
            const group = grouped[cat];
            if (!group || group.length === 0) return null;
            const info = categoryLabels[cat] || { label: cat, icon: Trophy };
            const CatIcon = info.icon;

            return (
              <section key={cat}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  <CatIcon className="h-5 w-5 text-amber-500" />
                  {info.label}
                  <span className="text-sm font-normal text-neutral-400">
                    ({group.filter((b) => b.earned).length}/{group.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {group.map((badge) => (
                    <div
                      key={badge.id}
                      className={cn(
                        "relative rounded-xl border p-4 text-center transition",
                        badge.earned
                          ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                          : "border-neutral-200 bg-neutral-50 opacity-60 dark:border-neutral-800 dark:bg-neutral-900"
                      )}
                    >
                      {badge.earned && (
                        <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-emerald-500" />
                      )}
                      {!badge.earned && (
                        <Lock className="absolute right-2 top-2 h-3.5 w-3.5 text-neutral-400" />
                      )}
                      <div className="mb-2 text-3xl">
                        {badge.iconUrl || "🏅"}
                      </div>
                      <h3
                        className={cn(
                          "text-sm font-semibold",
                          badge.earned
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-500"
                        )}
                      >
                        {badge.name}
                      </h3>
                      <p className="mt-1 text-[11px] leading-tight text-neutral-500">
                        {badge.description}
                      </p>
                      <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                        +{badge.xpReward} XP
                      </p>
                      {badge.earned && badge.earnedAt && (
                        <p className="mt-1 text-[10px] text-neutral-400">
                          {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
