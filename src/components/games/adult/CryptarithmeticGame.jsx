import React, { useState, useCallback } from "react";

// Each round: equation A,B digits 1-9 distinct where applicable; choices as "A,B" pairs
const ROUNDS = [
  {
    el: "AB + BA = 121 (δεκαδικό). Τι ισχύει για τα ψηφία A, B;",
    en: "AB + BA = 121 (decimal). What are digits A and B?",
    choices: [
      { a: 5, b: 6 },
      { a: 4, b: 7 },
      { a: 3, b: 8 },
      { a: 2, b: 9 },
    ],
    correct: 0,
  },
  {
    el: "Ο αριθμός AA (δηλ. 11×A) επί 2 ισούται με 88. Τι είναι το A;",
    en: "The number AA (i.e. 11×A) times 2 equals 88. What is A?",
    choices: [
      { a: 4, b: 0 },
      { a: 3, b: 0 },
      { a: 5, b: 0 },
      { a: 2, b: 0 },
    ],
    correct: 0,
  },
  {
    el: "AB − BA = 36 (A,B ψηφία, AB = 10A+B). Ποιο ζεύγος;",
    en: "AB − BA = 36 (two-digit numbers). Which pair?",
    choices: [
      { a: 7, b: 3 },
      { a: 8, b: 2 },
      { a: 9, b: 1 },
      { a: 6, b: 4 },
    ],
    correct: 0,
  },
  {
    el: "A + B = 10 και A × B = 21. Επιλέξτε (A,B) με A ≤ B.",
    en: "A + B = 10 and A × B = 21. Pick (A,B) with A ≤ B.",
    choices: [
      { a: 3, b: 7 },
      { a: 4, b: 6 },
      { a: 2, b: 8 },
      { a: 1, b: 9 },
    ],
    correct: 0,
  },
  {
    el: "A² + B² = 25 και A + B = 7 (θετικά μονοψήφια). Ποιο ζεύγος (A,B) με A ≤ B;",
    en: "A² + B² = 25 and A + B = 7 (positive digits). Which (A,B) with A ≤ B?",
    choices: [
      { a: 3, b: 4 },
      { a: 2, b: 5 },
      { a: 1, b: 6 },
      { a: 4, b: 4 },
    ],
    correct: 0,
  },
  {
    el: "10A + B + A + B = 68 και A,B μονοψήφια. Ποιο ζεύγος;",
    en: "10A + B + A + B = 68 with single digits A,B. Which pair?",
    choices: [
      { a: 6, b: 1 },
      { a: 5, b: 7 },
      { a: 4, b: 8 },
      { a: 7, b: 2 },
    ],
    correct: 0,
  },
  {
    el: "AB × 4 = BA (δύο ψηφία). Ποιο ζεύγος (A,B);",
    en: "AB × 4 = BA (two-digit). Which (A,B)?",
    choices: [
      { a: 2, b: 1 },
      { a: 1, b: 8 },
      { a: 3, b: 2 },
      { a: 4, b: 2 },
    ],
    correct: 0,
  },
  {
    el: "(10A+B) + (10B+A) = 99. Ποιο έγκυρο ζεύγος με A ≠ B;",
    en: "(10A+B) + (10B+A) = 99. Which valid pair with A ≠ B?",
    choices: [
      { a: 5, b: 4 },
      { a: 4, b: 5 },
      { a: 3, b: 6 },
      { a: 2, b: 7 },
    ],
    correct: 0,
  },
];

function verifyRound(roundIndex, choiceIdx) {
  const r = ROUNDS[roundIndex];
  const c = r.choices[choiceIdx];
  if (!c) return false;
  switch (roundIndex) {
    case 0:
      return c.a * 10 + c.b + (c.b * 10 + c.a) === 121;
    case 1:
      return (c.a * 10 + c.a) * 2 === 88;
    case 2:
      return c.a * 10 + c.b - (c.b * 10 + c.a) === 36;
    case 3:
      return c.a + c.b === 10 && c.a * c.b === 21;
    case 4:
      return c.a * c.a + c.b * c.b === 25 && c.a + c.b === 7 && c.a <= c.b;
    case 5:
      return 10 * c.a + c.b + c.a + c.b === 68;
    case 6:
      return (c.a * 10 + c.b) * 4 === c.b * 10 + c.a;
    case 7:
      return c.a * 10 + c.b + (c.b * 10 + c.a) === 99 && c.a !== c.b;
    default:
      return choiceIdx === r.correct;
  }
}

export default function CryptarithmeticGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
  }, []);

  const r = ROUNDS[round];

  const pick = (i) => {
    if (gameOver || feedback !== null) return;
    const ok = verifyRound(round, i);
    setFeedback(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (round >= ROUNDS.length - 1) setGameOver(true);
      else setRound((x) => x + 1);
    }, 650);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Κρυπταριθμητική" : "Cryptarithmetic"}
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

  const fmt = (c) => (c.b === 0 ? `A = ${c.a}` : `(A,B) = (${c.a}, ${c.b})`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Κρυπταριθμητική" : "Cryptarithmetic"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Γύρος ${round + 1} / ${ROUNDS.length} · Σκορ: ${score}` : `Round ${round + 1} / ${ROUNDS.length} · Score: ${score}`}
        </p>
        <div
          className={`rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 mb-6 border-2 ${
            feedback === "ok" ? "border-emerald-400" : feedback === "bad" ? "border-rose-400" : "border-transparent"
          }`}
        >
          <p className="text-slate-800 dark:text-slate-100 font-medium">{isEl ? r.el : r.en}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {r.choices.map((c, i) => (
            <button
              key={i}
              type="button"
              disabled={feedback !== null}
              onClick={() => pick(i)}
              className="py-4 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold transition"
            >
              {fmt(c)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
