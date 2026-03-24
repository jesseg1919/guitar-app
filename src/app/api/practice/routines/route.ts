import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Default routine templates for new users
const DEFAULT_ROUTINES = [
  {
    name: "Beginner Daily (15 min)",
    durationMinutes: 15,
    steps: [
      { type: "warmup", duration: 2, description: "Finger stretches and warm-up exercises" },
      { type: "chord_practice", duration: 5, description: "Practice open chords: Em, Am, C, G, D" },
      { type: "chord_changes", duration: 4, description: "1-minute chord change drills between pairs" },
      { type: "strumming", duration: 3, description: "Down-Up strumming pattern at 80 BPM" },
      { type: "song", duration: 1, description: "Play through a simple 2-chord song" },
    ],
  },
  {
    name: "Intermediate Practice (30 min)",
    durationMinutes: 30,
    steps: [
      { type: "warmup", duration: 3, description: "Chromatic warm-up and finger stretches" },
      { type: "chord_practice", duration: 5, description: "Barre chords: F, Bm, B7 shapes" },
      { type: "chord_changes", duration: 5, description: "Chord change drills with barre chords" },
      { type: "strumming", duration: 5, description: "Syncopated patterns and muted strums" },
      { type: "song", duration: 7, description: "Learn or practice an intermediate song" },
      { type: "ear_training", duration: 3, description: "Interval identification exercises" },
      { type: "review", duration: 2, description: "Review and reflect on today's progress" },
    ],
  },
  {
    name: "Quick Warm-Up (10 min)",
    durationMinutes: 10,
    steps: [
      { type: "warmup", duration: 2, description: "Finger stretches" },
      { type: "chord_changes", duration: 4, description: "Quick chord change drills" },
      { type: "strumming", duration: 4, description: "Strumming pattern practice" },
    ],
  },
];

// GET: Get user's routines (or create defaults)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let routines = await prisma.practiceRoutine.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    // If user has no routines, create defaults
    if (routines.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const created: any[] = [];
      for (let i = 0; i < DEFAULT_ROUTINES.length; i++) {
        const r = DEFAULT_ROUTINES[i];
        const routine = await prisma.practiceRoutine.create({
          data: {
            userId: session.user.id,
            name: r.name,
            durationMinutes: r.durationMinutes,
            isDefault: i === 0,
            steps: r.steps,
          },
        });
        created.push(routine);
      }
      routines = created;
    }

    return NextResponse.json(routines);
  } catch (error) {
    console.error("Routines fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a custom routine
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, durationMinutes, steps } = body;

    if (!name || !steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one step are required" },
        { status: 400 }
      );
    }

    const routine = await prisma.practiceRoutine.create({
      data: {
        userId: session.user.id,
        name,
        durationMinutes: durationMinutes || steps.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc: number, s: any) => acc + (s.duration || 0),
          0
        ),
        steps,
      },
    });

    return NextResponse.json(routine);
  } catch (error) {
    console.error("Routine create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
