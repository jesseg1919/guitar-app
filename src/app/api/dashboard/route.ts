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

    // Get user with current grade
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        xp: true,
        level: true,
        streakCount: true,
        totalPracticeMinutes: true,
        currentGradeId: true,
        currentGrade: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the next uncompleted module in the user's current grade
    let nextModule = null;
    if (user.currentGradeId) {
      const gradeModules = await prisma.module.findMany({
        where: { gradeId: user.currentGradeId },
        orderBy: { order: "asc" },
        select: { id: true, title: true, order: true, gradeId: true, durationMinutes: true },
      });

      const moduleIds: string[] = gradeModules.map(
        (m: { id: string }) => m.id
      );

      const completedProgress: { moduleId: string }[] =
        await prisma.userModuleProgress.findMany({
          where: {
            userId,
            moduleId: { in: moduleIds },
            completed: true,
          },
          select: { moduleId: true },
        });

      const completedModuleIds = completedProgress.map(
        (p: { moduleId: string }) => p.moduleId
      );

      nextModule =
        gradeModules.find(
          (m: { id: string }) => !completedModuleIds.includes(m.id)
        ) ?? null;
    }

    // Recent practice sessions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPractice = await prisma.practiceSession.findMany({
      where: {
        userId,
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: "desc" },
      take: 5,
      select: {
        type: true,
        durationMinutes: true,
        date: true,
        score: true,
      },
    });

    // Count completed modules total
    const completedModulesCount = await prisma.userModuleProgress.count({
      where: { userId, completed: true },
    });

    // Count badges earned
    const badgeCount = await prisma.userBadge.count({
      where: { userId },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        xp: user.xp,
        level: user.level,
        streakCount: user.streakCount,
        totalPracticeMinutes: user.totalPracticeMinutes,
      },
      currentGrade: user.currentGrade,
      nextModule,
      recentPractice,
      completedModulesCount,
      badgeCount,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
