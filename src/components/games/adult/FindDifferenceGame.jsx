import React, { useState, useEffect, useCallback } from "react";

const EMOJI_POOL = ["🎯", "🎨", "🎵", "🌟", "🍎", "🐱", "🚀", "🔥", "⚽", "🎸", "🌈", "💎", "🎪", "🏆", "🎭", "🎲"];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FindDifferenceGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [leftGrid, setLeftGrid] = useState([]);
  const [rightGrid, setRightGrid] = useState([]);
  const [diffIndices, setDiffIndices] = useState([]);
  const [found, setFound] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [numDiffsThisRound, setNumDiffsThisRound] = useState(3);
  const TOTAL_ROUNDS = 5;
  const GRID_SIZE = 16;

  const generateRound = useCallback(() => {
    const numDiffs = 2 + Math.floor(Math.random() * 2); // 2 or 3
    setNumDiffsThisRound(numDiffs);
    const pool = shuffle([...EMOJI_POOL]).slice(0, 10);
    const left = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      left.push(pool[i % pool.length]);
    }
    const right = [...left];
    const diffIndices = [];
    const used = new Set();
    while (diffIndices.length < numDiffs) {
      const idx = Math.floor(Math.random() * GRID_SIZE);
      if (used.has(idx)) continue;
      used.add(idx);
      diffIndices.push(idx);
      const others = pool.filter((e) => e !== right[idx]);
      right[idx] = others[Math.floor(Math.random() * others.length)];
    }
    setLeftGrid(left);
    setRightGrid(right);
    setDiffIndices(diffIndices);
    setFound([]);
  }, []);

  useEffect(() => {
    if (!gameOver && round < TOTAL_ROUNDS) generateRound();
  }, [round, gameOver, generateRound]);

  const handleRightCellClick = useCallback(
    (index) => {
      if (found.includes(index)) return;
      if (diffIndices.includes(index)) {
        setFound((f) => [...f, index]);
        if (found.length + 1 >= diffIndices.length) {
          if (round + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            setRound((r) => r + 1);
          }
        }
      }
    },
    [diffIndices, found, round]
  );

  const T = {
    title: isEl ? "Βρες τις Διαφορές" : "Find the Differences",
    round: isEl ? "Γύρος" : "Round",
    found: isEl ? "Βρέθηκαν" : "Found",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες όλους τους γύρους!" : "Congratulations! You completed all rounds!",
    playAgain: isEl ? "Παίξτε ξανά" : "Play Again",
    compare: isEl ? "Σύγκρινε και κλικ στις διαφορές στα δεξιά" : "Compare and click the differences on the right",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">🎉 {T.congrats}</h1>
          <button
            onClick={() => {
              setRound(0);
              setGameOver(false);
            }}
            className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-4">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.found}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{found.length} / {numDiffsThisRound}</span>
          </div>
        </div>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">{T.compare}</p>

        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-2 text-center">{isEl ? "Αριστερά" : "Left"}</p>
            <div className="grid grid-cols-4 gap-2 rounded-xl bg-white/90 dark:bg-slate-800/90 p-4 shadow-lg">
              {leftGrid.map((emoji, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl sm:text-3xl"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-2 text-center">{isEl ? "Δεξιά" : "Right"}</p>
            <div className="grid grid-cols-4 gap-2 rounded-xl bg-white/90 dark:bg-slate-800/90 p-4 shadow-lg">
              {rightGrid.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleRightCellClick(i)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-2xl sm:text-3xl transition
                    ${found.includes(i) ? "bg-emerald-300 dark:bg-emerald-700 ring-2 ring-emerald-500" : "bg-slate-100 dark:bg-slate-700 hover:bg-amber-200 dark:hover:bg-amber-800"}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
