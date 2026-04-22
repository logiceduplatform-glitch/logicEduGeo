import React, { useState, useEffect, useCallback, useRef } from "react";

function createSolvedGrid() {
  const grid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  function isValid(row, col, num) {
    for (let i = 0; i < 9; i++) if (grid[row][i] === num) return false;
    for (let i = 0; i < 9; i++) if (grid[i][col] === num) return false;
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
      for (let c = bc; c < bc + 3; c++)
        if (grid[r][c] === num) return false;
    return true;
  }

  function solve(r, c) {
    if (r === 9) return true;
    if (c === 9) return solve(r + 1, 0);
    if (grid[r][c] !== 0) return solve(r, c + 1);

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    for (const n of nums) {
      if (isValid(r, c, n)) {
        grid[r][c] = n;
        if (solve(r, c + 1)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }

  solve(0, 0);
  return grid.map((row) => [...row]);
}

function generatePuzzle(givenCount = 35) {
  const solved = createSolvedGrid();
  const puzzle = solved.map((row) => row.map((v) => v));
  const positions = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) positions.push({ r, c });

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const toRemove = 81 - givenCount;
  for (let k = 0; k < toRemove && k < positions.length; k++) {
    puzzle[positions[k].r][positions[k].c] = 0;
  }

  return { puzzle, solved };
}

export default function SudokuGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [grid, setGrid] = useState(null);
  const [given, setGiven] = useState(null);
  const [solved, setSolved] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("playing");
  const [conflicts, setConflicts] = useState(new Set());
  const timerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const T = {
    title: isEl ? "Σουντόκου" : "Sudoku",
    check: isEl ? "Έλεγχος" : "Check",
    newGame: isEl ? "Νέο παζλ" : "New Puzzle",
    correct: isEl ? "Σωστό!" : "Correct!",
    incomplete: isEl ? "Ελλιπές - συμπλήρωσε όλα τα κελιά" : "Incomplete - fill all cells",
    wrong: isEl ? "Λάθος - υπάρχουν σφάλματα" : "Wrong - there are errors",
    timer: isEl ? "Χρόνος" : "Time",
  };

  const initGame = useCallback(() => {
    const { puzzle, solved: sol } = generatePuzzle(35);
    setGrid(puzzle.map((row) => [...row]));
    setGiven(puzzle.map((row) => row.map((v) => v !== 0)));
    setSolved(sol);
    setSelected(null);
    setStatus("playing");
    setConflicts(new Set());
    setSeconds(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (status !== "playing") return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [status]);

  const updateConflicts = useCallback((g) => {
    const cf = new Set();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = g[r][c];
        if (!v) continue;
        for (let i = 0; i < 9; i++) {
          if (i !== c && g[r][i] === v) cf.add(`${r},${c}`);
          if (i !== r && g[i][c] === v) cf.add(`${r},${c}`);
        }
        const br = Math.floor(r / 3) * 3;
        const bc = Math.floor(c / 3) * 3;
        for (let rr = br; rr < br + 3; rr++)
          for (let cc = bc; cc < bc + 3; cc++)
            if ((rr !== r || cc !== c) && g[rr][cc] === v) cf.add(`${r},${c}`);
      }
    }
    setConflicts(cf);
  }, []);

  useEffect(() => {
    if (grid) updateConflicts(grid);
  }, [grid, updateConflicts]);

  const setCell = useCallback((r, c, val) => {
    setGrid((g) => {
      const next = g.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  }, []);

  const handleCellClick = useCallback((r, c) => {
    if (given?.[r]?.[c]) return;
    setSelected({ r, c });
  }, [given]);

  const handleNumClick = useCallback(
    (n) => {
      if (!selected || status !== "playing") return;
      const { r, c } = selected;
      if (given?.[r]?.[c]) return;
      setCell(r, c, n);
    },
    [selected, status, given, setCell]
  );

  const checkSolution = useCallback(() => {
    if (!grid || !solved) return;
    let filled = true;
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (!grid[r][c]) filled = false;

    if (!filled) {
      setStatus("incomplete");
      return;
    }

    const match = grid.every((row, r) =>
      row.every((v, c) => v === solved[r][c])
    );
    setStatus(match ? "correct" : "wrong");
  }, [grid, solved]);

  if (!grid || !given) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-600 dark:text-slate-400 font-medium">{T.timer}: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</span>
          <div className="flex gap-2">
            <button
              onClick={checkSolution}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition shadow-md"
            >
              {T.check}
            </button>
            <button
              onClick={initGame}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              {T.newGame}
            </button>
          </div>
        </div>

        {status !== "playing" && (
          <div
            className={`mb-4 p-4 rounded-xl font-semibold text-center ${
              status === "correct"
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
                : status === "wrong"
                ? "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
                : "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
            }`}
          >
            {status === "correct" && `✓ ${T.correct}`}
            {status === "incomplete" && T.incomplete}
            {status === "wrong" && `✗ ${T.wrong}`}
          </div>
        )}

        <div className="inline-block p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
          <div className="grid grid-cols-9 gap-0.5 sm:gap-1">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isGiven = given[r][c];
                const isSel = selected?.r === r && selected?.c === c;
                const hasConflict = conflicts.has(`${r},${c}`);
                const boxEdgeR = r % 3 === 0;
                const boxEdgeC = c % 3 === 0;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-bold rounded transition
                      ${boxEdgeR && r > 0 ? "border-t-2 border-slate-300 dark:border-slate-600" : ""}
                      ${boxEdgeC && c > 0 ? "border-l-2 border-slate-300 dark:border-slate-600" : ""}
                      ${isSel ? "bg-amber-400 dark:bg-amber-600 text-slate-900 ring-2 ring-amber-600 dark:ring-amber-400" : ""}
                      ${!isSel && hasConflict ? "bg-rose-200 dark:bg-rose-800 text-slate-900" : ""}
                      ${!isSel && !hasConflict ? "bg-slate-50 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600" : ""}
                      ${isGiven ? "font-extrabold text-slate-900 dark:text-slate-100" : ""}`}
                  >
                    {cell || ""}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleNumClick(n)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-amber-200 dark:hover:bg-amber-800 transition shadow"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
