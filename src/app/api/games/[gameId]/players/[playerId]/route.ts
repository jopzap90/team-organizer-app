import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string; playerId: string }> }
) {
  const { gameId, playerId } = await params;
  const token = request.nextUrl.searchParams.get("token");

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  if (game.organizerToken !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const paymentStatus = body?.paymentStatus;
  if (paymentStatus !== "Pending" && paymentStatus !== "Verified") {
    return NextResponse.json(
      { error: "paymentStatus must be Pending or Verified" },
      { status: 400 }
    );
  }

  const player = await prisma.player.findFirst({
    where: { id: playerId, gameId },
  });
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const updated = await prisma.player.update({
    where: { id: playerId },
    data: { paymentStatus },
  });

  return NextResponse.json(updated);
}
