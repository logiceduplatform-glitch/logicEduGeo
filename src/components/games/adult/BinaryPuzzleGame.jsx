import React, { useState, useCallback } from "react";

const N = 6;

function validLine(line) {
  let z = 0,
    o = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === null) continue;
    if (line[i] === 0) z++;
    else o++;
    if (i >= 2) {
      const a = line[i - 2],
        b = line[i - 1],
        c = line[i];
      if (a !== null && b !== null && c !== null && a === b && b === c) return false;
    }
  }
  const filled = z + o;
  if (filled === N && (z !== N / 2 || o !== N / 2)) return false;
  if (z > N / 2 || o > N / 2) return false;
  return true;
}

// null = player fills
const PUZZLES = [
  {
    initial: [
      [1, null, null, null, null, 0],
      [null, 0, null, null, 1, null],
      [null, null, 1, 0, null, null],
      [null, null, 0, 1, null, null],
      [null, 1, null, null, 0, null],
      [0, null, null, null, null, 1],
    ],
    solution: [
      [1, 1, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 1],
      [0, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 1],
    ],
  },
  {
    initial: [
      [null, 1, null, null, 0, null],
      [1, null, null, null, null, 0],
      [null, null, null, 1, null, null],
      [null, null, 1, null, null, null],
      [0, null, null, null, null, 1],
      [null, 0, null, null, 1, null],
    ],
    solution: [
      [0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0],
      [0, 1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1, 0],
    ],
  },
  {
    initial: [
      [0, null, null, null, null, 1],
      [null, null, 0, 1, null, null],
      [null, 1, null, null, 0, null],
      [null, 0, null, null, 1, null],
      [null, null, 1, 0, null, null],
      [1, null, null, null, null, 0],
    ],
    solution: [
      [0, 0, 1, 1, 0, 1],
      [1, 1, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0, 1],
      [1, 1, 0, 0, 1, 0],
    ],
  },
];

function cloneGrid(g) {
  return g.map((row) => [...row]);
}

export default function BinaryPuzzleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [pidx, setPidx] = useState(0);
  const [grid, setGrid] = useState(() => cloneGrid(PUZZLES[0].initial));
  const [solved, setSolved] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState("");

  const initGame = useCallback(() => {
    setPidx(0);
    setGrid(cloneGrid(PUZZLES[0].initial));
    setSolved(0);
    setLives(3);
    setGameOver(false);
    setMsg("");
  }, []);

  const puzzle = PUZZLES[pidx];

  const toggle = (r, c) => {
    if (gameOver) return;
    if (puzzle.initial[r][c] !== null) return;
    setGrid((g) => {
      const next = cloneGrid(g);
      const v = next[r][c];
      next[r][c] = v === null ? 0 : v === 0 ? 1 : null;
      return next;
    });
    setMsg("");
  };

  const check = () => {
    if (gameOver) return;
    if (grid.some((row) => row.some((x) => x === null))) {
      setMsg(isEl ? "Συμπληρώστε όλα τα κελιά." : "Fill all cells.");
      return;
    }
    for (let r = 0; r < N; r++) if (!validLine(grid[r])) {
      fail();
      return;
    }
    for (let c = 0; c < N; c++) {
      const col = grid.map((row) => row[c]);
      if (!validLine(col)) {
        fail();
        return;
      }
    }
    for (let r = 0; r < N; r++) {
      const z = grid[r].filter((x) => x === 0).length;
      if (z !== N / 2) {
        fail();
        return;
      }
    }
    for (let c = 0; c < N; c++) {
      const z = grid.map((row) => row[c]).filter((x) => x === 0).length;
      if (z !== N / 2) {
        fail();
        return;
      }
    }
    const match = grid.every((row, r) => row.every((v, c) => v === puzzle.solution[r][c]));
    if (!match) {
      fail();
      return;
    }
    const ns = solved + 1;
    setSolved(ns);
    setMsg(isEl ? "Σωστά!" : "Correct!");
    if (pidx >= PUZZLES.length - 1) {
      setGameOver(true);
      return;
    }
    setTimeout(() => {
      setPidx((i) => {
        const ni = i + 1;
        setGrid(cloneGrid(PUZZLES[ni].initial));
        return ni;
      });
      setMsg("");
    }, 600);
  };

  function fail() {
    const nl = lives - 1;
    setLives(nl);
    setMsg(isEl ? "Οι κανόνες δεν τηρούνται ή η λύση είναι λάθος." : "Rules broken or wrong solution.");
    if (nl <= 0) setGameOver(true);
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Binary 6×6</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Παζλ που λύθηκαν" : "Puzzles solved"}: {solved}
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
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">Binary 6×6</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-2">
          {isEl
            ? `Παζλ ${pidx + 1}/${PUZZLES.length} · Ζωές: ${lives} · Λυμένα: ${solved}`
            : `Puzzle ${pidx + 1}/${PUZZLES.length} · Lives: ${lives} · Solved: ${solved}`}
        </p>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-4 px-2">
          {isEl
            ? "Κανόνες: το πολύ δύο ίδια διαδοχικά · ίσος αριθμός 0 και 1 ανά γραμμή/στήλη."
            : "Rules: no more than two same adjacent · equal 0s and 1s per row/column."}
        </p>
        {msg && <p className="text-center text-amber-700 dark:text-amber-400 text-sm mb-3">{msg}</p>}
        <div className="grid grid-cols-6 gap-1 mx-auto w-fit">
          {grid.map((row, r) =>
            row.map((v, c) => {
              const fixed = puzzle.initial[r][c] !== null;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  disabled={fixed}
                  onClick={() => toggle(r, c)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold border-2 ${
                    fixed
                      ? "bg-slate-300 dark:bg-slate-600 border-slate-500 text-slate-900 dark:text-slate-100"
                      : v === 0
                        ? "bg-sky-200 dark:bg-sky-900 border-sky-500 text-sky-900 dark:text-sky-100"
                        : v === 1
                          ? "bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-900 dark:text-amber-100"
                          : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {v === null ? "" : v}
                </button>
              );
            })
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={check}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {isEl ? "Έλεγχος" : "Check"}
          </button>
        </div>
      </div>
    </div>
  );
}
