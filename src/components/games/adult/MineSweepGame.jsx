import React, { useState, useCallback, useMemo } from "react";

const SIZE = 6;
const MINES = 6;

function countNeighbors(mines, r, c) {
  let n = 0;
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && mines.has(`${nr},${nc}`)) n++;
    }
  return n;
}

function placeMines(safeR, safeC) {
  const set = new Set();
  while (set.size < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (r === safeR && c === safeC) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    set.add(`${r},${c}`);
  }
  return set;
}

export default function MineSweepGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [mines, setMines] = useState(null);
  const [revealed, setRevealed] = useState(() => new Set());
  const [flagged, setFlagged] = useState(() => new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const initGame = useCallback(() => {
    setMines(null);
    setRevealed(new Set());
    setFlagged(new Set());
    setGameOver(false);
    setWon(false);
  }, []);

  const safeLeft = useMemo(() => {
    if (!mines) return SIZE * SIZE - MINES;
    let cnt = 0;
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const k = `${r},${c}`;
        if (!mines.has(k) && !revealed.has(k)) cnt++;
      }
    return cnt;
  }, [mines, revealed]);

  const reveal = (r, c) => {
    if (gameOver || flagged.has(`${r},${c}`)) return;
    let m = mines;
    if (!m) {
      m = placeMines(r, c);
      setMines(m);
    }
    const k = `${r},${c}`;
    if (revealed.has(k)) return;
    if (m.has(k)) {
      setGameOver(true);
      setWon(false);
      return;
    }
    const flood = (rr, cc, seen) => {
      const key = `${rr},${cc}`;
      if (seen.has(key)) return;
      if (rr < 0 || rr >= SIZE || cc < 0 || cc >= SIZE) return;
      if (m.has(key)) return;
      seen.add(key);
      const n = countNeighbors(m, rr, cc);
      if (n === 0) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            flood(rr + dr, cc + dc, seen);
          }
      }
    };
    const next = new Set(revealed);
    flood(r, c, next);
    setRevealed(next);
    if (next.size === SIZE * SIZE - MINES) {
      setWon(true);
      setGameOver(true);
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || revealed.has(`${r},${c}`)) return;
    const k = `${r},${c}`;
    setFlagged((f) => {
      const n = new Set(f);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  };

  if (gameOver) {
    const score = won ? 1 : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ναρκαλιευτής" : "Minesweeper"}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {won
              ? isEl
                ? "Νίκη! Αποκαλύψατε όλα τα ασφαλή κελιά."
                : "You cleared all safe cells!"
              : isEl
                ? "Χτυπήσατε νάρκη!"
                : "You hit a mine!"}{" "}
            {isEl ? "Σκορ νίκης" : "Win score"}: {score}
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

  const m = mines;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Ναρκαλιευτής 6×6" : "Minesweeper 6×6"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-4">
          {isEl
            ? `Νάρκες: ${MINES} · Υπόλοιπο ασφαλή: ${m ? safeLeft : "—"} · Δεξί κλικ: σημαία`
            : `Mines: ${MINES} · Safe cells left: ${m ? safeLeft : "—"} · Right-click: flag`}
        </p>
        <div
          className="grid gap-0.5 mx-auto w-fit"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 2.5rem))` }}
        >
          {Array.from({ length: SIZE }, (_, r) =>
            Array.from({ length: SIZE }, (_, c) => {
              const k = `${r},${c}`;
              const isRev = revealed.has(k);
              const isMine = m && m.has(k);
              const n = m && isRev && !isMine ? countNeighbors(m, r, c) : 0;
              const isFlag = flagged.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => reveal(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`w-10 h-10 text-sm font-bold rounded border flex items-center justify-center transition ${
                    isRev
                      ? isMine
                        ? "bg-rose-600 text-white border-rose-800"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-400"
                      : isFlag
                        ? "bg-amber-200 dark:bg-amber-900/50 border-amber-500"
                        : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 border-slate-500"
                  }`}
                >
                  {!isRev && isFlag ? "🚩" : isRev && isMine ? "💥" : isRev && n > 0 ? n : ""}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
