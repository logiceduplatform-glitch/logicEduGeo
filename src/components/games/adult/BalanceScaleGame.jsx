import React, { useState, useCallback } from "react";

// 2*wR*nR1 = wB*nB1  =>  wR/wB = nB1/(2*nR1) — use: nR1 reds left, nB1 blues right on scale 1
// Actually: "nR reds = nB blues" means nR * wR = nB * wB => wR/wB = nB/nR
// Scale 2: nB2 * wB = nS2 * wS => wS/wB = nB2/nS2
// Reds per star: wS / wR = (wS/wB) / (wR/wB) = (nB2/nS2) / (nB/nR) = (nB2 * nR) / (nS2 * nB)
// Answer = (nB2 * nR) / (nS * nB)
const PUZZLES = [
  { nR: 2, nB: 1, nB2: 2, nS: 1, options: [2, 3, 4, 6] },
  { nR: 3, nB: 1, nB2: 3, nS: 1, options: [3, 6, 9, 12] },
  { nR: 4, nB: 1, nB2: 4, nS: 1, options: [4, 8, 12, 16] },
  { nR: 3, nB: 1, nB2: 1, nS: 1, options: [1, 2, 3, 5] },
  { nR: 2, nB: 1, nB2: 3, nS: 1, options: [3, 5, 6, 9] },
  { nR: 1, nB: 2, nB2: 4, nS: 1, options: [1, 2, 3, 4] },
  { nR: 5, nB: 1, nB2: 5, nS: 1, options: [15, 20, 25, 30] },
  { nR: 2, nB: 3, nB2: 3, nS: 1, options: [1, 2, 3, 4] },
];

function redsPerStar(p) {
  return (p.nB2 * p.nR) / (p.nS * p.nB);
}

function PuzzleVisual({ p, isEl }) {
  const dot = (ch, n) =>
    Array.from({ length: n }, (_, i) => (
      <span key={i} aria-hidden>
        {ch}
      </span>
    ));
  return (
    <div className="text-center space-y-4 text-2xl sm:text-3xl tracking-wide">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="text-slate-600 dark:text-slate-400 text-sm">{isEl ? "Ζυγαριά 1" : "Scale 1"}</span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="flex gap-0.5">{dot("🔴", p.nR)}</span>
          <span className="text-slate-500">=</span>
          <span className="flex gap-0.5">{dot("🔵", p.nB)}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="text-slate-600 dark:text-slate-400 text-sm">{isEl ? "Ζυγαριά 2" : "Scale 2"}</span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="flex gap-0.5">{dot("🔵", p.nB2)}</span>
          <span className="text-slate-500">=</span>
          <span className="flex gap-0.5">{dot("⭐", p.nS)}</span>
        </div>
      </div>
    </div>
  );
}

export default function BalanceScaleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initGame = useCallback(() => {
    setIdx(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
  }, []);

  const p = PUZZLES[idx];
  const truth = redsPerStar(p);

  const choose = (opt) => {
    if (gameOver || feedback) return;
    const ok = Math.abs(opt - truth) < 1e-6;
    setFeedback(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (idx >= PUZZLES.length - 1) setGameOver(true);
      else setIdx((i) => i + 1);
    }, 700);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ζυγαριά" : "Balance scale"}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {PUZZLES.length}
          </p>
          <button
            type="button"
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            {isEl ? "Ξαναπαίξτε" : "Play Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Βάρη & ζυγαριές" : "Weights & scales"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Παζλ ${idx + 1} / ${PUZZLES.length} · Σκορ: ${score}` : `Puzzle ${idx + 1} / ${PUZZLES.length} · Score: ${score}`}
        </p>
        <div
          className={`rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 mb-6 border-2 ${
            feedback === "ok"
              ? "border-emerald-400"
              : feedback === "bad"
                ? "border-rose-400"
                : "border-transparent"
          }`}
        >
          <PuzzleVisual p={p} isEl={isEl} />
          <p className="text-center mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
            {isEl ? "Πόσα 🔴 ισοδυναμούν με ένα ⭐;" : "How many 🔴 equal one ⭐?"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {p.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              disabled={!!feedback}
              onClick={() => choose(opt)}
              className="py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-xl font-bold transition"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
