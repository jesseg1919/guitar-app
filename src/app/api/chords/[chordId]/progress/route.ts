import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH: Update chord progress (mark as LEARNING or MASTERED)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ chordId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chordId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["LEARNING", "MASTERED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be LEARNING or MASTERED." },
        { status: 400 }
      );
    }

    // Verify chord exists
    const chord = await prisma.chord.findUnique({
      where: { id: chordId },
    });

    if (!chord) {
      return NextResponse.json(
        { error: "Chord not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    const progress = await prisma.userChordProgress.upsert({
      where: {
        userId_chordId: {
          userId: session.user.id,
          chordId,
        },
      },
      create: {
        userId: session.user.id,
        chordId,
        status,
        startedAt: now,
        ...(status === "MASTERED" ? { masteredAt: now } : {}),
      },
      update: {
        status,
        ...(status === "MASTERED" ? { masteredAt: now } : {}),
      },
    });

    // Award XP for mastering a chord
    if (status === "MASTERED") {
      const XP_PER_CHORD_MASTERED = 15;

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          xp: { increment: XP_PER_CHORD_MASTERED },
        },
      });

      return NextResponse.json({
        progress,
        xpEarned: XP_PER_CHORD_MASTERED,
      });
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Chord progress update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove chord from user's progress (un-learn)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ chordId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chordId } = await params;

    await prisma.userChordProgress.deleteMany({
      where: {
        userId: session.user.id,
        chordId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chord progress delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
