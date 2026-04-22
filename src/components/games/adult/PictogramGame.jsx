import React, { useState, useCallback, useMemo } from "react";

const ROUNDS_DATA = [
  {
    lines: ["🍎 + 🍎 = 6", "🍎 + 🍌 = 8"],
    q: { el: "🍌 = ?", en: "🍌 = ?" },
    opts: ["2", "3", "4", "5"],
    ans: "5",
  },
  {
    lines: ["⭐ + ⭐ + ⭐ = 9", "⭐ + 🌙 = 7"],
    q: { el: "🌙 = ?", en: "🌙 = ?" },
    opts: ["3", "4", "5", "6"],
    ans: "4",
  },
  {
    lines: ["🔺 + 🔺 = 8", "🔺 + 🔵 = 10"],
    q: { el: "🔵 = ?", en: "🔵 = ?" },
    opts: ["4", "5", "6", "7"],
    ans: "6",
  },
  {
    lines: ["🐱 + 🐱 = 4", "🐱 + 🐶 = 9"],
    q: { el: "🐶 = ?", en: "🐶 = ?" },
    opts: ["5", "6", "7", "8"],
    ans: "7",
  },
  {
    lines: ["🎵 + 🎵 + 🎵 = 15", "🎵 + 📚 = 11"],
    q: { el: "📚 = ?", en: "📚 = ?" },
    opts: ["4", "5", "6", "7"],
    ans: "6",
  },
  {
    lines: ["☕ + ☕ = 10", "☕ + 🥐 = 13"],
    q: { el: "🥐 = ?", en: "🥐 = ?" },
    opts: ["6", "7", "8", "9"],
    ans: "8",
  },
  {
    lines: ["🏠 + 🏠 = 14", "🏠 + 🚗 = 19"],
    q: { el: "🚗 = ?", en: "🚗 = ?" },
    opts: ["10", "11", "12", "13"],
    ans: "12",
  },
  {
    lines: ["🌊 + 🌊 + 🌊 = 12", "🌊 + 🐚 = 9"],
    q: { el: "🐚 = ?", en: "🐚 = ?" },
    opts: ["3", "4", "5", "6"],
    ans: "5",
  },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 8;

export default function PictogramGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(ROUNDS_DATA.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = ROUNDS_DATA[order[round]];
  const correct = current.ans;
  const options = useMemo(() => shuffleArr([...current.opts]), [round, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(ROUNDS_DATA.map((_, i) => i)));
    setRound(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
  }, []);

  const pick = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (round >= ROUNDS - 1) {
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setSelected(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🧮 {isEl ? "Εικονογραφήματα" : "Pictograms"}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {ROUNDS}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4 text-sm text-slate-500 dark:text-slate-400">
          <span>
            {isEl ? "Γύρος" : "Round"} {round + 1}/{ROUNDS}
          </span>
          <span>
            {isEl ? "Σκορ" : "Score"}: {score}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{isEl ? "Κάθε εικονίδιο έχει την ίδια αριθμητική τιμή σε όλες τις γραμμές." : "Each icon has the same numeric value everywhere."}</p>
        <div className="rounded-xl bg-slate-100 dark:bg-slate-900/50 p-4 mb-4 font-mono text-lg sm:text-xl text-slate-800 dark:text-slate-100 space-y-2">
          {current.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="text-2xl text-center mb-6 text-slate-800 dark:text-slate-100">{current.q[isEl ? "el" : "en"]}</p>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const wrong = selected !== null && opt !== correct;
            const right = selected !== null && opt === correct;
            return (
              <button
                key={`${round}-${i}`}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(opt)}
                className={`py-4 rounded-xl text-2xl font-bold font-mono transition border-2 ${
                  right
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                    : wrong
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 hover:border-indigo-400"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button
            type="button"
            onClick={next}
            className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            {round >= ROUNDS - 1 ? (isEl ? "Τέλος" : "Finish") : isEl ? "Επόμενο" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
