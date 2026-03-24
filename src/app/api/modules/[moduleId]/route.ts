import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { moduleId } = await params;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        grade: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    // Get sibling modules for prev/next navigation
    type SiblingModule = { id: string; title: string; order: number };
    const siblingModules: SiblingModule[] = await prisma.module.findMany({
      where: { gradeId: module.gradeId },
      orderBy: { order: "asc" },
      select: { id: true, title: true, order: true },
    });

    const currentIndex = siblingModules.findIndex(
      (m: SiblingModule) => m.id === moduleId
    );
    const prevModule = currentIndex > 0 ? siblingModules[currentIndex - 1] : null;
    const nextModule =
      currentIndex < siblingModules.length - 1
        ? siblingModules[currentIndex + 1]
        : null;

    let userProgress = null;

    const userId = (session?.user as { id?: string })?.id;

    if (userId && typeof userId === "string" && userId.length > 0) {
      try {
        userProgress = await prisma.userModuleProgress.findUnique({
          where: {
            userId_moduleId: {
              userId,
              moduleId,
            },
          },
        });

        // Record that user viewed this module
        if (userProgress) {
          await prisma.userModuleProgress.update({
            where: { id: userProgress.id },
            data: { lastViewedAt: new Date() },
          });
        } else {
          userProgress = await prisma.userModuleProgress.create({
            data: {
              userId,
              moduleId,
              lastViewedAt: new Date(),
            },
          });
        }
      } catch (progressError) {
        console.error("Error tracking module progress:", progressError);
        // Don't fail the entire request if progress tracking fails
      }
    }

    return NextResponse.json({
      ...module,
      prevModule,
      nextModule,
      totalModulesInGrade: siblingModules.length,
      userProgress: userProgress
        ? {
            completed: userProgress.completed,
            completedAt: userProgress.completedAt,
            videoProgress: userProgress.videoProgress,
            checklistCompleted: userProgress.checklistCompleted,
          }
        : null,
    });
  } catch (error) {
    console.error("Module fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
