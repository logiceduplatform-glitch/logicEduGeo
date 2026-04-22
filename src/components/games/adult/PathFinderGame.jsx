import React, { useState, useCallback, useRef, useEffect } from "react";

function recursiveBacktracker(rows, cols) {
  const grid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(1));
  const dirs = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  function carve(r, c) {
    grid[r][c] = 0;
    const shuffled = [...dirs].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of shuffled) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 1 && nr < rows - 1 && nc >= 1 && nc < cols - 1 && grid[nr][nc] === 1) {
        grid[(r + nr) / 2][(c + nc) / 2] = 0;
        carve(nr, nc);
      }
    }
  }

  grid[1][1] = 0;
  carve(1, 1);
  grid[0][1] = 0;
  grid[rows - 1][cols - 2] = 0;

  return grid;
}

const SIZES = [
  { rows: 8, cols: 8 },
  { rows: 10, cols: 10 },
  { rows: 12, cols: 12 },
];

export default function PathFinderGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [level, setLevel] = useState(0);
  const [maze, setMaze] = useState(() => recursiveBacktracker(SIZES[0].rows, SIZES[0].cols));
  const [pos, setPos] = useState({ r: 0, c: 1 });
  const [path, setPath] = useState([{ r: 0, c: 1 }]);
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (solved) return;
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [solved]);

  const rows = SIZES[level].rows;
  const cols = SIZES[level].cols;

  const getNeighbors = useCallback(
    (r, c) => {
      const n = [];
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] === 0) n.push({ r: nr, c: nc });
      });
      return n;
    },
    [maze, rows, cols]
  );

  const handleCellClick = useCallback(
    (r, c) => {
      if (solved) return;
      const neighbors = getNeighbors(pos.r, pos.c);
      const isAdjacent = neighbors.some((n) => n.r === r && n.c === c);
      if (!isAdjacent) return;

      const newPath = [...path, { r, c }];
      setPath(newPath);
      setPos({ r, c });

      if (r === rows - 1 && c === cols - 2) setSolved(true);
    },
    [pos, path, getNeighbors, solved, rows, cols]
  );

  const nextLevel = useCallback(() => {
    const next = Math.min(level + 1, SIZES.length - 1);
    const { rows: r, cols: c } = SIZES[next];
    setLevel(next);
    setMaze(recursiveBacktracker(r, c));
    setPos({ r: 0, c: 1 });
    setPath([{ r: 0, c: 1 }]);
    setSolved(false);
    setTimer(0);
  }, [level]);

  const restart = useCallback(() => {
    const { rows: r, cols: c } = SIZES[level];
    setMaze(recursiveBacktracker(r, c));
    setPos({ r: 0, c: 1 });
    setPath([{ r: 0, c: 1 }]);
    setSolved(false);
    setTimer(0);
  }, [level]);

  const T = {
    title: isEl ? "Εύρεση Δρόμου" : "Path Finder",
    level: isEl ? "Επίπεδο" : "Level",
    time: isEl ? "Χρόνος" : "Time",
    goal: isEl ? "Φτάσε από την αρχή (πάνω-αριστερά) στην έξοδο (κάτω-δεξιά)" : "Reach from start (top-left) to exit (bottom-right)",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    nextLevel: isEl ? "Επόμενο Επίπεδο" : "Next Level",
    solved: isEl ? "Συγχαρητήρια!" : "Congratulations!",
    moves: isEl ? "Κινήσεις" : "Moves",
  };

  const cellSize = Math.max(24, Math.min(48, 400 / Math.max(rows, cols)));
  const pathSet = new Set(path.map((p) => `${p.r},${p.c}`));

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-4">{T.goal}</p>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.level}</span>
            <span className="ml-2 font-bold text-teal-600 dark:text-teal-400">{level + 1}/3</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.time}</span>
            <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">{timer}s</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.moves}</span>
            <span className="ml-2 font-bold text-slate-600 dark:text-slate-400">{path.length}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6 mb-6 flex justify-center overflow-auto">
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            }}
          >
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const isStart = r === 0 && c === 1;
                const isEnd = r === rows - 1 && c === cols - 2;
                const isCurrent = pos.r === r && pos.c === c;
                const onPath = pathSet.has(`${r},${c}`);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    disabled={cell === 1 || solved}
                    className={`transition-all rounded-sm flex items-center justify-center text-xs font-bold ${
                      cell === 1
                        ? "bg-slate-800 dark:bg-slate-600 cursor-not-allowed"
                        : isCurrent
                        ? "bg-teal-400 dark:bg-teal-500 text-white"
                        : isStart
                        ? "bg-emerald-400 dark:bg-emerald-500 text-white"
                        : isEnd
                        ? "bg-rose-400 dark:bg-rose-500 text-white"
                        : onPath
                        ? "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                    }`}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {isStart && "S"}
                    {isEnd && "E"}
                    {isCurrent && !isStart && !isEnd && "●"}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {solved && (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center mb-6">
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{T.solved}</p>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {timer}s · {path.length} {isEl ? "κινήσεις" : "moves"}
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={restart}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-medium"
              >
                {T.playAgain}
              </button>
              {level < SIZES.length - 1 && (
                <button
                  onClick={nextLevel}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium"
                >
                  {T.nextLevel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
