import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const difficulty = searchParams.get("difficulty") || "";

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortName: { contains: search, mode: "insensitive" } },
      ];
    }
    if (type) {
      where.type = type;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const chords = await prisma.chord.findMany({
      where,
      orderBy: [{ difficulty: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        shortName: true,
        type: true,
        difficulty: true,
        fretboardData: true,
      },
    });

    // Attach user progress if authenticated
    if (session?.user?.id) {
      const chordIds: string[] = chords.map((c: { id: string }) => c.id);

      const userProgress: { chordId: string; status: string }[] =
        await prisma.userChordProgress.findMany({
          where: {
            userId: session.user.id,
            chordId: { in: chordIds },
          },
          select: {
            chordId: true,
            status: true,
          },
        });

      const progressMap = new Map(
        userProgress.map((p: { chordId: string; status: string }) => [
          p.chordId,
          p.status,
        ])
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chordsWithStatus = chords.map((chord: any) => ({
        ...chord,
        userStatus: progressMap.get(chord.id) || null,
      }));

      return NextResponse.json(chordsWithStatus);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      chords.map((c: { id: string }) => ({ ...c, userStatus: null }))
    );
  } catch (error) {
    console.error("Chords fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
