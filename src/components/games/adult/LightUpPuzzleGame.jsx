import React, { useState, useCallback } from "react";

// 5x5 grids, 1=empty, 0=wall
const PUZZLES = [
  [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  [
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
  ],
  [
    [1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
  ],
  [
    [1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 0, 1, 1, 0],
    [1, 1, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ],
];

function getIlluminated(grid, lights) {
  const lit = new Set();
  const lightSet = new Set(lights.map((l) => `${l.r},${l.c}`));
  const R = grid.length;
  const C = grid[0].length;

  lights.forEach(({ r, c }) => {
    for (let i = r; i >= 0; i--) {
      if (grid[i][c] === 0) break;
      lit.add(`${i},${c}`);
    }
    for (let i = r; i < R; i++) {
      if (grid[i][c] === 0) break;
      lit.add(`${i},${c}`);
    }
    for (let j = c; j >= 0; j--) {
      if (grid[r][j] === 0) break;
      lit.add(`${r},${j}`);
    }
    for (let j = c; j < C; j++) {
      if (grid[r][j] === 0) break;
      lit.add(`${r},${j}`);
    }
  });

  return lit;
}

function hasConflict(grid, lights) {
  const R = grid.length;
  const C = grid[0].length;
  for (const { r, c } of lights) {
    for (let i = r - 1; i >= 0; i--) {
      if (grid[i][c] === 0) break;
      if (lights.some((l) => l.r === i && l.c === c)) return true;
    }
    for (let i = r + 1; i < R; i++) {
      if (grid[i][c] === 0) break;
      if (lights.some((l) => l.r === i && l.c === c)) return true;
    }
    for (let j = c - 1; j >= 0; j--) {
      if (grid[r][j] === 0) break;
      if (lights.some((l) => l.r === r && l.c === j)) return true;
    }
    for (let j = c + 1; j < C; j++) {
      if (grid[r][j] === 0) break;
      if (lights.some((l) => l.r === r && l.c === j)) return true;
    }
  }
  return false;
}

function isSolved(grid, lights) {
  if (hasConflict(grid, lights)) return false;
  const lit = getIlluminated(grid, lights);
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 1 && !lit.has(`${r},${c}`)) return false;
    }
  }
  return true;
}

export default function LightUpPuzzleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [lights, setLights] = useState([]);
  const [solved, setSolved] = useState(false);

  const grid = PUZZLES[puzzleIndex];
  const lit = getIlluminated(grid, lights);
  const conflict = hasConflict(grid, lights);
  const won = isSolved(grid, lights);

  React.useEffect(() => {
    if (won) setSolved(true);
  }, [won]);

  const handleCellClick = useCallback(
    (r, c) => {
      if (grid[r][c] !== 1 || solved) return;
      const idx = lights.findIndex((l) => l.r === r && l.c === c);
      if (idx >= 0) {
        setLights((prev) => prev.filter((_, i) => i !== idx));
      } else {
        setLights((prev) => [...prev, { r, c }]);
      }
    },
    [grid, lights, solved]
  );

  const nextPuzzle = useCallback(() => {
    setPuzzleIndex((i) => Math.min(i + 1, PUZZLES.length - 1));
    setLights([]);
    setSolved(false);
  }, []);

  const restart = useCallback(() => {
    setLights([]);
    setSolved(false);
  }, []);

  const T = {
    title: isEl ? "Φωτίστε το Πάζλ" : "Light Up Puzzle",
    puzzle: isEl ? "Πάζλ" : "Puzzle",
    rules: isEl
      ? "Τοποθετήστε φωτιστικά (💡) ώστε να φωτιστούν όλα τα κενά κελιά. Τα φωτιστικά δεν πρέπει να βλέπουν το ένα το άλλο."
      : "Place lights (💡) to illuminate all empty cells. Lights cannot see each other.",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    nextPuzzle: isEl ? "Επόμενο Πάζλ" : "Next Puzzle",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-4">{T.rules}</p>
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.puzzle}</span>
            <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">{puzzleIndex + 1}/5</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6 mb-6 flex justify-center">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${grid[0].length}, 48px)`, gridTemplateRows: `repeat(${grid.length}, 48px)` }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isWall = cell === 0;
                const hasLight = lights.some((l) => l.r === r && l.c === c);
                const illuminated = lit.has(`${r},${c}`);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    disabled={isWall || solved}
                    className={`flex items-center justify-center rounded-lg transition-all ${
                      isWall
                        ? "bg-slate-800 dark:bg-slate-600 cursor-not-allowed"
                        : hasLight
                        ? conflict
                          ? "bg-rose-200 dark:bg-rose-900/50"
                          : "bg-amber-200 dark:bg-amber-700"
                        : illuminated
                        ? "bg-amber-50 dark:bg-amber-900/30"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    {hasLight && "💡"}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {solved && (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center mb-6">
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {isEl ? "Συγχαρητήρια!" : "Congratulations!"}
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={restart}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-medium"
              >
                {T.playAgain}
              </button>
              {puzzleIndex < PUZZLES.length - 1 && (
                <button
                  onClick={nextPuzzle}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium"
                >
                  {T.nextPuzzle}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
