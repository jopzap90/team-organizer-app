"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Game = {
  id: string;
  sportType: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  feePerHead: number;
  maxPlayers: number;
  _count: { players: number };
};

function formatTime(hhmm: string) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (h === 12) return `12:${String(m).padStart(2, "0")} PM`;
  if (h === 0) return `12:${String(m).padStart(2, "0")} AM`;
  return h > 12 ? `${h - 12}:${String(m).padStart(2, "0")} PM` : `${h}:${String(m).padStart(2, "0")} AM`;
}

export default function GameJoinPage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashReference, setGcashReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetch(`/api/games/${gameId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Game not found");
        return res.json();
      })
      .then(setGame)
      .catch(() => setError("Game not found"))
      .finally(() => setLoading(false));
  }, [gameId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/games/${gameId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), gcashNumber: gcashNumber.trim(), gcashReference: gcashReference.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join");
      setJoined(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <Link href="/" className="text-emerald-400 hover:underline">Back to home</Link>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="rounded-2xl bg-slate-800/80 border border-emerald-500/30 p-6 max-w-sm text-center">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">You’re in</h2>
          <p className="text-slate-300 text-sm">The organizer will verify your payment. See you at the game.</p>
          <Link href="/" className="mt-4 inline-block text-emerald-400 hover:underline text-sm">Back to home</Link>
        </div>
      </div>
    );
  }

  const full = game!._count.players >= game!.maxPlayers;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm mb-4 inline-block">← Home</Link>
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 shadow-xl mb-6">
          <h1 className="text-xl font-bold text-slate-100">{game!.sportType}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date(game!.date).toLocaleDateString("en-PH", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {game!.startTime
              ? ` · ${formatTime(game!.startTime)}${
                  game!.endTime && game!.endTime !== game!.startTime
                    ? ` – ${formatTime(game!.endTime)}`
                    : ""
                }`
              : ""}
          </p>
          <p className="text-slate-300 text-sm mt-1">{game!.venue}</p>
          <p className="text-slate-300 text-sm mt-2">
            ₱{game!.feePerHead} per head · {game!._count.players}/{game!.maxPlayers} players
          </p>
        </div>

        {full ? (
          <p className="text-amber-400 text-center">This game is full.</p>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 shadow-xl space-y-4">
            <h2 className="font-semibold text-slate-200">Join this game</h2>
            <p className="text-slate-400 text-sm">Pay ₱{game!.feePerHead} via GCash and enter your GCash number and payment reference below.</p>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name or nickname"
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">GCash number</label>
              <input
                type="tel"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                required
                placeholder="09XX XXX XXXX"
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">GCash reference number</label>
              <input
                type="text"
                value={gcashReference}
                onChange={(e) => setGcashReference(e.target.value)}
                required
                placeholder="From your payment confirmation"
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
