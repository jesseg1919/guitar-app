"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  totalPracticeMinutes: number;
  currentGradeId: string | null;
  lastPracticeAt: string | null;
  createdAt: string;
}

async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch("/api/user/profile");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const { setProfile, setLoading } = useUserStore();

  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchProfile,
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync to Zustand store for components that need it outside React Query
  useEffect(() => {
    if (query.data) {
      setProfile(query.data);
      setLoading(false);
    } else if (status === "unauthenticated") {
      setProfile(null);
      setLoading(false);
    }
  }, [query.data, status, setProfile, setLoading]);

  return {
    user: query.data ?? null,
    session,
    isLoading: status === "loading" || query.isLoading,
    isAuthenticated: status === "authenticated",
    isGuest: status === "unauthenticated",
    refetch: query.refetch,
  };
}
