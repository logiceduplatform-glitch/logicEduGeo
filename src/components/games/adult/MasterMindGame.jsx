import React, { useState, useCallback } from "react";

const COLORS = [
  { id: 0, bg: "bg-rose-500" },
  { id: 1, bg: "bg-amber-400" },
  { id: 2, bg: "bg-emerald-500" },
  { id: 3, bg: "bg-sky-500" },
  { id: 4, bg: "bg-violet-500" },
  { id: 5, bg: "bg-orange-500" },
];

function randomSecret() {
  const pool = [0, 1, 2, 3, 4, 5];
  const s = [];
  for (let i = 0; i < 4; i++) {
    const j = Math.floor(Math.random() * pool.length);
    s.push(pool[j]);
    pool.splice(j, 1);
  }
  return s;
}

function scoreGuess(secret, guess) {
  let black = 0;
  const sec = secret.map((x) => x);
  const gue = guess.map((x) => x);
  for (let i = 0; i < 4; i++) {
    if (gue[i] === sec[i]) {
      black++;
      sec[i] = gue[i] = -1;
    }
  }
  let white = 0;
  for (let i = 0; i < 4; i++) {
    if (gue[i] < 0) continue;
    const j = sec.indexOf(gue[i]);
    if (j >= 0) {
      white++;
      sec[j] = -1;
    }
  }
  return { black, white };
}

export default function MasterMindGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [secret, setSecret] = useState(() => randomSecret());
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initGame = useCallback(() => {
    setSecret(randomSecret());
    setGuesses([]);
    setCurrent([]);
    setGameOver(false);
    setWon(false);
  }, []);

  const addPeg = (colorId) => {
    if (gameOver || current.length >= 4) return;
    setCurrent((c) => [...c, colorId]);
  };

  const clearPeg = () => {
    if (gameOver) return;
    setCurrent((c) => c.slice(0, -1));
  };

  const submitGuess = () => {
    if (gameOver || current.length !== 4) return;
    const feedback = scoreGuess(secret, current);
    const entry = { guess: [...current], ...feedback };
    setGuesses((g) => [...g, entry]);
    setCurrent([]);
    if (feedback.black === 4) {
      setWon(true);
      setGameOver(true);
      return;
    }
    if (guesses.length + 1 >= 10) {
      setWon(false);
      setGameOver(true);
    }
  };

  const winScore = won ? Math.max(1, 11 - guesses.length) : 0;

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Mastermind</p>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {won ? (isEl ? "Νικήσατε!" : "You cracked the code!") : isEl ? "Τέλος προσπαθειών." : "Out of guesses."}
          </p>
          {!won && (
            <div className="flex justify-center gap-1 mb-4">
              {secret.map((id, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${COLORS[id].bg}`} />
              ))}
            </div>
          )}
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Βαθμολογία" : "Score"}: {winScore}
            {won ? (isEl ? " (νίκη)" : " (win)") : ""}
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
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">Mastermind</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-4">
          {isEl
            ? `Προσπάθειες: ${guesses.length}/10 · Μαύρο = σωστή θέση, λευκό = σωστό χρώμα αλλού`
            : `Guesses: ${guesses.length}/10 · Black = correct spot, white = right color elsewhere`}
        </p>
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {guesses.map((g, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-800 p-2 shadow"
            >
              <div className="flex gap-1">
                {g.guess.map((id, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${COLORS[id].bg}`} />
                ))}
              </div>
              <div className="flex gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                <span title="black">{isEl ? "Μ" : "B"}:{g.black}</span>
                <span title="white">{isEl ? "Λ" : "W"}:{g.white}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-800 p-4 shadow mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{isEl ? "Τρέχουσα πρόβλεψη" : "Current guess"}</p>
          <div className="flex gap-2 mb-3 min-h-[2rem]">
            {current.map((id, i) => (
              <div key={i} className={`w-9 h-9 rounded-full ${COLORS[id].bg}`} />
            ))}
            {Array.from({ length: 4 - current.length }, (_, i) => (
              <div
                key={`e-${i}`}
                className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => addPeg(c.id)}
                className={`w-10 h-10 rounded-full ${c.bg} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-slate-400`}
                aria-label={`color ${c.id}`}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={clearPeg}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold"
            >
              {isEl ? "Αναίρεση" : "Undo"}
            </button>
            <button
              type="button"
              onClick={submitGuess}
              disabled={current.length !== 4}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold"
            >
              {isEl ? "Υποβολή" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
