import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COLS = 10;
const ROWS = 20;
const STORAGE_BEST = "kibloo:tetris:best";

// Each piece is a list of rotations; each rotation is a list of [x,y] offsets
const PIECES = {
  I: { color: "bg-cyan-400",   rot: [[[0,1],[1,1],[2,1],[3,1]], [[2,0],[2,1],[2,2],[2,3]]] },
  O: { color: "bg-yellow-400", rot: [[[0,0],[1,0],[0,1],[1,1]]] },
  T: { color: "bg-purple-500", rot: [[[1,0],[0,1],[1,1],[2,1]], [[1,0],[1,1],[2,1],[1,2]], [[0,1],[1,1],[2,1],[1,2]], [[1,0],[0,1],[1,1],[1,2]]] },
  S: { color: "bg-emerald-500", rot: [[[1,0],[2,0],[0,1],[1,1]], [[1,0],[1,1],[2,1],[2,2]]] },
  Z: { color: "bg-rose-500",   rot: [[[0,0],[1,0],[1,1],[2,1]], [[2,0],[1,1],[2,1],[1,2]]] },
  J: { color: "bg-blue-500",   rot: [[[0,0],[0,1],[1,1],[2,1]], [[1,0],[2,0],[1,1],[1,2]], [[0,1],[1,1],[2,1],[2,2]], [[1,0],[1,1],[0,2],[1,2]]] },
  L: { color: "bg-orange-500", rot: [[[2,0],[0,1],[1,1],[2,1]], [[1,0],[1,1],[1,2],[2,2]], [[0,1],[1,1],[2,1],[0,2]], [[0,0],[1,0],[1,1],[1,2]]] },
};

const KEYS = Object.keys(PIECES);

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(""));
}

function newPiece() {
  const k = KEYS[Math.floor(Math.random() * KEYS.length)];
  return { type: k, rot: 0, x: 3, y: 0 };
}

function cellsOf(p) {
  const { rot, x, y, type } = p;
  return PIECES[type].rot[rot % PIECES[type].rot.length].map(([dx, dy]) => [x + dx, y + dy]);
}

function valid(board, p) {
  return cellsOf(p).every(([x, y]) =>
    x >= 0 && x < COLS && y < ROWS && (y < 0 || !board[y][x])
  );
}

function lock(board, p) {
  const next = board.map((r) => [...r]);
  cellsOf(p).forEach(([x, y]) => {
    if (y >= 0) next[y][x] = PIECES[p.type].color;
  });
  return next;
}

function clearLines(board) {
  const next = board.filter((row) => row.some((c) => c === ""));
  const cleared = ROWS - next.length;
  while (next.length < ROWS) next.unshift(Array(COLS).fill(""));
  return { board: next, cleared };
}

const T = {
  el: { title: "Tetris", desc: "Στοίβαξε γραμμές για πόντους!", score: "Σκορ", best: "Ρεκόρ", lines: "Γραμμές", over: "Game over!", restart: "Νέο", paused: "Παύση" },
  en: { title: "Tetris", desc: "Stack rows to clear lines!", score: "Score", best: "Best", lines: "Lines", over: "Game over!", restart: "New", paused: "Paused" },
};

export default function TetrisPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [board, setBoard] = useState(emptyBoard);
  const [piece, setPiece] = useState(newPiece);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem(STORAGE_BEST) || "0", 10));
  const pieceRef = useRef(piece);
  const boardRef = useRef(board);

  useEffect(() => { pieceRef.current = piece; }, [piece]);
  useEffect(() => { boardRef.current = board; }, [board]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setPiece(newPiece());
    setOver(false);
    setScore(0);
    setLines(0);
  }, []);

  const tryMove = useCallback((dx, dy, drot = 0) => {
    const p = pieceRef.current;
    const next = { ...p, x: p.x + dx, y: p.y + dy, rot: p.rot + drot };
    if (valid(boardRef.current, next)) {
      setPiece(next);
      return true;
    }
    return false;
  }, []);

  const drop = useCallback(() => {
    if (tryMove(0, 1)) return;
    // Lock piece
    const locked = lock(boardRef.current, pieceRef.current);
    const { board: cleaned, cleared } = clearLines(locked);
    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800][cleared] || 800;
      setScore((s) => {
        const next = s + points;
        if (next > best) {
          setBest(next);
          try { localStorage.setItem(STORAGE_BEST, String(next)); } catch { /* */ }
        }
        return next;
      });
      setLines((n) => n + cleared);
    }
    setBoard(cleaned);
    const np = newPiece();
    if (!valid(cleaned, np)) setOver(true);
    else setPiece(np);
  }, [tryMove, best]);

  const hardDrop = useCallback(() => {
    let p = pieceRef.current;
    while (valid(boardRef.current, { ...p, y: p.y + 1 })) p = { ...p, y: p.y + 1 };
    setPiece(p);
    setTimeout(drop, 0);
  }, [drop]);

  // Tick
  useEffect(() => {
    if (over || paused) return;
    const interval = Math.max(120, 600 - lines * 10);
    const id = setInterval(() => drop(), interval);
    return () => clearInterval(id);
  }, [over, paused, lines, drop]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (over) return;
      if (e.key === "ArrowLeft") tryMove(-1, 0);
      else if (e.key === "ArrowRight") tryMove(1, 0);
      else if (e.key === "ArrowDown") tryMove(0, 1);
      else if (e.key === "ArrowUp") tryMove(0, 0, 1);
      else if (e.key === " ") { e.preventDefault(); hardDrop(); }
      else if (e.key === "p" || e.key === "P") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryMove, hardDrop, over]);

  const renderBoard = () => {
    const b = board.map((r) => [...r]);
    if (!over) {
      cellsOf(piece).forEach(([x, y]) => {
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) b[y][x] = PIECES[piece.type].color;
      });
    }
    return b;
  };

  const display = renderBoard();

  return (
    <GameShell title={l.title} description={l.desc} emoji="🟦" canonical="/games/tetris">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2 flex-wrap">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase text-slate-500">{l.score}</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{score}</div>
          </div>
          <div className="bg-amber-200 dark:bg-amber-800 rounded-lg px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase text-amber-700 dark:text-amber-300">{l.best}</div>
            <div className="font-bold text-amber-900 dark:text-amber-100">{best}</div>
          </div>
          <div className="bg-emerald-200 dark:bg-emerald-800 rounded-lg px-3 py-1.5 text-center">
            <div className="text-[10px] uppercase text-emerald-700 dark:text-emerald-300">{l.lines}</div>
            <div className="font-bold text-emerald-900 dark:text-emerald-100">{lines}</div>
          </div>
        </div>
        <button onClick={reset} className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm">{l.restart}</button>
      </div>

      <div className="bg-slate-900 rounded-xl p-2 mx-auto" style={{ width: "min(100%, 320px)" }}>
        <div className="grid gap-px bg-slate-800" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, aspectRatio: `${COLS}/${ROWS}` }}>
          {display.flat().map((c, i) => (
            <div key={i} className={c || "bg-slate-900"} />
          ))}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-5 gap-2 mt-4 max-w-[320px] mx-auto sm:hidden">
        <button onClick={() => tryMove(-1, 0)} className="bg-slate-200 dark:bg-slate-700 rounded p-3 font-bold">←</button>
        <button onClick={() => tryMove(0, 0, 1)} className="bg-slate-200 dark:bg-slate-700 rounded p-3 font-bold">↻</button>
        <button onClick={() => tryMove(0, 1)} className="bg-slate-200 dark:bg-slate-700 rounded p-3 font-bold">↓</button>
        <button onClick={() => tryMove(1, 0)} className="bg-slate-200 dark:bg-slate-700 rounded p-3 font-bold">→</button>
        <button onClick={hardDrop} className="bg-purple-600 text-white rounded p-3 font-bold">⤓</button>
      </div>

      {(paused || over) && (
        <div className="mt-3 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
          {over ? `💀 ${l.over}` : `⏸ ${l.paused}`}
        </div>
      )}
    </GameShell>
  );
}
