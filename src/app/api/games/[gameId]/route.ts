import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: {
      id: true,
      sportType: true,
      date: true,
      startTime: true,
      endTime: true,
      venue: true,
      feePerHead: true,
      maxPlayers: true,
      _count: { select: { players: true } },
    },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  return NextResponse.json(game);
}
