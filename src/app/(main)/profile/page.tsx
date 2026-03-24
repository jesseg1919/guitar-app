"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, xpForLevel, xpProgress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  User,
  Flame,
  Award,
  Clock,
  TrendingUp,
  Mail,
  Calendar,
  Shield,
  Loader2,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: string;
  xpReward: number;
  earned: boolean;
  earnedAt: string | null;
}

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, refetch } = useCurrentUser();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Sign in to view your profile
        </h1>
      </div>
    );
  }

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      await refetch();
      setEditName(false);
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error);
      } else {
        setPasswordMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setShowPasswordForm(false);
      }
    } catch {
      setPasswordError("Something went wrong.");
    }
  };

  const { data: badges = [] } = useQuery<Badge[]>({
    queryKey: ["badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const earnedBadges = badges.filter((b) => b.earned);

  const progress = xpProgress(user.xp);
  const xpNeeded = xpForLevel(user.level);
  const xpCurrent = Math.round(progress * xpNeeded);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <div className="flex-1">
          {editName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-lg font-bold outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-800"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setEditName(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1
              className="cursor-pointer text-2xl font-bold text-neutral-900 hover:text-amber-600 dark:text-white dark:hover:text-amber-400"
              onClick={() => {
                setName(user.name || "");
                setEditName(true);
              }}
              title="Click to edit name"
            >
              {user.name || "Guitar Learner"}
            </h1>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: TrendingUp,
            label: "Level",
            value: String(user.level),
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            icon: Flame,
            label: "Day Streak",
            value: String(user.streakCount),
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-100 dark:bg-orange-900/30",
          },
          {
            icon: Clock,
            label: "Practice Time",
            value: formatDuration(user.totalPracticeMinutes),
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
          },
          {
            icon: Award,
            label: "Badges",
            value: String(earnedBadges.length),
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-100 dark:bg-purple-900/30",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className={`mb-2 inline-flex rounded-lg p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {value}
            </div>
            <div className="text-sm text-neutral-500">{label}</div>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Level {user.level}
          </span>
          <span className="text-sm text-neutral-500">
            {xpCurrent} / {xpNeeded} XP
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Total XP: {user.xp} &middot; Longest streak: {user.longestStreak} days
        </p>
      </div>

      {/* Badges */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Badges
          </h2>
          <Link
            href="/achievements"
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {earnedBadges.length === 0 ? (
          <p className="mt-3 text-neutral-500">
            Complete lessons and practice to earn badges. Check the{" "}
            <Link href="/achievements" className="text-amber-600 hover:underline">
              achievements page
            </Link>{" "}
            to see what you can earn!
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {earnedBadges.slice(0, 12).map((badge) => (
              <div
                key={badge.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-800 dark:bg-amber-900/20"
              >
                <div className="text-2xl">{badge.iconUrl || "🏅"}</div>
                <p className="mt-1 truncate text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {badge.name}
                </p>
              </div>
            ))}
            {earnedBadges.length > 12 && (
              <Link
                href="/achievements"
                className="flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-500 hover:border-amber-300 dark:border-neutral-800 dark:bg-neutral-900"
              >
                +{earnedBadges.length - 12} more
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
          <Shield className="h-5 w-5" />
          Account Settings
        </h2>

        <div className="mt-4 space-y-4">
          {/* Change password */}
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Change Password
            </button>
          ) : (
            <form
              onSubmit={handleChangePassword}
              className="max-w-sm space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              {passwordError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {passwordError}
                </p>
              )}
              {passwordMsg && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {passwordMsg}
                </p>
              )}
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-800"
              />
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-800"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                    setPasswordMsg("");
                  }}
                  className="rounded-lg px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Sign out */}
          <div className="pt-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
