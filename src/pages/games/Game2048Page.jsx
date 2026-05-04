import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const SIZE = 4;
const STORAGE_BEST = "kibloo:2048:best";

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function clone(b) { return b.map((r) => [...r]); }

function spawn(board) {
  const empties = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!board[r][c]) empties.push([r, c]);
  if (empties.length === 0) return board;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function slideRowLeft(row) {
  const filtered = row.filter((v) => v !== 0);
  let gained = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      gained += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  const cleaned = filtered.filter((v) => v !== 0);
  while (cleaned.length < SIZE) cleaned.push(0);
  return { row: cleaned, gained };
}

function rotateCW(b) {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) out[c][SIZE - 1 - r] = b[r][c];
  return out;
}

function move(board, dir) {
  let working = clone(board);
  // Rotate so that the move becomes a "left" slide
  const rotations = { left: 0, up: 3, right: 2, down: 1 }[dir];
  for (let i = 0; i < rotations; i++) working = rotateCW(working);

  let totalGain = 0;
  let changed = false;
  for (let r = 0; r < SIZE; r++) {
    const before = [...working[r]];
    const { row, gained } = slideRowLeft(working[r]);
    working[r] = row;
    totalGain += gained;
    if (before.some((v, i) => v !== row[i])) changed = true;
  }

  // Rotate back
  const back = (4 - rotations) % 4;
  for (let i = 0; i < back; i++) working = rotateCW(working);

  return { board: working, gained: totalGain, changed };
}

function canMove(board) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (board[r][c] === 0) return true;
    if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return true;
    if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return true;
  }
  return false;
}

const TILE_COLORS = {
  0:    "bg-slate-200 dark:bg-slate-700/40",
  2:    "bg-amber-100 text-amber-900",
  4:    "bg-amber-200 text-amber-900",
  8:    "bg-orange-300 text-white",
  16:   "bg-orange-400 text-white",
  32:   "bg-orange-500 text-white",
  64:   "bg-rose-500 text-white",
  128:  "bg-yellow-400 text-white",
  256:  "bg-yellow-500 text-white",
  512:  "bg-emerald-500 text-white",
  1024: "bg-emerald-600 text-white text-xl",
  2048: "bg-purple-600 text-white",
};

const T = {
  el: { title: "2048", desc: "Σύρε για να συγχωνεύσεις πλακίδια. Φτάσε στο 2048!", score: "Σκορ", best: "Ρεκόρ", restart: "Νέο", over: "Game over!", win: "Έφτασες στο 2048! 🎉", continue: "Συνέχισε" },
  en: { title: "2048", desc: "Swipe to merge tiles. Reach 2048!", score: "Score", best: "Best", restart: "New", over: "Game over!", win: "You reached 2048! 🎉", continue: "Continue" },
};

export default function Game2048Page() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [board, setBoard] = useState(() => spawn(spawn(emptyBoard())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10));
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [acked, setAcked] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      try { localStorage.setItem(STORAGE_BEST, String(score)); } catch { /* */ }
    }
  }, [score, best]);

  const reset = useCallback(() => {
    setBoard(spawn(spawn(emptyBoard())));
    setScore(0);
    setOver(false);
    setWon(false);
    setAcked(false);
  }, []);

  const handleMove = useCallback((dir) => {
    if (over || (won && !acked)) return;
    const { board: next, gained, changed } = move(board, dir);
    if (!changed) return;
    spawn(next);
    setBoard(next);
    setScore((s) => s + gained);
    if (!won && next.flat().includes(2048)) setWon(true);
    if (!canMove(next)) setOver(true);
  }, [board, over, won, acked]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key]) {
        e.preventDefault();
        handleMove(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  // Touch swipe
  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? "right" : "left");
    else handleMove(dy > 0 ? "down" : "up");
    touchStart.current = null;
  };

  return (
    <GameShell title={l.title} description={l.desc} emoji="🔢" canonical="/games/2048">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-1.5 text-center min-w-[70px]">
            <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{l.score}</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{score}</div>
          </div>
          <div className="bg-amber-200 dark:bg-amber-800 rounded-lg px-3 py-1.5 text-center min-w-[70px]">
            <div className="text-[10px] uppercase text-amber-700 dark:text-amber-300">{l.best}</div>
            <div className="font-bold text-amber-900 dark:text-amber-100">{best}</div>
          </div>
        </div>
        <button onClick={reset} className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm">{l.restart}</button>
      </div>

      <div
        className="bg-slate-300 dark:bg-slate-700 rounded-xl p-2 sm:p-3 select-none touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {board.flat().map((v, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-extrabold transition-all ${TILE_COLORS[v] || "bg-purple-700 text-white text-lg"}`}
            >
              {v || ""}
            </div>
          ))}
        </div>
      </div>

      {/* On-screen arrows for desktop */}
      <div className="grid grid-cols-3 gap-2 mt-4 max-w-[180px] mx-auto sm:hidden">
        <div /><button onClick={() => handleMove("up")} className="bg-slate-200 dark:bg-slate-700 rounded-lg p-3 font-bold">↑</button><div />
        <button onClick={() => handleMove("left")} className="bg-slate-200 dark:bg-slate-700 rounded-lg p-3 font-bold">←</button>
        <div />
        <button onClick={() => handleMove("right")} className="bg-slate-200 dark:bg-slate-700 rounded-lg p-3 font-bold">→</button>
        <div /><button onClick={() => handleMove("down")} className="bg-slate-200 dark:bg-slate-700 rounded-lg p-3 font-bold">↓</button><div />
      </div>

      {won && !acked && (
        <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-center">
          <div className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">{l.win}</div>
          <button onClick={() => setAcked(true)} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-sm">{l.continue}</button>
        </div>
      )}

      {over && (
        <div className="mt-4 p-3 bg-rose-100 dark:bg-rose-900/40 rounded-xl text-center">
          <div className="font-bold text-rose-800 dark:text-rose-200 mb-2">{l.over}</div>
          <button onClick={reset} className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-sm">{l.restart}</button>
        </div>
      )}
    </GameShell>
  );
}
