import React, { useState, useCallback } from "react";

const PETS_EL = ["γάτα", "σκύλο", "πουλί"];
const PETS_EN = ["cat", "dog", "bird"];
const PEOPLE_EL = ["Μαρία", "Γιάννης", "Ελένη"];
const PEOPLE_EN = ["Maria", "Giannis", "Eleni"];

// solution[i] = pet index for person i
const PUZZLES = [
  {
    el: "Η Μαρία δεν έχει τη γάτα. Ο Γιάννης έχει το πουλί. Η Ελένη δεν έχει το πουλί.",
    en: "Maria doesn't have the cat. Giannis has the bird. Eleni doesn't have the bird.",
    solution: [1, 2, 0],
  },
  {
    el: "Μόνο μία έχει τη γάτα. Η Μαρία και η Ελένη έχουν διαφορετικά κατοικίδια. Ο Γιάννης δεν έχει σκύλο.",
    en: "Only one has the cat. Maria and Eleni have different pets. Giannis doesn't have the dog.",
    solution: [2, 0, 1],
  },
  {
    el: "Η γάτα ανήκει σε όποιον δεν έχει το πουλί και δεν είναι ο Γιάννης. Ο Γιάννης έχει σκύλο.",
    en: "The cat belongs to whoever has neither the bird nor is Giannis. Giannis has the dog.",
    solution: [2, 1, 0],
  },
  {
    el: "Η Ελένη έχει τη γάτα. Η Μαρία δεν έχει το πουλί.",
    en: "Eleni has the cat. Maria doesn't have the bird.",
    solution: [1, 2, 0],
  },
  {
    el: "Ο Γιάννης έχει διαφορετικό κατοικίδιο από τη Μαρία. Η Μαρία έχει τη γάτα. Η Ελένη δεν έχει σκύλο.",
    en: "Giannis has a different pet than Maria. Maria has the cat. Eleni doesn't have the dog.",
    solution: [0, 1, 2],
  },
];

function formatChoice(sol, lang) {
  const pe = lang === "el" ? PEOPLE_EL : PEOPLE_EN;
  const pt = lang === "el" ? PETS_EL : PETS_EN;
  return sol.map((pet, i) => `${pe[i]} → ${pt[pet]}`).join(", ");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(correctSol, lang) {
  const correct = [...correctSol];
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ].filter((p) => p.some((v, i) => v !== correct[i]));
  const wrong = shuffle(perms).slice(0, 3);
  const opts = shuffle([correct, ...wrong]);
  return { opts, correctIdx: opts.findIndex((o) => o.every((v, i) => v === correct[i])) };
}

export default function GridDeductionGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [options, setOptions] = useState(() => buildOptions(PUZZLES[0].solution, isEl ? "el" : "en"));
  const [feedback, setFeedback] = useState(null);

  const initGame = useCallback(() => {
    setIdx(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
    setOptions(buildOptions(PUZZLES[0].solution, isEl ? "el" : "en"));
  }, [isEl]);

  const p = PUZZLES[idx];

  const pick = (i) => {
    if (gameOver || feedback) return;
    const ok = i === options.correctIdx;
    setFeedback(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (idx >= PUZZLES.length - 1) setGameOver(true);
      else {
        const ni = idx + 1;
        setIdx(ni);
        setOptions(buildOptions(PUZZLES[ni].solution, isEl ? "el" : "en"));
      }
    }, 650);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Πλέγμα λογικής" : "Logic grid"}
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

  const langKey = isEl ? "el" : "en";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Συμπεράσματα πλέγματος" : "Grid deduction"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Παζλ ${idx + 1} / ${PUZZLES.length} · Σκορ: ${score}` : `Puzzle ${idx + 1} / ${PUZZLES.length} · Score: ${score}`}
        </p>
        <div
          className={`rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 mb-6 border-2 ${
            feedback === "ok" ? "border-emerald-400" : feedback === "bad" ? "border-rose-400" : "border-transparent"
          }`}
        >
          <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-line">
            {p[langKey]}
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{isEl ? "Πλήρης αντιστοίχιση:" : "Full matching:"}</p>
        <div className="space-y-2">
          {options.opts.map((sol, i) => (
            <button
              key={i}
              type="button"
              disabled={!!feedback}
              onClick={() => pick(i)}
              className="w-full text-left px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-medium transition"
            >
              {formatChoice(sol, langKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
