import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // User stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalPracticeMinutes: true,
        streakCount: true,
        lastPracticeDate: true,
      },
    });

    // Practice breakdown by type (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = await prisma.practiceSession.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      select: {
        type: true,
        durationMinutes: true,
        date: true,
        score: true,
      },
      orderBy: { date: "asc" },
    });

    // Group by type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byType: Record<string, { count: number; totalMinutes: number }> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentSessions.forEach((s: any) => {
      if (!byType[s.type]) byType[s.type] = { count: 0, totalMinutes: 0 };
      byType[s.type].count++;
      byType[s.type].totalMinutes += s.durationMinutes;
    });

    // Group by day (last 14 days for chart)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const dailyMinutes: { date: string; minutes: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyMinutes.push({ date: dateStr, minutes: 0 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentSessions.forEach((s: any) => {
      const dateStr = new Date(s.date).toISOString().split("T")[0];
      const day = dailyMinutes.find((d) => d.date === dateStr);
      if (day) day.minutes += s.durationMinutes;
    });

    // Total sessions count
    const totalSessions = await prisma.practiceSession.count({
      where: { userId },
    });

    // This week's minutes
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekSessions = await prisma.practiceSession.findMany({
      where: {
        userId,
        date: { gte: startOfWeek },
      },
      select: { durationMinutes: true },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weekMinutes = weekSessions.reduce((acc: number, s: any) => acc + s.durationMinutes, 0);

    return NextResponse.json({
      totalPracticeMinutes: user?.totalPracticeMinutes || 0,
      streakCount: user?.streakCount || 0,
      lastPracticeDate: user?.lastPracticeDate,
      totalSessions,
      weekMinutes,
      byType,
      dailyMinutes,
    });
  } catch (error) {
    console.error("Practice stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
