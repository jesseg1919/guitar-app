import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH: Update progress on a module (video progress, checklist, completion)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await params;
    const body = await request.json();
    const { videoProgress, checklistCompleted, completed } = body;

    // Verify module exists
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Upsert progress
    const updateData: Record<string, unknown> = {};
    if (videoProgress !== undefined) updateData.videoProgress = videoProgress;
    if (checklistCompleted !== undefined)
      updateData.checklistCompleted = checklistCompleted;
    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    const progress = await prisma.userModuleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId,
        },
      },
      create: {
        userId: session.user.id,
        moduleId,
        ...updateData,
      },
      update: updateData,
    });

    // If completing a module, award XP
    if (completed === true) {
      const XP_PER_MODULE = 25;

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          xp: { increment: XP_PER_MODULE },
        },
      });

      // Check if entire grade is now complete
      const gradeModules = await prisma.module.findMany({
        where: { gradeId: module.gradeId },
        select: { id: true },
      });

      const completedModules = await prisma.userModuleProgress.findMany({
        where: {
          userId: session.user.id,
          moduleId: { in: gradeModules.map((m: { id: string }) => m.id) },
          completed: true,
        },
      });

      if (completedModules.length === gradeModules.length) {
        // Grade complete! Award bonus XP and advance to next grade
        const GRADE_COMPLETE_XP = 100;

        const currentGrade = await prisma.grade.findUnique({
          where: { id: module.gradeId },
        });

        const nextGrade = currentGrade
          ? await prisma.grade.findFirst({
              where: { number: currentGrade.number + 1 },
            })
          : null;

        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            xp: { increment: GRADE_COMPLETE_XP },
            ...(nextGrade ? { currentGradeId: nextGrade.id } : {}),
          },
        });

        return NextResponse.json({
          progress,
          gradeCompleted: true,
          nextGradeId: nextGrade?.id ?? null,
          xpEarned: XP_PER_MODULE + GRADE_COMPLETE_XP,
        });
      }

      return NextResponse.json({
        progress,
        gradeCompleted: false,
        xpEarned: XP_PER_MODULE,
      });
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
