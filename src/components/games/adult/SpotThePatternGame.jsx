import React, { useState, useCallback, useMemo } from "react";

const PATTERNS = [
  { seq: ["🔴", "🔵", "🔴", "🔵"], opts: ["🔴", "🔵", "🟢", "🟡"], ans: "🔴" },
  { seq: ["1️⃣", "2️⃣", "3️⃣", "4️⃣"], opts: ["5️⃣", "4️⃣", "6️⃣", "1️⃣"], ans: "5️⃣" },
  { seq: ["⭐", "⭐⭐", "⭐⭐⭐"], opts: ["⭐⭐⭐⭐", "⭐", "⭐⭐", "✨"], ans: "⭐⭐⭐⭐" },
  { seq: ["🐶", "🐱", "🐶", "🐱"], opts: ["🐶", "🐭", "🐰", "🦊"], ans: "🐶" },
  { seq: ["▲", "▼", "▲", "▼"], opts: ["▲", "▼", "◆", "●"], ans: "▲" },
  { seq: ["2", "4", "8", "16"], opts: ["32", "24", "20", "12"], ans: "32" },
  { seq: ["🌑", "🌒", "🌓", "🌔"], opts: ["🌕", "🌙", "☀️", "⭐"], ans: "🌕" },
  { seq: ["A", "C", "E", "G"], opts: ["I", "H", "J", "F"], ans: "I" },
  { seq: ["🍎", "🍌", "🍎", "🍌"], opts: ["🍎", "🍇", "🍊", "🥝"], ans: "🍎" },
  { seq: ["10", "8", "6", "4"], opts: ["2", "0", "3", "5"], ans: "2" },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 10;

export default function SpotThePatternGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(PATTERNS.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = PATTERNS[order[round]];
  const correct = current.ans;
  const options = useMemo(() => shuffleArr([...current.opts]), [round, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(PATTERNS.map((_, i) => i)));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔍 {isEl ? "Βρείτε το μοτίβο" : "Spot the pattern"}</p>
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
        <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{isEl ? "Τι έρχεται μετά;" : "What comes next?"}</p>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-8 text-3xl sm:text-4xl">
          {current.seq.map((s, i) => (
            <span key={i} className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 dark:bg-slate-700">
              {s}
            </span>
          ))}
          <span className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-indigo-400 text-indigo-500">?</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const wrong = selected !== null && opt !== correct;
            const right = selected !== null && opt === correct;
            return (
              <button
                key={`${round}-${i}-${opt}`}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(opt)}
                className={`py-4 px-2 rounded-xl text-center text-2xl sm:text-3xl font-medium transition border-2 ${
                  right
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                    : wrong
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:border-indigo-400"
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
