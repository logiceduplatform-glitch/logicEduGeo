import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useGameRewards } from "../../hooks/useGameRewards";

const SIZE = 5;
const STORAGE_BEST = "kibloo:lightsout:bestMoves";

const T = {
  el: {
    title: "Lights Out",
    desc: "Πάτα τετράγωνα για να σβήσεις όλα τα φώτα. Κάθε πάτημα αλλάζει το τετράγωνο και τους γείτονές του.",
    moves: "Κινήσεις",
    best: "Καλύτερο",
    restart: "Νέο παιχνίδι",
    win: "Νίκησες! 🎉",
    winInMoves: "Λύθηκε σε {n} κινήσεις",
    difficulty: "Δυσκολία",
    easy: "Εύκολο",
    medium: "Μεσαίο",
    hard: "Δύσκολο",
    rule: "Στόχος: σβήσε όλα τα τετράγωνα.",
  },
  en: {
    title: "Lights Out",
    desc: "Tap tiles to turn off every light. Each tap toggles the tile and its 4 neighbors.",
    moves: "Moves",
    best: "Best",
    restart: "New game",
    win: "You won! 🎉",
    winInMoves: "Solved in {n} moves",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    rule: "Goal: turn off every tile.",
  },
};

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
}

function clone(b) { return b.map((r) => [...r]); }

/** Generate a solvable puzzle by toggling random tiles N times from solved state. */
function randomBoard(taps) {
  const b = emptyBoard();
  // Avoid all-off (already solved); ensure at least one tap.
  const n = Math.max(1, taps);
  const seen = new Set();
  while (seen.size < n) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    seen.add(`${r}_${c}`);
  }
  for (const k of seen) {
    const [r, c] = k.split("_").map(Number);
    toggle(b, r, c);
  }
  // Edge case: if random taps cancel out → reroll.
  if (b.flat().every((v) => !v)) return randomBoard(taps + 1);
  return b;
}

function toggle(board, r, c) {
  const flip = (rr, cc) => {
    if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) board[rr][cc] = !board[rr][cc];
  };
  flip(r, c); flip(r - 1, c); flip(r + 1, c); flip(r, c - 1); flip(r, c + 1);
}

const DIFFICULTY_TAPS = { easy: 3, medium: 6, hard: 10 };

export default function LightsOutPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const rewards = useGameRewards("lightsout");

  const [difficulty, setDifficulty] = useState("medium");
  const [board, setBoard] = useState(() => randomBoard(DIFFICULTY_TAPS.medium));
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => {
    const raw = parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10);
    return Number.isFinite(raw) && raw > 0 ? raw : null;
  });
  const startedAt = useRef(Date.now());

  const won = useMemo(() => board.flat().every((v) => !v), [board]);

  // Track best moves on win
  useEffect(() => {
    if (!won) return;
    const score = Math.max(1, 100 - moves * 5);
    rewards.complete(score, 100);
    rewards.award(Math.min(20, Math.max(5, 25 - moves)), "Lights Out solved");
    if (best === null || moves < best) {
      setBest(moves);
      try { localStorage.setItem(STORAGE_BEST, String(moves)); } catch { /* noop */ }
      rewards.milestone("new_best", moves);
    }
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = useCallback((diff = difficulty) => {
    setBoard(randomBoard(DIFFICULTY_TAPS[diff] || 6));
    setMoves(0);
    startedAt.current = Date.now();
  }, [difficulty]);

  const handleTap = (r, c) => {
    if (won) return;
    const next = clone(board);
    toggle(next, r, c);
    setBoard(next);
    setMoves((m) => m + 1);
  };

  const onChangeDifficulty = (d) => {
    setDifficulty(d);
    restart(d);
  };

  return (
    <GameShell title={l.title} description={l.desc}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{l.moves}:</span>
            <span className="font-extrabold text-purple-600 dark:text-purple-400">{moves}</span>
          </div>
          {best !== null && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{l.best}:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{best}</span>
            </div>
          )}
          <button
            onClick={() => restart()}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow"
          >
            {l.restart}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mb-4 text-xs">
          <span className="text-slate-500 dark:text-slate-400 mr-1">{l.difficulty}:</span>
          {[
            { id: "easy", label: l.easy },
            { id: "medium", label: l.medium },
            { id: "hard", label: l.hard },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onChangeDifficulty(d.id)}
              className={`px-2 py-1 rounded-md font-bold transition ${
                difficulty === d.id
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div
          role="grid"
          aria-label={l.title}
          className="grid gap-1.5 p-3 rounded-2xl bg-slate-200 dark:bg-slate-900 mx-auto w-fit"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0,1fr))` }}
        >
          {board.flatMap((row, r) =>
            row.map((on, c) => (
              <button
                key={`${r}_${c}`}
                role="gridcell"
                aria-pressed={on}
                aria-label={`${r + 1},${c + 1}`}
                onClick={() => handleTap(r, c)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                  on
                    ? "bg-gradient-to-br from-amber-300 to-yellow-400 shadow-[inset_0_0_12px_rgba(251,191,36,0.5)] ring-2 ring-amber-500/60"
                    : "bg-slate-700 dark:bg-slate-800 hover:bg-slate-600"
                }`}
              />
            ))
          )}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">{l.rule}</p>

        {won && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-center shadow-lg">
            <p className="text-lg font-extrabold">{l.win}</p>
            <p className="text-sm opacity-90 mt-1">{l.winInMoves.replace("{n}", moves)}</p>
            <button
              onClick={() => restart()}
              className="mt-3 px-4 py-2 rounded-lg bg-white text-emerald-700 font-bold text-sm hover:scale-105 transition"
            >
              {l.restart}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
