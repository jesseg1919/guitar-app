import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const VALID_TYPES = [
  "CHORD_CHANGE",
  "STRUMMING",
  "EAR_TRAINING",
  "METRONOME",
  "LESSON",
  "SONG_PRACTICE",
  "FREE_PRACTICE",
  "DAILY_ROUTINE",
];

// POST: Log a practice session
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, durationMinutes, details, score } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid practice type" },
        { status: 400 }
      );
    }

    if (!durationMinutes || durationMinutes < 1) {
      return NextResponse.json(
        { error: "Duration must be at least 1 minute" },
        { status: 400 }
      );
    }

    // Create the practice session
    const practiceSession = await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        type,
        durationMinutes: Math.round(durationMinutes),
        details: details || undefined,
        score: score || undefined,
      },
    });

    // Update user's total practice minutes
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalPracticeMinutes: { increment: Math.round(durationMinutes) },
      },
    });

    // Update streak: check if user practiced yesterday
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastPracticeDate: true, streakCount: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPractice = user?.lastPracticeDate
      ? new Date(user.lastPracticeDate)
      : null;
    if (lastPractice) lastPractice.setHours(0, 0, 0, 0);

    let newStreak = user?.streakCount || 0;

    if (!lastPractice || lastPractice.getTime() < today.getTime()) {
      // Haven't practiced today yet
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastPractice && lastPractice.getTime() === yesterday.getTime()) {
        // Practiced yesterday — continue streak
        newStreak += 1;
      } else if (!lastPractice || lastPractice.getTime() < yesterday.getTime()) {
        // Missed a day — reset streak
        newStreak = 1;
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          streakCount: newStreak,
          lastPracticeDate: new Date(),
        },
      });
    }

    // Award XP for practice
    const XP_PER_5_MINUTES = 5;
    const xpEarned = Math.floor(durationMinutes / 5) * XP_PER_5_MINUTES;

    if (xpEarned > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { xp: { increment: xpEarned } },
      });
    }

    return NextResponse.json({
      practiceSession,
      xpEarned,
      streak: newStreak,
    });
  } catch (error) {
    console.error("Practice session create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: List practice sessions for current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const limit = parseInt(searchParams.get("limit") || "50");

    const since = new Date();
    since.setDate(since.getDate() - days);

    const sessions = await prisma.practiceSession.findMany({
      where: {
        userId: session.user.id,
        date: { gte: since },
      },
      orderBy: { date: "desc" },
      take: Math.min(limit, 100),
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Practice sessions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
