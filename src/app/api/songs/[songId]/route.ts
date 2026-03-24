import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { songId } = await params;

    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    // Check if favorited
    let isFavorite = false;
    if (session?.user?.id) {
      const fav = await prisma.userFavorite.findUnique({
        where: {
          userId_songId: {
            userId: session.user.id,
            songId,
          },
        },
      });
      isFavorite = !!fav;
    }

    // Get related songs (same genre, different song)
    type RelatedSong = {
      id: string;
      title: string;
      artist: string;
      difficulty: string;
      chordsUsed: string[];
    };
    const relatedSongs: RelatedSong[] = await prisma.song.findMany({
      where: {
        genre: song.genre,
        id: { not: songId },
      },
      take: 4,
      orderBy: { difficulty: "asc" },
      select: {
        id: true,
        title: true,
        artist: true,
        difficulty: true,
        chordsUsed: true,
      },
    });

    return NextResponse.json({
      ...song,
      isFavorite,
      relatedSongs,
    });
  } catch (error) {
    console.error("Song detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
