import React, { useState, useCallback } from "react";

// Each puzzle: grid 4x4, right[r][c] between (r,c)-(r,c+1), down[r][c] between (r,c)-(r+1,c). > means left/top is greater.
const PUZZLES = [
  {
    grid: [
      [4, 0, 0, 0],
      [0, 0, 0, 4],
      [0, 0, 4, 0],
      [0, 0, 0, 0],
    ],
    right: [
      [">", ">", ">"],
      ["", "", "<"],
      ["", ">", ""],
      ["", "", ""],
    ],
    down: [
      ["", ">", "", ""],
      ["", "", "", "<"],
      ["", "", "", ""],
    ],
  },
  {
    grid: [
      [0, 2, 0, 0],
      [0, 0, 0, 1],
      [4, 0, 0, 0],
      [0, 0, 3, 0],
    ],
    right: [
      ["<", ">", ">"],
      ["", ">", "<"],
      ["", ">", ">"],
      ["", "<", ""],
    ],
    down: [
      ["", "", "", ""],
      ["", ">", "<", ""],
      ["", "", "", ""],
    ],
  },
  {
    grid: [
      [0, 0, 3, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 2],
      [0, 4, 0, 0],
    ],
    right: [
      ["<", ">", "<"],
      ["", "<", ">"],
      [">", "<", ""],
      ["", "", ">"],
    ],
    down: [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
  },
  {
    grid: [
      [0, 0, 0, 4],
      [0, 3, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ],
    right: [
      ["<", "<", ">"],
      ["", "", ">"],
      [">", "<", ">"],
      ["", "<", "<"],
    ],
    down: [
      ["", "", "", ""],
      [">", "", "", ""],
      ["", "", "<", ""],
    ],
  },
  {
    grid: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    right: [
      [">", "<", ">"],
      ["<", ">", "<"],
      [">", "<", ">"],
      ["<", ">", "<"],
    ],
    down: [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
  },
  {
    grid: [
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 4],
    ],
    right: [
      ["", ">", "<"],
      ["<", ">", ">"],
      [">", "<", ">"],
      ["<", "<", ""],
    ],
    down: [
      ["", "", "", ""],
      ["", "", ">", ""],
      ["", "<", "", ""],
    ],
  },
];

function checkConstraints(grid, right, down) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = grid[r][c];
      if (v === 0) return false;
      if (c < 3 && right[r][c]) {
        const vr = grid[r][c + 1];
        if (vr === 0) return false;
        if (right[r][c] === ">" && v <= vr) return false;
        if (right[r][c] === "<" && v >= vr) return false;
      }
      if (r < 3 && down[r][c]) {
        const vd = grid[r + 1][c];
        if (vd === 0) return false;
        if (down[r][c] === ">" && v <= vd) return false;
        if (down[r][c] === "<" && v >= vd) return false;
      }
    }
  }
  for (let r = 0; r < 4; r++) {
    const row = grid[r];
    if (new Set(row).size !== 4) return false;
  }
  for (let c = 0; c < 4; c++) {
    const col = grid.map((row) => row[c]);
    if (new Set(col).size !== 4) return false;
  }
  return true;
}

export default function NumberLogicGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [grid, setGrid] = useState(() => JSON.parse(JSON.stringify(PUZZLES[0].grid)));
  const [fixed, setFixed] = useState(() => {
    const f = Array(4)
      .fill(null)
      .map(() => Array(4).fill(false));
    PUZZLES[0].grid.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v !== 0) f[r][c] = true;
      })
    );
    return f;
  });
  const [solved, setSolved] = useState(false);

  const puzzle = PUZZLES[puzzleIndex];
  const { right, down } = puzzle;

  React.useEffect(() => {
    setGrid(JSON.parse(JSON.stringify(puzzle.grid)));
    const f = Array(4)
      .fill(null)
      .map(() => Array(4).fill(false));
    puzzle.grid.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v !== 0) f[r][c] = true;
      })
    );
    setFixed(f);
    setSolved(false);
  }, [puzzleIndex]);

  React.useEffect(() => {
    if (checkConstraints(grid, right, down)) setSolved(true);
  }, [grid, right, down]);

  const handleCellClick = useCallback(
    (r, c) => {
      if (fixed[r][c] || solved) return;
      setGrid((g) => {
        const next = g.map((row) => [...row]);
        next[r][c] = ((next[r][c] || 0) + 1) % 5;
        if (next[r][c] === 0) next[r][c] = 1;
        return next;
      });
    },
    [fixed, solved]
  );

  const nextPuzzle = useCallback(() => {
    setPuzzleIndex((i) => Math.min(i + 1, PUZZLES.length - 1));
    setSolved(false);
  }, []);

  const restart = useCallback(() => {
    setGrid(JSON.parse(JSON.stringify(puzzle.grid)));
    setSolved(false);
  }, [puzzle]);

  const T = {
    title: isEl ? "Αριθμολογική Λογική" : "Number Logic",
    puzzle: isEl ? "Πάζλ" : "Puzzle",
    rules: isEl
      ? "Βάλε 1–4 σε κάθε γραμμή και στήλη χωρίς επανάληψη. Τα σύμβολα > και < δείχνουν τη σχέση μεταξύ γειτονικών κελιών."
      : "Place 1–4 in each row and column without repeats. > and < show relations between adjacent cells.",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    nextPuzzle: isEl ? "Επόμενο Πάζλ" : "Next Puzzle",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-4">{T.rules}</p>
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.puzzle}</span>
            <span className="ml-2 font-bold text-cyan-600 dark:text-cyan-400">{puzzleIndex + 1}/6</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6 mb-6 flex justify-center overflow-auto">
          <div className="grid gap-0" style={{ gridTemplateColumns: "1fr 0.4fr 1fr 0.4fr 1fr 0.4fr 1fr", gridTemplateRows: "1fr 0.4fr 1fr 0.4fr 1fr 0.4fr 1fr", width: "260px" }}>
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <React.Fragment key={`${r}-${c}`}>
                  <button
                    onClick={() => handleCellClick(r, c)}
                    disabled={fixed[r][c] || solved}
                    className={`flex items-center justify-center text-xl font-bold rounded-lg border border-slate-200 dark:border-slate-600 ${
                      fixed[r][c]
                        ? "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-default"
                        : "bg-slate-50 dark:bg-slate-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-slate-800 dark:text-slate-200"
                    }`}
                    style={{
                      gridColumn: c * 2 + 1,
                      gridRow: r * 2 + 1,
                    }}
                  >
                    {grid[r][c] || ""}
                  </button>
                  {c < 3 && (
                    <div
                      className="flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm"
                      style={{ gridColumn: c * 2 + 2, gridRow: r * 2 + 1 }}
                    >
                      {right[r][c] || "·"}
                    </div>
                  )}
                  {r < 3 && (
                    <div
                      className="flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm"
                      style={{ gridColumn: c * 2 + 1, gridRow: r * 2 + 2 }}
                    >
                      {down[r][c] || "·"}
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
          {isEl ? "Κλικ για κύκλο αριθμών 1→2→3→4→1" : "Click to cycle 1→2→3→4→1"}
        </p>

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
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
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
