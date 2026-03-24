import prisma from "@/lib/prisma";

interface BadgeCriteria {
  type: string;
  threshold: number;
}

/**
 * Check and award any badges the user has earned.
 * Call this after practice sessions, lesson completions, chord mastery, etc.
 * Returns array of newly earned badge names.
 */
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  // Get all badges
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allBadges: any[] = await prisma.badge.findMany();

  // Get user's already-earned badges
  const earnedBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedIds = new Set(
    earnedBadges.map((ub: { badgeId: string }) => ub.badgeId)
  );

  // Get user stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      streakCount: true,
      totalPracticeMinutes: true,
      level: true,
    },
  });

  if (!user) return [];

  // Get lesson completion count
  const lessonsCompleted = await prisma.userModuleProgress.count({
    where: { userId, completed: true },
  });

  // Get mastered chord count
  const chordsMastered = await prisma.userChordProgress.count({
    where: { userId, status: "MASTERED" },
  });

  const newlyEarned: string[] = [];

  for (const badge of allBadges) {
    // Skip already earned
    if (earnedIds.has(badge.id)) continue;

    const criteria = badge.criteria as BadgeCriteria;
    let qualified = false;

    switch (criteria.type) {
      case "streak":
        qualified = user.streakCount >= criteria.threshold;
        break;
      case "practice_minutes":
        qualified = user.totalPracticeMinutes >= criteria.threshold;
        break;
      case "lessons_completed":
        qualified = lessonsCompleted >= criteria.threshold;
        break;
      case "chords_mastered":
        qualified = chordsMastered >= criteria.threshold;
        break;
      // grade_completed, ear_training_perfect, chord_changes_per_min
      // are checked at the point of action (inline)
      default:
        break;
    }

    if (qualified) {
      // Award the badge
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });

      // Award XP
      if (badge.xpReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: badge.xpReward } },
        });
      }

      newlyEarned.push(badge.name);
    }
  }

  return newlyEarned;
}
