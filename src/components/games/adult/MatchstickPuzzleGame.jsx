import React, { useState, useEffect, useCallback } from "react";

const PUZZLES = [
  {
    equation: [6, "+", 4, "=", 4],
    options: [
      [8, "-", 4, "=", 4],
      [5, "+", 4, "=", 9],
      [6, "+", 4, "=", 5],
    ],
    correct: 0,
  },
  {
    equation: [6, "+", 4, "=", 4],
    options: [
      [6, "-", 4, "=", 2],
      [6, "+", 4, "=", 10],
      [8, "+", 4, "=", 4],
    ],
    correct: 1,
  },
  {
    equation: [9, "-", 5, "=", 4],
    options: [
      [8, "-", 5, "=", 3],
      [5, "-", 5, "=", 4],
      [9, "-", 6, "=", 3],
    ],
    correct: 0,
  },
  {
    equation: [6, "+", 4, "=", 4],
    options: [
      [5, "+", 4, "=", 9],
      [8, "-", 4, "=", 4],
      [6, "-", 4, "=", 2],
    ],
    correct: 0,
  },
  {
    equation: [8, "-", 4, "=", 1],
    options: [
      [6, "-", 4, "=", 2],
      [8, "-", 3, "=", 5],
      [9, "-", 4, "=", 5],
    ],
    correct: 0,
  },
  {
    equation: [1, "+", 1, "=", 1],
    options: [
      [1, "-", 1, "=", 0],
      [1, "+", 1, "=", 2],
      [7, "-", 1, "=", 6],
    ],
    correct: 0,
  },
  {
    equation: [7, "-", 7, "=", 7],
    options: [
      [7, "-", 7, "=", 0],
      [1, "-", 7, "=", 7],
      [7, "+", 7, "=", 7],
    ],
    correct: 0,
  },
  {
    equation: [9, "+", 0, "=", 9],
    options: [
      [8, "+", 1, "=", 9],
      [9, "+", 8, "=", 9],
      [5, "+", 4, "=", 9],
    ],
    correct: 0,
  },
];

export default function MatchstickPuzzleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);

  const T = {
    title: isEl ? "Παιχνίδι Σπίρτων" : "Matchstick Puzzle",
    hint: isEl ? "Μετακίνησε ένα σπίρτο για να γίνει σωστή η εξίσωση" : "Move one matchstick to make the equation correct",
    choose: isEl ? "Επέλεξε τη σωστή εξίσωση:" : "Choose the correct equation:",
    next: isEl ? "Επόμενο" : "Next",
    prev: isEl ? "Προηγούμενο" : "Previous",
    correct: isEl ? "Σωστό!" : "Correct!",
    wrong: isEl ? "Λάθος! Δοκίμασε ξανά." : "Wrong! Try again.",
  };

  const puzzle = PUZZLES[puzzleIndex];
  const equation = puzzle.equation;

  const handleSelect = useCallback(
    (optIdx) => {
      if (solved) return;
      setWrong(false);
      if (optIdx === puzzle.correct) {
        setSolved(true);
      } else {
        setWrong(true);
      }
    },
    [puzzle.correct, solved]
  );

  useEffect(() => {
    setSelected(null);
    setSolved(false);
    setWrong(false);
  }, [puzzleIndex]);

  const EquationDisplay = ({ eq, className = "" }) => (
    <div className={`flex items-center justify-center gap-1 flex-wrap ${className}`}>
      {eq.map((d, i) => (
        <span
          key={i}
          className={`tabular-nums font-bold ${
            typeof d === "number"
              ? "text-amber-800 dark:text-amber-200"
              : "text-slate-500 dark:text-slate-400"
          }`}
          style={{ fontSize: "clamp(1.25rem, 5vw, 2rem)" }}
        >
          {typeof d === "number" ? d : d}
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.hint}</p>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setPuzzleIndex((i) => Math.max(0, i - 1))}
            disabled={puzzleIndex === 0}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition"
          >
            {T.prev}
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {puzzleIndex + 1} / {PUZZLES.length}
          </span>
          <button
            onClick={() => setPuzzleIndex((i) => Math.min(PUZZLES.length - 1, i + 1))}
            disabled={puzzleIndex === PUZZLES.length - 1}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition"
          >
            {T.next}
          </button>
        </div>

        {solved && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-semibold text-center">
            ✓ {T.correct}
          </div>
        )}

        {wrong && (
          <div className="mb-4 p-4 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 font-semibold text-center">
            {T.wrong}
          </div>
        )}

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-2">
            {isEl ? "Τρέχουσα (λάθος) εξίσωση:" : "Current (wrong) equation:"}
          </p>
          <div className="mb-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50">
            <EquationDisplay eq={equation} />
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{T.choose}</p>
          <div className="space-y-3">
            {puzzle.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={solved}
                className={`w-full p-4 rounded-xl text-left font-mono font-bold transition flex items-center justify-between
                  ${
                    solved && idx === puzzle.correct
                      ? "bg-emerald-500 text-white"
                      : solved
                      ? "bg-slate-100 dark:bg-slate-700 opacity-60"
                      : "bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-800 dark:text-slate-200"
                  }`}
              >
                <EquationDisplay eq={opt} />
                {solved && idx === puzzle.correct && " ✓"}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          {isEl
            ? "Τα ψηφία μοιάζουν με ψηφιακό ρολόι (7 τμήματα). Μία μετάθεση σπίρτου αλλάζει το αποτέλεσμα."
            : "Digits use 7-segment display style. Moving one matchstick changes the result."}
        </p>
      </div>
    </div>
  );
}
