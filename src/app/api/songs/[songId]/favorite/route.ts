import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Add song to favorites
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songId } = await params;

    // Verify song exists
    const song = await prisma.song.findUnique({ where: { id: songId } });
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const favorite = await prisma.userFavorite.upsert({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId,
        },
      },
      create: {
        userId: session.user.id,
        songId,
      },
      update: {},
    });

    return NextResponse.json({ favorite, isFavorite: true });
  } catch (error) {
    console.error("Favorite add error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove song from favorites
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songId } = await params;

    await prisma.userFavorite.deleteMany({
      where: {
        userId: session.user.id,
        songId,
      },
    });

    return NextResponse.json({ isFavorite: false });
  } catch (error) {
    console.error("Favorite remove error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
