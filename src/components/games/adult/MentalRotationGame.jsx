import React, { useState, useCallback, useMemo } from "react";

const SHAPES = [
  {
    id: "L",
    cells: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  },
  {
    id: "T",
    cells: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    id: "Z",
    cells: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
];

function rotateCW(cells) {
  const rows = cells.length;
  const cols = cells[0].length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[c][rows - 1 - r] = cells[r][c];
  return out;
}

function mirrorH(cells) {
  return cells.map((row) => [...row].reverse());
}

function cellsKey(cells) {
  return JSON.stringify(cells);
}

function ShapeGrid({ cells }) {
  const cols = cells[0]?.length ?? 1;
  return (
    <div
      className="inline-grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.flatMap((row, ri) =>
        row.map((v, ci) => (
          <div
            key={`${ri}-${ci}`}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm ${v ? "bg-indigo-600 dark:bg-indigo-400" : "bg-slate-100 dark:bg-slate-700/50"}`}
          />
        ))
      )}
    </div>
  );
}

function generateRound() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  let ref = shape.cells.map((r) => [...r]);
  for (let i = 0; i < Math.floor(Math.random() * 4); i++) ref = rotateCW(ref);
  const correct = rotateCW(ref);
  const mirrored = mirrorH(ref.map((r) => [...r]));
  const otherShape = SHAPES.filter((s) => s.id !== shape.id)[Math.floor(Math.random() * 2)];
  let distractor = otherShape.cells.map((r) => [...r]);
  for (let j = 0; j < Math.floor(Math.random() * 4); j++) distractor = rotateCW(distractor);
  let alt = rotateCW(distractor);
  const opts = [
    { cells: correct, correct: true },
    { cells: mirrored, correct: false },
    { cells: distractor, correct: false },
    { cells: alt, correct: false },
  ];
  const uniq = [];
  const seen = new Set();
  for (const o of opts) {
    const k = cellsKey(o.cells);
    if (!seen.has(k)) {
      seen.add(k);
      uniq.push(o);
    }
  }
  while (uniq.length < 4) {
    let d = SHAPES[Math.floor(Math.random() * SHAPES.length)].cells.map((r) => [...r]);
    for (let j = 0; j < Math.floor(Math.random() * 4); j++) d = rotateCW(d);
    const k = cellsKey(d);
    if (!seen.has(k)) {
      seen.add(k);
      uniq.push({ cells: d, correct: false });
    }
  }
  if (!uniq.some((o) => o.correct)) uniq[0] = { cells: correct, correct: true };
  return { reference: ref, options: uniq.slice(0, 4).sort(() => Math.random() - 0.5) };
}

export default function MentalRotationGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [puzzle, setPuzzle] = useState(() => generateRound());

  const T = useMemo(
    () => ({
      title: isEl ? "Νοητική περιστροφή" : "Mental rotation",
      instructions: isEl
        ? "Δες το σχήμα. Επίλεξε την επιλογή που είναι το ίδιο σχήμα περιστραμμένο στο επίπεδο — όχι καθρεπτισμένο. 10 γύροι."
        : "Study the shape. Pick the option that is the same figure rotated in the plane — not mirrored. 10 rounds.",
      start: isEl ? "Έναρξη" : "Start",
      round: isEl ? "Γύρος" : "Round",
      score: isEl ? "Βαθμοί" : "Score",
      pick: isEl ? "Ποιο ταιριάζει;" : "Which matches?",
      ref: isEl ? "Αναφορά" : "Reference",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Τελική βαθμολογία" : "Final score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const initGame = useCallback(() => {
    setStarted(true);
    setRound(0);
    setScore(0);
    setGameOver(false);
    setPuzzle(generateRound());
  }, []);

  const pick = useCallback(
    (isCorrect) => {
      if (gameOver || !started) return;
      if (isCorrect) setScore((s) => s + 1);
      if (round >= 9) {
        setGameOver(true);
        return;
      }
      setRound((r) => r + 1);
      setPuzzle(generateRound());
    },
    [gameOver, started, round]
  );

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔄 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}/10</span>
          </p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🔄 {T.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-left sm:text-center">{T.instructions}</p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.start}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-4">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-sm">
            {T.round}: <span className="font-bold text-amber-600 dark:text-amber-400">{round + 1}/10</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-sm">
            {T.score}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
          </div>
        </div>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{T.pick}</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6 mb-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2 text-center">{T.ref}</p>
          <div className="flex justify-center mb-6">
            <ShapeGrid cells={puzzle.reference} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {puzzle.options.map((o, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pick(o.correct)}
                className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition flex justify-center"
              >
                <ShapeGrid cells={o.cells} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
