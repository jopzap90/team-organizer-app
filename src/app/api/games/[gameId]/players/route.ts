import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const body = await request.json();
  const name = body?.name?.trim();
  const gcashNumber = body?.gcashNumber?.trim();
  const gcashReference = body?.gcashReference?.trim();

  if (!name || !gcashNumber || !gcashReference) {
    return NextResponse.json(
      { error: "Name, GCash number, and GCash reference are required" },
      { status: 400 }
    );
  }

  const currentCount = await prisma.player.count({ where: { gameId } });
  if (currentCount >= game.maxPlayers) {
    return NextResponse.json(
      { error: "Game is full" },
      { status: 400 }
    );
  }

  const player = await prisma.player.create({
    data: {
      gameId,
      name,
      gcashNumber,
      gcashReference,
    },
  });

  return NextResponse.json({ id: player.id, name: player.name });
}
