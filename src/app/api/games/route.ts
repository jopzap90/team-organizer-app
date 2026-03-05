import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sportType, date, startTime, endTime, venue, feePerHead, maxPlayers } = body;

    if (!sportType || !date || !venue || feePerHead == null || !maxPlayers) {
      return NextResponse.json(
        { error: "Missing required fields: sportType, date, venue, feePerHead, maxPlayers" },
        { status: 400 }
      );
    }

    const organizerToken = randomBytes(24).toString("hex");

    const game = await prisma.game.create({
      data: {
        sportType: String(sportType).trim(),
        date: String(date).trim(),
        startTime: startTime != null && String(startTime).trim() ? String(startTime).trim() : "00:00",
        endTime: endTime != null && String(endTime).trim() ? String(endTime).trim() : "00:00",
        venue: String(venue).trim(),
        feePerHead: Number(feePerHead),
        maxPlayers: Math.max(1, Math.floor(Number(maxPlayers))),
        organizerToken,
      },
    });

    return NextResponse.json({
      gameId: game.id,
      organizerToken,
      playerLink: `/game/${game.id}`,
      manageLink: `/game/${game.id}/manage?token=${organizerToken}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
