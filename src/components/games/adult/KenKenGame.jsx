import React, { useState, useCallback } from "react";

// 4x4 Latin square; cages: { cells: [[r,c]...], op, target }
const PUZZLES = [
  {
    solution: [
      [2, 1, 4, 3],
      [4, 3, 2, 1],
      [1, 2, 3, 4],
      [3, 4, 1, 2],
    ],
    cages: [
      { cells: [[0, 0], [0, 1]], op: "*", target: 2 },
      { cells: [[0, 2], [0, 3]], op: "+", target: 7 },
      { cells: [[1, 0], [1, 1]], op: "-", target: 1 },
      { cells: [[1, 2], [1, 3]], op: "*", target: 2 },
      { cells: [[2, 0], [3, 0]], op: "/", target: 2 },
      { cells: [[2, 1], [2, 2], [2, 3]], op: "+", target: 9 },
      { cells: [[3, 1], [3, 2], [3, 3]], op: "+", target: 7 },
    ],
  },
  {
    solution: [
      [3, 4, 1, 2],
      [1, 2, 3, 4],
      [4, 1, 2, 3],
      [2, 3, 4, 1],
    ],
    cages: [
      { cells: [[0, 0], [1, 0]], op: "*", target: 3 },
      { cells: [[0, 1], [0, 2]], op: "-", target: 3 },
      { cells: [[0, 3], [1, 3]], op: "+", target: 6 },
      { cells: [[1, 1], [1, 2]], op: "*", target: 6 },
      { cells: [[2, 0], [2, 1]], op: "+", target: 5 },
      { cells: [[2, 2], [3, 2]], op: "*", target: 8 },
      { cells: [[2, 3], [3, 3]], op: "+", target: 4 },
      { cells: [[3, 0], [3, 1]], op: "-", target: 1 },
    ],
  },
  {
    solution: [
      [1, 3, 2, 4],
      [4, 2, 1, 3],
      [2, 4, 3, 1],
      [3, 1, 4, 2],
    ],
    cages: [
      { cells: [[0, 0], [0, 1], [1, 0]], op: "+", target: 8 },
      { cells: [[0, 2], [0, 3]], op: "*", target: 8 },
      { cells: [[1, 1], [1, 2]], op: "-", target: 1 },
      { cells: [[1, 3], [2, 3]], op: "*", target: 3 },
      { cells: [[2, 0], [2, 1]], op: "*", target: 8 },
      { cells: [[2, 2], [3, 2]], op: "+", target: 7 },
      { cells: [[3, 0], [3, 1]], op: "+", target: 4 },
      { cells: [[3, 3]], op: "", target: 2 },
    ],
  },
];

function cageIdForCell(cages, r, c) {
  for (let i = 0; i < cages.length; i++) {
    if (cages[i].cells.some(([cr, cc]) => cr === r && cc === c)) return i;
  }
  return -1;
}

function validateCage(cage, values) {
  const nums = cage.cells.map(([r, c]) => values[r][c]).filter((n) => n >= 1 && n <= 4);
  if (nums.length !== cage.cells.length) return true;
  const { op, target } = cage;
  if (!op) return nums[0] === target;
  if (op === "+") return nums.reduce((a, b) => a + b, 0) === target;
  if (op === "*") return nums.reduce((a, b) => a * b, 1) === target;
  if (op === "-" && nums.length === 2) return Math.abs(nums[0] - nums[1]) === target;
  if (op === "/" && nums.length === 2) {
    const [a, b] = nums;
    return (a / b === target || b / a === target) && (a % b === 0 || b % a === 0);
  }
  return false;
}

function isValidGrid(grid, cages) {
  for (let r = 0; r < 4; r++) {
    const row = grid[r].filter((x) => x >= 1);
    if (row.length === 4 && new Set(row).size !== 4) return false;
  }
  for (let c = 0; c < 4; c++) {
    const col = [0, 1, 2, 3].map((r) => grid[r][c]).filter((x) => x >= 1);
    if (col.length === 4 && new Set(col).size !== 4) return false;
  }
  for (const cage of cages) {
    if (!validateCage(cage, grid)) return false;
  }
  return true;
}

function gridsEqual(a, b) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (a[r][c] !== b[r][c]) return false;
  return true;
}

export default function KenKenGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [idx, setIdx] = useState(0);
  const [grid, setGrid] = useState(() => Array.from({ length: 4 }, () => Array(4).fill(0)));
  const [solved, setSolved] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState("");

  const puzzle = PUZZLES[idx];
  const { cages, solution } = puzzle;

  const initGame = useCallback(() => {
    setIdx(0);
    setGrid(Array.from({ length: 4 }, () => Array(4).fill(0)));
    setSolved(0);
    setLives(3);
    setGameOver(false);
    setMsg("");
  }, []);

  const setDigit = (r, c, d) => {
    if (gameOver) return;
    setGrid((g) => {
      const next = g.map((row) => [...row]);
      next[r][c] = next[r][c] === d ? 0 : d;
      return next;
    });
    setMsg("");
  };

  const submit = () => {
    if (gameOver) return;
    const complete = grid.every((row) => row.every((x) => x >= 1 && x <= 4));
    if (!complete) {
      setMsg(isEl ? "Συμπληρώστε όλα τα κελιά (1–4)." : "Fill all cells with 1–4.");
      return;
    }
    if (!isValidGrid(grid, cages)) {
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) setGameOver(true);
      setMsg(isEl ? "Κανόνες KenKen δεν ικανοποιούνται." : "KenKen rules not satisfied.");
      return;
    }
    if (gridsEqual(grid, solution)) {
      const ns = solved + 1;
      setSolved(ns);
      if (idx >= PUZZLES.length - 1) {
        setGameOver(true);
        return;
      }
      setIdx((i) => i + 1);
      setGrid(Array.from({ length: 4 }, () => Array(4).fill(0)));
      setMsg(isEl ? "Σωστά!" : "Correct!");
    } else {
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) setGameOver(true);
      setMsg(isEl ? "Έγκυρο πλέγμα αλλά όχι η λύση αυτού του παζλ." : "Valid grid but not this puzzle's solution.");
    }
  };

  const opLabel = (op) => {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op;
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">KenKen</p>
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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">KenKen 4×4</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-4">
          {isEl
            ? `Παζλ ${idx + 1}/${PUZZLES.length} · Ζωές: ${lives}`
            : `Puzzle ${idx + 1}/${PUZZLES.length} · Lives: ${lives}`}
        </p>
        {msg && <p className="text-center text-amber-700 dark:text-amber-400 text-sm mb-3">{msg}</p>}
        <div className="grid grid-cols-4 gap-1 max-w-[280px] mx-auto">
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 4 }, (_, c) => {
              const cid = cageIdForCell(cages, r, c);
              const cage = cages[cid];
              const isFirst =
                cage &&
                cage.cells[0][0] === r &&
                cage.cells[0][1] === c;
              const br = r < 3 && cageIdForCell(cages, r + 1, c) !== cid;
              const bb = c < 3 && cageIdForCell(cages, r, c + 1) !== cid;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative border-slate-600 dark:border-slate-400 ${br ? "border-b-2" : ""} ${bb ? "border-r-2" : ""} border-t border-l rounded-sm bg-white dark:bg-slate-800 p-1`}
                >
                  {isFirst && cage.op && (
                    <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {cage.target}
                      {opLabel(cage.op)}
                    </span>
                  )}
                  {isFirst && !cage.op && (
                    <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {cage.target}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-0.5 justify-center mt-4">
                    {[1, 2, 3, 4].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDigit(r, c, d)}
                        className={`w-7 h-7 text-xs rounded font-semibold ${
                          grid[r][c] === d
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-4 px-2">
          {isEl
            ? "Κάθε γραμμή/στήλη: 1–4 μία φορά. Το αποτέλεσμα κλουβιού πρέπει να ταιριάζει."
            : "Each row/column: 1–4 once. Cage result must match the clue."}
        </p>
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={submit}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {isEl ? "Υποβολή" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
