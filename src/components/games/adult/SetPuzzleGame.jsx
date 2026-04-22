import React, { useState, useCallback } from "react";

// props: shape 0|1|2, color 0|1|2, count 1|2|3
const SHAPES = ["●", "■", "▲"];
const COLS = ["text-rose-500", "text-emerald-500", "text-sky-500"];

function isSet(a, b, c) {
  const props = ["shape", "color", "count"];
  for (const p of props) {
    const v = [a[p], b[p], c[p]];
    const allSame = v[0] === v[1] && v[1] === v[2];
    const allDiff = v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2];
    if (!allSame && !allDiff) return false;
  }
  return true;
}

const ROUNDS = [
  {
    cards: [
      { shape: 0, color: 0, count: 1 },
      { shape: 0, color: 1, count: 2 },
      { shape: 0, color: 2, count: 3 },
      { shape: 1, color: 0, count: 2 },
      { shape: 1, color: 1, count: 3 },
      { shape: 1, color: 2, count: 1 },
      { shape: 2, color: 0, count: 3 },
      { shape: 2, color: 1, count: 1 },
      { shape: 2, color: 2, count: 2 },
    ],
  },
  {
    cards: [
      { shape: 0, color: 0, count: 2 },
      { shape: 0, color: 1, count: 1 },
      { shape: 0, color: 2, count: 3 },
      { shape: 1, color: 0, count: 1 },
      { shape: 1, color: 1, count: 3 },
      { shape: 1, color: 2, count: 2 },
      { shape: 2, color: 0, count: 3 },
      { shape: 2, color: 1, count: 2 },
      { shape: 2, color: 2, count: 1 },
    ],
  },
  {
    cards: [
      { shape: 2, color: 2, count: 1 },
      { shape: 2, color: 1, count: 2 },
      { shape: 2, color: 0, count: 3 },
      { shape: 1, color: 2, count: 2 },
      { shape: 1, color: 1, count: 1 },
      { shape: 1, color: 0, count: 3 },
      { shape: 0, color: 2, count: 3 },
      { shape: 0, color: 1, count: 2 },
      { shape: 0, color: 0, count: 1 },
    ],
  },
  {
    cards: [
      { shape: 0, color: 2, count: 2 },
      { shape: 1, color: 2, count: 3 },
      { shape: 2, color: 2, count: 1 },
      { shape: 0, color: 1, count: 1 },
      { shape: 1, color: 1, count: 2 },
      { shape: 2, color: 1, count: 3 },
      { shape: 0, color: 0, count: 3 },
      { shape: 1, color: 0, count: 1 },
      { shape: 2, color: 0, count: 2 },
    ],
  },
  {
    cards: [
      { shape: 1, color: 0, count: 1 },
      { shape: 2, color: 1, count: 1 },
      { shape: 0, color: 2, count: 1 },
      { shape: 2, color: 0, count: 2 },
      { shape: 0, color: 1, count: 2 },
      { shape: 1, color: 2, count: 2 },
      { shape: 0, color: 0, count: 3 },
      { shape: 1, color: 1, count: 3 },
      { shape: 2, color: 2, count: 3 },
    ],
  },
];

function CardView({ card }) {
  const sym = SHAPES[card.shape];
  const col = COLS[card.color];
  return (
    <span className={`${col} inline-flex gap-0.5`} aria-hidden>
      {Array.from({ length: card.count }, (_, i) => (
        <span key={i} className="text-2xl leading-none">
          {sym}
        </span>
      ))}
    </span>
  );
}

export default function SetPuzzleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState("");

  const initGame = useCallback(() => {
    setRound(0);
    setSelected([]);
    setScore(0);
    setGameOver(false);
    setMsg("");
  }, []);

  const r = ROUNDS[round];

  const toggle = (i) => {
    if (gameOver) return;
    setMsg("");
    setSelected((s) => {
      if (s.includes(i)) return s.filter((x) => x !== i);
      if (s.length >= 3) return [i];
      const next = [...s, i];
      if (next.length === 3) {
        const cards = next.map((idx) => r.cards[idx]);
        const valid = isSet(cards[0], cards[1], cards[2]);
        if (valid) {
          setScore((sc) => sc + 1);
          setTimeout(() => {
            if (round >= ROUNDS.length - 1) setGameOver(true);
            else {
              setRound((x) => x + 1);
              setSelected([]);
            }
          }, 500);
        } else {
          setMsg(isEl ? "Δεν είναι έγκυρο σετ." : "Not a valid set.");
          return [];
        }
      }
      return next;
    });
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">SET</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {ROUNDS.length}
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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">SET</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-2">
          {isEl
            ? `Γύρος ${round + 1} / ${ROUNDS.length} · Επιλέξτε 3 κάρτες όπου κάθε ιδιότητα είναι όλες ίδιες ή όλες διαφορετικές.`
            : `Round ${round + 1} / ${ROUNDS.length} · Pick 3 cards where each property is all same or all different.`}
        </p>
        <p className="text-center text-indigo-600 dark:text-indigo-400 text-sm mb-4">
          {isEl ? "Σκορ" : "Score"}: {score}
        </p>
        {msg && <p className="text-center text-rose-600 dark:text-rose-400 text-sm mb-3">{msg}</p>}
        <div className="grid grid-cols-3 gap-3">
          {r.cards.map((card, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`rounded-xl border-2 p-4 min-h-[100px] flex items-center justify-center bg-white dark:bg-slate-800 shadow transition ${
                selected.includes(i) ? "border-indigo-500 ring-2 ring-indigo-300" : "border-slate-200 dark:border-slate-600"
              }`}
            >
              <CardView card={card} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
