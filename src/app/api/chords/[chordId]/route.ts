import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chordId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { chordId } = await params;

    const chord = await prisma.chord.findUnique({
      where: { id: chordId },
    });

    if (!chord) {
      return NextResponse.json(
        { error: "Chord not found" },
        { status: 404 }
      );
    }

    // Get user progress for this chord
    let userProgress = null;
    if (session?.user?.id) {
      userProgress = await prisma.userChordProgress.findUnique({
        where: {
          userId_chordId: {
            userId: session.user.id,
            chordId,
          },
        },
        select: {
          status: true,
          startedAt: true,
          masteredAt: true,
        },
      });
    }

    // Get related chords of same type (for "Similar Chords" section)
    type RelatedChord = {
      id: string;
      name: string;
      shortName: string;
      difficulty: string;
      fretboardData: unknown;
    };
    const relatedChords: RelatedChord[] = await prisma.chord.findMany({
      where: {
        type: chord.type,
        id: { not: chordId },
      },
      take: 6,
      orderBy: { difficulty: "asc" },
      select: {
        id: true,
        name: true,
        shortName: true,
        difficulty: true,
        fretboardData: true,
      },
    });

    return NextResponse.json({
      ...chord,
      userProgress,
      relatedChords,
    });
  } catch (error) {
    console.error("Chord detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
