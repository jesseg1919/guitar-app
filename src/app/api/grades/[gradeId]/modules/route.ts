import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gradeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { gradeId } = await params;

    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
      include: {
        modules: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            videoUrl: true,
            thumbnailUrl: true,
            durationMinutes: true,
            keyTakeaways: true,
            chordsIntroduced: true,
          },
        },
      },
    });

    if (!grade) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    // Attach per-module progress if authenticated
    if (session?.user?.id) {
      interface ModuleProgress {
        moduleId: string;
        completed: boolean;
        videoProgress: number;
        checklistCompleted: string[];
        lastViewedAt: Date | null;
      }

      const userProgress: ModuleProgress[] =
        await prisma.userModuleProgress.findMany({
          where: {
            userId: session.user.id,
            module: { gradeId },
          },
          select: {
            moduleId: true,
            completed: true,
            videoProgress: true,
            checklistCompleted: true,
            lastViewedAt: true,
          },
        });

      const progressMap = new Map(
        userProgress.map((p: ModuleProgress) => [p.moduleId, p])
      );

      const modulesWithProgress = grade.modules.map(
        (mod: { id: string }, index: number) => {
          const progress = progressMap.get(mod.id);
          const prevModule =
            index > 0 ? grade.modules[index - 1] : null;
          const prevCompleted = prevModule
            ? progressMap.get(prevModule.id)?.completed === true
            : true;

          return {
            ...mod,
            completed: progress?.completed ?? false,
            videoProgress: progress?.videoProgress ?? 0,
            checklistCompleted: progress?.checklistCompleted ?? [],
            lastViewedAt: progress?.lastViewedAt ?? null,
            isLocked: index > 0 && !prevCompleted,
          };
        }
      );

      return NextResponse.json({
        ...grade,
        modules: modulesWithProgress,
      });
    }

    // Guest: first module unlocked, rest locked
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modulesGuest = grade.modules.map((mod: any, index: number) => ({
      ...mod,
      completed: false,
      videoProgress: 0,
      checklistCompleted: [],
      lastViewedAt: null,
      isLocked: index > 0,
    }));

    return NextResponse.json({
      ...grade,
      modules: modulesGuest,
    });
  } catch (error) {
    console.error("Grade modules fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
