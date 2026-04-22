import React, { useState, useCallback, useMemo } from "react";

// 1 = filled, 0 = empty — 5x5 solutions
const PUZZLES = [
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  [
    [1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1],
    [0, 0, 1, 1, 1],
  ],
];

function lineHints(line) {
  const h = [];
  let run = 0;
  for (const v of line) {
    if (v === 1) run++;
    else if (run) {
      h.push(run);
      run = 0;
    }
  }
  if (run) h.push(run);
  return h.length ? h : [0];
}

function gridsMatch(player, solution) {
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) if (player[r][c] !== solution[r][c]) return false;
  return true;
}

export default function NonogramGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 5 }, () => Array(5).fill(-1))
  );
  const [solvedCount, setSolvedCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [msg, setMsg] = useState("");

  const solution = PUZZLES[puzzleIdx];
  const rowHintsList = useMemo(() => solution.map((row) => lineHints(row)), [solution]);
  const colHintsList = useMemo(() => {
    const cols = [];
    for (let c = 0; c < 5; c++) {
      const col = solution.map((row) => row[c]);
      cols.push(lineHints(col));
    }
    return cols;
  }, [solution]);

  const initGame = useCallback(() => {
    setPuzzleIdx(0);
    setGrid(Array.from({ length: 5 }, () => Array(5).fill(-1)));
    setSolvedCount(0);
    setLives(3);
    setGameOver(false);
    setMsg("");
  }, []);

  const toggleCell = (r, c) => {
    if (gameOver) return;
    setGrid((g) => {
      const next = g.map((row) => [...row]);
      next[r][c] = next[r][c] === -1 ? 1 : next[r][c] === 1 ? 0 : -1;
      return next;
    });
    setMsg("");
  };

  const checkSolution = () => {
    if (gameOver) return;
    let complete = true;
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 5; c++) if (grid[r][c] === -1) complete = false;
    if (!complete) {
      setMsg(isEl ? "Συμπληρώστε όλα τα κελιά (ή σημειώστε κενά)." : "Fill every cell (or mark empty).");
      return;
    }
    const player = grid.map((row) => row.map((v) => (v === 1 ? 1 : 0)));
    if (gridsMatch(player, solution)) {
      const nextSolved = solvedCount + 1;
      setSolvedCount(nextSolved);
      if (puzzleIdx >= PUZZLES.length - 1) {
        setGameOver(true);
        return;
      }
      setPuzzleIdx((i) => i + 1);
      setGrid(Array.from({ length: 5 }, () => Array(5).fill(-1)));
      setMsg(isEl ? "Σωστά! Επόμενο παζλ." : "Correct! Next puzzle.");
    } else {
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) setGameOver(true);
      else setMsg(isEl ? "Λάθος — δοκιμάστε ξανά." : "Wrong — try again.");
    }
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Νονόγραμμα" : "Nonogram"}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {isEl ? "Παζλ που λύθηκαν" : "Puzzles solved"}: {solvedCount}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
            {lives <= 0
              ? isEl
                ? "Τελειώσαν οι προσπάθειες."
                : "Out of lives."
              : isEl
                ? "Ολοκληρώσατε όλα τα παζλ!"
                : "You cleared all puzzles!"}
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
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Νονόγραμμα 5×5" : "Nonogram 5×5"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-4">
          {isEl
            ? `Παζλ ${puzzleIdx + 1}/${PUZZLES.length} · Ζωές: ${lives} · Λυμένα: ${solvedCount}`
            : `Puzzle ${puzzleIdx + 1}/${PUZZLES.length} · Lives: ${lives} · Solved: ${solvedCount}`}
        </p>
        {msg && (
          <p className="text-center text-amber-700 dark:text-amber-400 text-sm mb-3">{msg}</p>
        )}
        <div className="flex justify-center overflow-x-auto">
          <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: "auto repeat(5, 2.25rem)" }}>
            <div />
            {colHintsList.map((hints, c) => (
              <div
                key={c}
                className="flex flex-col items-center justify-end gap-0 text-[10px] font-mono text-slate-700 dark:text-slate-300 pb-1 min-h-[2.5rem]"
              >
                {hints.map((h, i) => (
                  <span key={i}>{h}</span>
                ))}
              </div>
            ))}
            {rowHintsList.map((hints, r) => (
              <React.Fragment key={r}>
                <div className="flex items-center justify-end pr-1 text-[10px] font-mono text-slate-700 dark:text-slate-300 w-10">
                  {hints.join(" ")}
                </div>
                {Array.from({ length: 5 }, (_, c) => {
                  const v = grid[r][c];
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => toggleCell(r, c)}
                      className={`w-9 h-9 border border-slate-300 dark:border-slate-600 rounded-sm text-xs font-bold transition ${
                        v === 1
                          ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                          : v === 0
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-500 line-through"
                            : "bg-white dark:bg-slate-800"
                      }`}
                      aria-label={`cell ${r + 1}-${c + 1}`}
                    >
                      {v === 0 ? "×" : ""}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-3">
          {isEl
            ? "Κλικ: κενό → γέμισμα → σταυρός (κενό). Έλεγχος όταν όλα συμπληρωθούν."
            : "Click: empty → fill → mark empty. Check when complete."}
        </p>
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={checkSolution}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {isEl ? "Έλεγχος λύσης" : "Check solution"}
          </button>
        </div>
      </div>
    </div>
  );
}
