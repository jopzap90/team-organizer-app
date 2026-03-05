import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const token = request.nextUrl.searchParams.get("token");

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: { orderBy: { createdAt: "asc" } } },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  if (game.organizerToken !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit organizerToken from response
  const { organizerToken, ...safe } = game;
  return NextResponse.json(safe);
}
