import { create } from "zustand";

interface UserProfile {
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
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  addPracticeMinutes: (minutes: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: true,

  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  addXp: (amount) =>
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          xp: state.profile.xp + amount,
        },
      };
    }),

  incrementStreak: () =>
    set((state) => {
      if (!state.profile) return state;
      const newStreak = state.profile.streakCount + 1;
      return {
        profile: {
          ...state.profile,
          streakCount: newStreak,
          longestStreak: Math.max(newStreak, state.profile.longestStreak),
        },
      };
    }),

  addPracticeMinutes: (minutes) =>
    set((state) => {
      if (!state.profile) return state;
      return {
        profile: {
          ...state.profile,
          totalPracticeMinutes: state.profile.totalPracticeMinutes + minutes,
        },
      };
    }),
}));
