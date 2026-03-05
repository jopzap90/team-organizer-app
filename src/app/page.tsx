"use client";

import { useState } from "react";
import Link from "next/link";

const SPORTS = ["Futsal", "Football", "Volleyball", "Badminton", "Tennis", "Other", "Basketball"];

export default function Home() {
  const [sportType, setSportType] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [feePerHead, setFeePerHead] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    gameId: string;
    playerLink: string;
    manageLink: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sportType: sportType || SPORTS[0],
          date,
          startTime: startTime || "00:00",
          endTime: endTime || "00:00",
          venue,
          feePerHead: feePerHead ? Number(feePerHead) : 0,
          maxPlayers: maxPlayers ? Number(maxPlayers) : 10,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create game");
      setResult({
        gameId: data.gameId,
        playerLink: data.playerLink,
        manageLink: data.manageLink,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const fullPlayerUrl = typeof window !== "undefined" ? `${window.location.origin}${result.playerLink}` : result.playerLink;
    const fullManageUrl = typeof window !== "undefined" ? `${window.location.origin}${result.manageLink}` : result.manageLink;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-slate-800/80 border border-emerald-500/30 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Game created</h2>
          <p className="text-slate-300 text-sm mb-4">Share this link with players (they enter name + GCash reference):</p>
          <div className="flex gap-2 mb-2">
            <input
              readOnly
              value={fullPlayerUrl}
              className="flex-1 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-slate-200"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(fullPlayerUrl)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Copy
            </button>
          </div>
          <p className="text-slate-400 text-xs mb-4">Keep the manage link private — only you should use it to see players and verify payments.</p>
          <div className="flex gap-2 mb-6">
            <input
              readOnly
              value={fullManageUrl}
              className="flex-1 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-slate-200"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(fullManageUrl)}
              className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500"
            >
              Copy
            </button>
          </div>
          <div className="flex gap-3">
            <Link
              href={result.manageLink}
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-center font-medium text-white hover:bg-emerald-500"
            >
              Open manage page
            </Link>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="rounded-lg border border-slate-500 py-2.5 px-4 text-slate-300 hover:bg-slate-800"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-slate-100 mb-1">Pick-Up Games</h1>
        <p className="text-center text-slate-400 text-sm mb-8">Create a game and share the link. No login.</p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 shadow-xl space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Sport</label>
            <div className="relative">
              <select
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
                className="w-full appearance-none rounded-lg bg-slate-900 border border-slate-600 pl-3 pr-9 py-2 text-slate-100"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Venue</label>
            <input
              type="text"
              placeholder="e.g. Barangay court, Gym name"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Fee per head (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={feePerHead}
                onChange={(e) => setFeePerHead(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Max players</label>
              <input
                type="number"
                min="1"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create game"}
          </button>
        </form>
      </div>
    </div>
  );
}
