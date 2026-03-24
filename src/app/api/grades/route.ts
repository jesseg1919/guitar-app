import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const grades = await prisma.grade.findMany({
      orderBy: { number: "asc" },
      include: {
        modules: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            order: true,
            durationMinutes: true,
            thumbnailUrl: true,
          },
        },
        _count: {
          select: { modules: true },
        },
      },
    });

    // If user is authenticated, include their progress
    if (session?.user?.id) {
      const userProgress: { moduleId: string; completed: boolean }[] =
        await prisma.userModuleProgress.findMany({
          where: { userId: session.user.id },
          select: {
            moduleId: true,
            completed: true,
          },
        });

      const progressMap = new Map(
        userProgress.map((p: { moduleId: string; completed: boolean }) => [
          p.moduleId,
          p.completed,
        ])
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gradesWithProgress = grades.map((grade: any) => {
        const completedModules = grade.modules.filter(
          (m: { id: string }) => progressMap.get(m.id) === true
        ).length;

        return {
          ...grade,
          completedModules,
          totalModules: grade._count.modules,
          progressPercent:
            grade._count.modules > 0
              ? Math.round((completedModules / grade._count.modules) * 100)
              : 0,
        };
      });

      return NextResponse.json(gradesWithProgress);
    }

    // Guest view — no progress data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gradesPublic = grades.map((grade: any) => ({
      ...grade,
      completedModules: 0,
      totalModules: grade._count.modules,
      progressPercent: 0,
    }));

    return NextResponse.json(gradesPublic);
  } catch (error) {
    console.error("Grades fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
