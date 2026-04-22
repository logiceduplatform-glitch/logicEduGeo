import React, { useState, useCallback } from "react";

const ROUNDS = [
  { seq: [2, 6, 18, 54], next: 162, wrong: [108, 144, 200, 81] },
  { seq: [1, 2, 4, 7, 11], next: 16, wrong: [14, 15, 17, 18] },
  { seq: [3, 3, 6, 9, 15], next: 24, wrong: [21, 22, 23, 27] },
  { seq: [5, 8, 14, 23, 35], next: 50, wrong: [44, 47, 48, 53] },
  { seq: [1, -2, 4, -8, 16], next: -32, wrong: [32, -16, 24, 0] },
  { seq: [2, 3, 5, 9, 17], next: 33, wrong: [25, 29, 31, 37] },
  { seq: [100, 50, 25, 12, 6], next: 3, wrong: [4, 5, 2, 0] },
  { seq: [1, 4, 9, 16, 25], next: 36, wrong: [30, 32, 34, 49] },
  { seq: [0, 1, 3, 6, 10], next: 15, wrong: [12, 13, 14, 21] },
  { seq: [1, 1, 2, 3, 5], next: 8, wrong: [6, 7, 9, 10] },
];

function shuffleWithCorrect(wrong, correct) {
  const opts = [...wrong.slice(0, 3), correct];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

export default function SequencePuzzleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [options, setOptions] = useState(() => shuffleWithCorrect(ROUNDS[0].wrong, ROUNDS[0].next));
  const [feedback, setFeedback] = useState(null);

  const initGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
    setOptions(shuffleWithCorrect(ROUNDS[0].wrong, ROUNDS[0].next));
  }, []);

  const r = ROUNDS[round];

  const pick = (val) => {
    if (gameOver || feedback) return;
    const ok = val === r.next;
    setFeedback(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (round >= ROUNDS.length - 1) {
        setGameOver(true);
        return;
      }
      const nr = round + 1;
      setRound(nr);
      setOptions(shuffleWithCorrect(ROUNDS[nr].wrong, ROUNDS[nr].next));
    }, 600);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ακολουθίες" : "Sequences"}
          </p>
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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Επόμενος όρος" : "Next term"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Γύρος ${round + 1} / ${ROUNDS.length} · Σκορ: ${score}` : `Round ${round + 1} / ${ROUNDS.length} · Score: ${score}`}
        </p>
        <div
          className={`rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 mb-6 text-center border-2 ${
            feedback === "ok" ? "border-emerald-400" : feedback === "bad" ? "border-rose-400" : "border-transparent"
          }`}
        >
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{isEl ? "Ακολουθία" : "Sequence"}</p>
          <p className="text-3xl sm:text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">
            {r.seq.join(", ")}, ?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((val, i) => (
            <button
              key={`${round}-${i}-${val}`}
              type="button"
              disabled={!!feedback}
              onClick={() => pick(val)}
              className="py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-xl font-bold transition"
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
