import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndAwardBadges } from "@/lib/badges";

// POST: Check and award any new badges for the current user
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newBadges = await checkAndAwardBadges(session.user.id);

    return NextResponse.json({
      newBadges,
      count: newBadges.length,
    });
  } catch (error) {
    console.error("Badge check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
