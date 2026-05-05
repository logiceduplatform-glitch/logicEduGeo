import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useGameRewards } from "../../hooks/useGameRewards";

/**
 * Sudoku Mini — a friendly 4×4 sudoku for kids and beginners.
 * Each row, column and 2×2 box must contain digits 1-4.
 */

const SIZE = 4;
const BOX = 2;
const STORAGE_BEST = "kibloo:sudokumini:bestSeconds";

const T = {
  el: {
    title: "Sudoku Mini (4×4)",
    desc: "Συμπλήρωσε το πλέγμα 4×4 με αριθμούς 1-4. Κάθε γραμμή, στήλη και μικρό κουτί 2×2 πρέπει να έχει όλους τους αριθμούς.",
    timer: "Χρόνος",
    best: "Καλύτερο",
    restart: "Νέο παζλ",
    win: "Νίκησες!",
    winInTime: "Επίλυση σε {n}",
    difficulty: "Δυσκολία",
    easy: "Εύκολο",
    medium: "Μεσαίο",
    hard: "Δύσκολο",
    erase: "Σβήσε",
    invalidMove: "Λάθος! Ο αριθμός υπάρχει ήδη.",
  },
  en: {
    title: "Sudoku Mini (4×4)",
    desc: "Fill the 4×4 grid with digits 1-4. Each row, column and small 2×2 box must contain all four.",
    timer: "Time",
    best: "Best",
    restart: "New puzzle",
    win: "You won!",
    winInTime: "Solved in {n}",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    erase: "Erase",
    invalidMove: "Invalid! That number already exists.",
  },
};

// 3 hand-picked solved 4×4 boards. We rotate them for variety.
const SOLVED = [
  [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ],
  [
    [4, 1, 2, 3],
    [2, 3, 4, 1],
    [3, 4, 1, 2],
    [1, 2, 3, 4],
  ],
  [
    [2, 3, 1, 4],
    [4, 1, 3, 2],
    [1, 2, 4, 3],
    [3, 4, 2, 1],
  ],
];

function clone(b) { return b.map((r) => [...r]); }

function makePuzzle(difficulty) {
  const solved = clone(SOLVED[Math.floor(Math.random() * SOLVED.length)]);
  // Apply random row swaps within bands and column swaps within stacks → still valid.
  const swap = (b, type, a, c) => {
    if (type === "row") [b[a], b[c]] = [b[c], b[a]];
    else for (const r of b) [r[a], r[c]] = [r[c], r[a]];
  };
  for (let i = 0; i < 4; i++) {
    const band = Math.floor(Math.random() * 2) * 2;
    const x = band, y = band + 1;
    if (Math.random() < 0.5) swap(solved, "row", x, y);
    else swap(solved, "col", x, y);
  }
  // Hide cells based on difficulty
  const hidden = { easy: 5, medium: 8, hard: 11 }[difficulty] || 8;
  const positions = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) positions.push([r, c]);
  positions.sort(() => Math.random() - 0.5);
  const puzzle = clone(solved);
  for (let i = 0; i < hidden; i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = 0;
  }
  return { puzzle, solved };
}

function isWin(board, solved) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (board[r][c] !== solved[r][c]) return false;
  }
  return true;
}

/** Returns true if placing `n` at (r,c) does NOT clash with existing values. */
function isValidMove(board, r, c, n) {
  for (let i = 0; i < SIZE; i++) {
    if (i !== c && board[r][i] === n) return false;
    if (i !== r && board[i][c] === n) return false;
  }
  const br = Math.floor(r / BOX) * BOX;
  const bc = Math.floor(c / BOX) * BOX;
  for (let i = br; i < br + BOX; i++) for (let j = bc; j < bc + BOX; j++) {
    if ((i !== r || j !== c) && board[i][j] === n) return false;
  }
  return true;
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function SudokuMiniPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const rewards = useGameRewards("sudokumini");

  const [difficulty, setDifficulty] = useState("medium");
  const [{ puzzle, solved }, setData] = useState(() => makePuzzle("medium"));
  const [board, setBoard] = useState(() => clone(puzzle));
  const [selected, setSelected] = useState(null); // [r,c] | null
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState(() => {
    const raw = parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10);
    return raw > 0 ? raw : null;
  });
  const startedAt = useRef(Date.now());

  const won = useMemo(() => isWin(board, solved), [board, solved]);

  // Tick seconds (paused on win)
  useEffect(() => {
    if (won) return;
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [won]);

  // Best on win
  useEffect(() => {
    if (!won) return;
    rewards.complete(100, 100);
    rewards.award(15, "Sudoku solved");
    if (best === null || seconds < best) {
      setBest(seconds);
      try { localStorage.setItem(STORAGE_BEST, String(seconds)); } catch { /* noop */ }
      rewards.milestone("new_best", seconds);
    }
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = useCallback((diff = difficulty) => {
    const next = makePuzzle(diff);
    setData(next);
    setBoard(clone(next.puzzle));
    setSelected(null);
    setError(null);
    setSeconds(0);
    startedAt.current = Date.now();
  }, [difficulty]);

  const place = (n) => {
    if (!selected || won) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return; // locked clue
    if (n !== 0 && !isValidMove(board, r, c, n)) {
      setError(l.invalidMove);
      setTimeout(() => setError(null), 1200);
      return;
    }
    const next = clone(board);
    next[r][c] = n;
    setBoard(next);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "1" && e.key <= "4") place(parseInt(e.key, 10));
      if (e.key === "0" || e.key === "Backspace" || e.key === "Delete") place(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, board, won]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeDifficulty = (d) => { setDifficulty(d); restart(d); };

  return (
    <GameShell title={l.title} description={l.desc}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{l.timer}: </span>
            <span className="font-extrabold tabular-nums text-purple-600 dark:text-purple-400">{fmtTime(seconds)}</span>
          </div>
          {best !== null && (
            <div className="text-sm">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{l.best}: </span>
              <span className="font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">{fmtTime(best)}</span>
            </div>
          )}
          <button
            onClick={() => restart()}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow"
          >
            {l.restart}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mb-4 text-xs">
          <span className="text-slate-500 dark:text-slate-400 mr-1">{l.difficulty}:</span>
          {[
            { id: "easy", label: l.easy },
            { id: "medium", label: l.medium },
            { id: "hard", label: l.hard },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onChangeDifficulty(d.id)}
              className={`px-2 py-1 rounded-md font-bold transition ${
                difficulty === d.id
                  ? "bg-purple-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div
          role="grid"
          aria-label={l.title}
          className="mx-auto w-fit p-2 rounded-2xl bg-slate-200 dark:bg-slate-900 grid gap-0"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0,1fr))` }}
        >
          {board.flatMap((row, r) =>
            row.map((v, c) => {
              const isSelected = selected && selected[0] === r && selected[1] === c;
              const isClue = puzzle[r][c] !== 0;
              // Box borders
              const borderTop = r % BOX === 0 ? "border-t-2" : "border-t";
              const borderLeft = c % BOX === 0 ? "border-l-2" : "border-l";
              const borderRight = c === SIZE - 1 ? "border-r-2" : "";
              const borderBottom = r === SIZE - 1 ? "border-b-2" : "";
              return (
                <button
                  key={`${r}_${c}`}
                  role="gridcell"
                  aria-selected={isSelected}
                  aria-label={`${r + 1},${c + 1} ${v || "empty"}`}
                  onClick={() => setSelected([r, c])}
                  className={`w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${borderTop} ${borderLeft} ${borderRight} ${borderBottom} border-slate-400 dark:border-slate-600 ${
                    isClue
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-default"
                      : isSelected
                        ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500"
                        : "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-600"
                  }`}
                  disabled={isClue}
                >
                  {v || ""}
                </button>
              );
            })
          )}
        </div>

        {error && (
          <p className="mt-3 text-center text-sm font-semibold text-rose-600 dark:text-rose-400 animate-shake">
            {error}
          </p>
        )}

        <div className="mt-4 grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => place(n)}
              className="aspect-square rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-2xl font-extrabold shadow active:scale-95 transition"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => place(0)}
            aria-label={l.erase}
            className="aspect-square rounded-xl bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-2xl font-extrabold shadow active:scale-95 transition"
          >
            ⌫
          </button>
        </div>

        {won && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-center shadow-lg">
            <p className="text-lg font-extrabold">🎉 {l.win}</p>
            <p className="text-sm opacity-90 mt-1">{l.winInTime.replace("{n}", fmtTime(seconds))}</p>
            <button
              onClick={() => restart()}
              className="mt-3 px-4 py-2 rounded-lg bg-white text-emerald-700 font-bold text-sm hover:scale-105 transition"
            >
              {l.restart}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
