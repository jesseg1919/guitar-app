import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const difficulty = searchParams.get("difficulty") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
      ];
    }

    if (genre) {
      where.genre = genre;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const songs = await prisma.song.findMany({
      where,
      orderBy: [{ difficulty: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        artist: true,
        genre: true,
        difficulty: true,
        decade: true,
        bpm: true,
        key: true,
        capoFret: true,
        chordsUsed: true,
        strummingPattern: true,
        albumArt: true,
        youtubeUrl: true,
      },
    });

    // Attach favorite status if authenticated
    if (session?.user?.id) {
      const favorites = await prisma.userFavorite.findMany({
        where: { userId: session.user.id },
        select: { songId: true },
      });
      const favSet = new Set(favorites.map((f: { songId: string }) => f.songId));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const songsWithFav = songs.map((song: any) => ({
        ...song,
        isFavorite: favSet.has(song.id),
      }));

      return NextResponse.json(songsWithFav);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(songs.map((s: any) => ({ ...s, isFavorite: false })));
  } catch (error) {
    console.error("Songs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
