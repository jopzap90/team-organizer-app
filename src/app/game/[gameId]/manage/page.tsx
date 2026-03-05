"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

type Player = {
  id: string;
  name: string;
  gcashNumber: string;
  gcashReference: string;
  paymentStatus: string;
};

type GameWithPlayers = {
  id: string;
  sportType: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  feePerHead: number;
  maxPlayers: number;
  players: Player[];
};

function formatTime(hhmm: string) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (h === 12) return `12:${String(m).padStart(2, "0")} PM`;
  if (h === 0) return `12:${String(m).padStart(2, "0")} AM`;
  return h > 12 ? `${h - 12}:${String(m).padStart(2, "0")} PM` : `${h}:${String(m).padStart(2, "0")} AM`;
}

function ManageGameContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.gameId as string;
  const token = searchParams.get("token");
  const [game, setGame] = useState<GameWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Missing organizer token");
      setLoading(false);
      return;
    }
    fetch(`/api/games/${gameId}/manage?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "Invalid link" : "Failed to load");
        return res.json();
      })
      .then(setGame)
      .catch(() => setError("Invalid or expired manage link"))
      .finally(() => setLoading(false));
  }, [gameId, token]);

  function load() {
    if (!token) return;
    fetch(`/api/games/${gameId}/manage?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "Invalid link" : "Failed to load");
        return res.json();
      })
      .then(setGame)
      .catch(() => setError("Invalid or expired manage link"));
  }

  async function toggleStatus(playerId: string, current: string) {
    const next = current === "Pending" ? "Verified" : "Pending";
    const res = await fetch(
      `/api/games/${gameId}/players/${playerId}?token=${encodeURIComponent(token!)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: next }),
      }
    );
    if (res.ok) load();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error || "Game not found"}</p>
        <Link href="/" className="text-emerald-400 hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm mb-4 inline-block">← Home</Link>
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 shadow-xl mb-6">
          <h1 className="text-xl font-bold text-slate-100">{game.sportType}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date(game.date).toLocaleDateString("en-PH", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {game.startTime
              ? ` · ${formatTime(game.startTime)}${
                  game.endTime && game.endTime !== game.startTime
                    ? ` – ${formatTime(game.endTime)}`
                    : ""
                }`
              : ""}
          </p>
          <p className="text-slate-300 text-sm mt-1">{game.venue}</p>
          <p className="text-slate-300 text-sm mt-2">₱{game.feePerHead} per head · {game.players.length}/{game.maxPlayers} players</p>
        </div>

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700 overflow-hidden shadow-xl">
          <h2 className="px-6 py-3 font-semibold text-slate-200 border-b border-slate-700">Players & payments</h2>
          {game.players.length === 0 ? (
            <p className="px-6 py-8 text-slate-400 text-center text-sm">No players yet. Share the player link.</p>
          ) : (
            <ul className="divide-y divide-slate-700">
              {game.players.map((player) => (
                <li key={player.id} className="px-6 py-4 flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="font-medium text-slate-200 min-w-[120px]">{player.name}</span>
                  <span className="text-slate-400 text-sm">{player.gcashNumber || "—"}</span>
                  <span className="text-slate-400 text-sm font-mono">{player.gcashReference}</span>
                  <button
                    type="button"
                    onClick={() => toggleStatus(player.id, player.paymentStatus)}
                    className={`ml-auto rounded-lg px-3 py-1.5 text-sm font-medium ${
                      player.paymentStatus === "Verified"
                        ? "bg-emerald-600/80 text-white hover:bg-emerald-600"
                        : "bg-slate-600 text-slate-200 hover:bg-slate-500"
                    }`}
                  >
                    {player.paymentStatus}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManageGamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6"><p className="text-slate-400">Loading…</p></div>}>
      <ManageGameContent />
    </Suspense>
  );
}
