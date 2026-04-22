import React, { useState, useCallback, useMemo } from "react";

const PUZZLES = [
  {
    text: { el: "Δύο αριθμοί: άθροισμα 15, διαφορά 3 (ο μεγαλύτερος μείον ο μικρότερος).", en: "Two numbers: sum 15, difference 3 (larger minus smaller)." },
    opts: ["(9, 6)", "(8, 7)", "(10, 5)", "(12, 4)"],
    ans: "(9, 6)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 20, διαφορά 6.", en: "Two numbers: sum 20, difference 6." },
    opts: ["(13, 7)", "(11, 9)", "(14, 6)", "(10, 10)"],
    ans: "(13, 7)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 12, διαφορά 4.", en: "Two numbers: sum 12, difference 4." },
    opts: ["(8, 4)", "(7, 5)", "(9, 3)", "(6, 6)"],
    ans: "(8, 4)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 18, διαφορά 2.", en: "Two numbers: sum 18, difference 2." },
    opts: ["(10, 8)", "(9, 9)", "(11, 7)", "(12, 6)"],
    ans: "(10, 8)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 11, διαφορά 5.", en: "Two numbers: sum 11, difference 5." },
    opts: ["(8, 3)", "(7, 4)", "(9, 2)", "(6, 5)"],
    ans: "(8, 3)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 25, διαφορά 5.", en: "Two numbers: sum 25, difference 5." },
    opts: ["(15, 10)", "(14, 11)", "(16, 9)", "(13, 12)"],
    ans: "(15, 10)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 14, διαφορά 8.", en: "Two numbers: sum 14, difference 8." },
    opts: ["(11, 3)", "(10, 4)", "(9, 5)", "(12, 2)"],
    ans: "(11, 3)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 30, διαφορά 10.", en: "Two numbers: sum 30, difference 10." },
    opts: ["(20, 10)", "(18, 12)", "(22, 8)", "(15, 15)"],
    ans: "(20, 10)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 7, διαφορά 1.", en: "Two numbers: sum 7, difference 1." },
    opts: ["(4, 3)", "(5, 2)", "(6, 1)", "(3, 4)"],
    ans: "(4, 3)",
  },
  {
    text: { el: "Δύο αριθμοί: άθροισμα 22, διαφορά 4.", en: "Two numbers: sum 22, difference 4." },
    opts: ["(13, 9)", "(12, 10)", "(14, 8)", "(11, 11)"],
    ans: "(13, 9)",
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

const ROUNDS = 10;

export default function NumberCrossGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(PUZZLES.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = PUZZLES[order[round]];
  const correct = current.ans;
  const options = useMemo(() => shuffleArr([...current.opts]), [round, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(PUZZLES.map((_, i) => i)));
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
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">➕➖ {isEl ? "Αριθμοί & εξισώσεις" : "Number cross"}</p>
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
        <p className="text-lg text-slate-800 dark:text-slate-100 mb-2">{current.text[isEl ? "el" : "en"]}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-mono">a + b = ? , |a − b| = ?</p>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{isEl ? "Διαλέξτε το σωστό ζεύγος (μεγαλύτερος, μικρότερος):" : "Pick the correct pair (larger, smaller):"}</p>
        <div className="grid gap-3">
          {options.map((opt, i) => {
            const wrong = selected !== null && opt !== correct;
            const right = selected !== null && opt === correct;
            return (
              <button
                key={`${round}-${i}`}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(opt)}
                className={`w-full py-3 px-4 rounded-xl text-left font-mono font-semibold transition border-2 ${
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
