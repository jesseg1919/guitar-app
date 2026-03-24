import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Badge definitions — these get seeded into the Badge table
export const BADGE_DEFINITIONS = [
  // Streak badges
  { name: "First Steps", description: "Practice for 1 day in a row", category: "STREAK", criteria: { type: "streak", threshold: 1 }, xpReward: 10, icon: "🎯" },
  { name: "Three Day Streak", description: "Practice for 3 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 3 }, xpReward: 25, icon: "🔥" },
  { name: "Week Warrior", description: "Practice for 7 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 7 }, xpReward: 50, icon: "⚡" },
  { name: "Two Week Streak", description: "Practice for 14 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 14 }, xpReward: 100, icon: "💪" },
  { name: "Monthly Master", description: "Practice for 30 days in a row", category: "STREAK", criteria: { type: "streak", threshold: 30 }, xpReward: 200, icon: "👑" },

  // Practice time badges
  { name: "First Hour", description: "Accumulate 60 minutes of practice", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 60 }, xpReward: 20, icon: "⏱️" },
  { name: "Five Hours In", description: "Accumulate 300 minutes of practice", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 300 }, xpReward: 50, icon: "🎵" },
  { name: "Dedicated Player", description: "Accumulate 600 minutes of practice", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 600 }, xpReward: 100, icon: "🎸" },
  { name: "Practice Machine", description: "Accumulate 1500 minutes of practice", category: "PRACTICE", criteria: { type: "practice_minutes", threshold: 1500 }, xpReward: 200, icon: "🤖" },

  // Lesson milestones
  { name: "First Lesson", description: "Complete your first lesson module", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 1 }, xpReward: 15, icon: "📖" },
  { name: "Ten Down", description: "Complete 10 lesson modules", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 10 }, xpReward: 50, icon: "📚" },
  { name: "Twenty Five Lessons", description: "Complete 25 lesson modules", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 25 }, xpReward: 100, icon: "🎓" },
  { name: "Fifty Lessons", description: "Complete 50 lesson modules", category: "MILESTONE", criteria: { type: "lessons_completed", threshold: 50 }, xpReward: 200, icon: "🏆" },

  // Chord mastery
  { name: "First Chord", description: "Master your first chord", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 1 }, xpReward: 10, icon: "🎶" },
  { name: "Five Chords", description: "Master 5 chords", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 5 }, xpReward: 30, icon: "✋" },
  { name: "Ten Chords", description: "Master 10 chords", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 10 }, xpReward: 75, icon: "🌟" },
  { name: "Chord Encyclopedia", description: "Master 20 chords", category: "MASTERY", criteria: { type: "chords_mastered", threshold: 20 }, xpReward: 150, icon: "📕" },

  // Grade completions
  { name: "Grade 1 Complete", description: "Complete all modules in Grade 1", category: "MILESTONE", criteria: { type: "grade_completed", threshold: 1 }, xpReward: 100, icon: "1️⃣" },
  { name: "Grade 2 Complete", description: "Complete all modules in Grade 2", category: "MILESTONE", criteria: { type: "grade_completed", threshold: 2 }, xpReward: 150, icon: "2️⃣" },
  { name: "Grade 3 Complete", description: "Complete all modules in Grade 3", category: "MILESTONE", criteria: { type: "grade_completed", threshold: 3 }, xpReward: 200, icon: "3️⃣" },

  // Special
  { name: "Ear for Music", description: "Score 10/10 on an ear training round", category: "SPECIAL", criteria: { type: "ear_training_perfect", threshold: 1 }, xpReward: 50, icon: "👂" },
  { name: "Speed Demon", description: "Achieve 60+ chord changes per minute", category: "SPECIAL", criteria: { type: "chord_changes_per_min", threshold: 60 }, xpReward: 75, icon: "💨" },
];

// GET: Get all badges with user's earned status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Get all badges
    let badges = await prisma.badge.findMany({
      orderBy: [{ category: "asc" }, { xpReward: "asc" }],
    });

    // If no badges exist, seed them
    if (badges.length === 0) {
      for (const def of BADGE_DEFINITIONS) {
        await prisma.badge.create({
          data: {
            name: def.name,
            description: def.description,
            category: def.category,
            criteria: def.criteria,
            xpReward: def.xpReward,
            iconUrl: def.icon,
          },
        });
      }
      badges = await prisma.badge.findMany({
        orderBy: [{ category: "asc" }, { xpReward: "asc" }],
      });
    }

    // Get user's earned badges
    let earnedBadgeIds: Set<string> = new Set();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let earnedMap: Record<string, any> = {};

    if (session?.user?.id) {
      const userBadges = await prisma.userBadge.findMany({
        where: { userId: session.user.id },
        select: { badgeId: true, earnedAt: true },
      });
      earnedBadgeIds = new Set(
        userBadges.map((ub: { badgeId: string }) => ub.badgeId)
      );
      userBadges.forEach((ub: { badgeId: string; earnedAt: Date }) => {
        earnedMap[ub.badgeId] = ub.earnedAt;
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const badgesWithStatus = badges.map((badge: any) => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: earnedMap[badge.id] || null,
    }));

    return NextResponse.json(badgesWithStatus);
  } catch (error) {
    console.error("Badges fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
