import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const SIZE = 8;
const SHIPS = [
  { name: "Carrier", nameEl: "Αεροπλανοφόρο", size: 5, icon: "🚢" },
  { name: "Battleship", nameEl: "Θωρηκτό", size: 4, icon: "⚓" },
  { name: "Cruiser", nameEl: "Καταδρομικό", size: 3, icon: "🛥️" },
  { name: "Submarine", nameEl: "Υποβρύχιο", size: 2, icon: "🐟" },
  { name: "Patrol", nameEl: "Περιπολικό", size: 2, icon: "🚤" },
];

const EMPTY = 0, SHIP = 1, HIT = 2, MISS = 3, SUNK = 4;

function createGrid() {
  return Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));
}

function canPlace(grid, r, c, size, horizontal) {
  for (let i = 0; i < size; i++) {
    const nr = horizontal ? r : r + i;
    const nc = horizontal ? c + i : c;
    if (nr >= SIZE || nc >= SIZE || grid[nr][nc] !== EMPTY) return false;
  }
  return true;
}

function placeShip(grid, r, c, size, horizontal, shipIdx) {
  const ng = grid.map(row => [...row]);
  for (let i = 0; i < size; i++) {
    const nr = horizontal ? r : r + i;
    const nc = horizontal ? c + i : c;
    ng[nr][nc] = SHIP + shipIdx * 0.01;
  }
  return ng;
}

function autoPlace(grid) {
  let g = grid.map(r => [...r]);
  for (let s = 0; s < SHIPS.length; s++) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const horiz = Math.random() > 0.5;
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      const cleanGrid = g.map(row => row.map(v => v >= SHIP ? EMPTY : v));
      if (canPlace(cleanGrid, r, c, SHIPS[s].size, horiz)) {
        g = placeShip(g, r, c, SHIPS[s].size, horiz, s);
        placed = true;
      }
    }
  }
  return g;
}

function countShipCells(grid) {
  return grid.flat().filter(v => v >= SHIP && v < HIT).length;
}

export default function Battleship({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = { 1: isEl ? "Εσύ" : "You", 2: "AI" };

  const [playerGrid, setPlayerGrid] = useState(() => autoPlace(createGrid()));
  const [aiGrid, setAiGrid] = useState(() => autoPlace(createGrid()));
  const [playerShots, setPlayerShots] = useState(() => createGrid());
  const [aiShots, setAiShots] = useState(() => createGrid());
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState(isEl ? "Πάτα στο πλέγμα του αντιπάλου για να πυροβολήσεις!" : "Click on the enemy grid to fire!");
  const [playerHits, setPlayerHits] = useState(0);
  const [aiHits, setAiHits] = useState(0);
  const [shots, setShots] = useState(0);
  const [playerCanFire, setPlayerCanFire] = useState(true);

  const gameOver = winner !== null;
  const totalShipCells = SHIPS.reduce((s, sh) => s + sh.size, 0);

  const fireAt = useCallback((r, c) => {
    if (gameOver || turn !== 1 || !playerCanFire) return;
    if (playerShots[r][c] !== EMPTY) {
      setMessage(isEl ? "Ήδη πυροβόλησες εδώ!" : "Already fired here!");
      return;
    }

    const ns = playerShots.map(row => [...row]);
    const isHit = aiGrid[r][c] >= SHIP && aiGrid[r][c] < HIT;
    ns[r][c] = isHit ? HIT : MISS;
    setPlayerShots(ns);
    setShots(prev => prev + 1);

    const newHits = playerHits + (isHit ? 1 : 0);
    setPlayerHits(newHits);

    if (isHit) {
      setMessage(isEl ? "Ευστοχία! 💥" : "Hit! 💥");
      if (newHits >= totalShipCells) { setWinner(1); setPlayerCanFire(true); return; }
    } else {
      setMessage(isEl ? "Στον αέρα! 💨" : "Miss! 💨");
    }

    setPlayerCanFire(false);
    // AI fires back
    setTimeout(() => {
      let ar, ac;
      do {
        ar = Math.floor(Math.random() * SIZE);
        ac = Math.floor(Math.random() * SIZE);
      } while (aiShots[ar][ac] !== EMPTY);

      const nas = aiShots.map(row => [...row]);
      const aiHit = playerGrid[ar][ac] >= SHIP && playerGrid[ar][ac] < HIT;
      nas[ar][ac] = aiHit ? HIT : MISS;
      setAiShots(nas);

      const newAiHits = aiHits + (aiHit ? 1 : 0);
      setAiHits(newAiHits);

      if (aiHit) {
        setMessage(prev => prev + ` | AI: ${isEl ? "Ευστοχία!" : "Hit!"} 💥`);
        if (newAiHits >= totalShipCells) { setWinner(2); setPlayerCanFire(true); return; }
      } else {
        setMessage(prev => prev + ` | AI: ${isEl ? "Αστοχία" : "Miss"} 💨`);
      }
      setPlayerCanFire(true);
    }, 500);
  }, [gameOver, turn, playerCanFire, playerShots, aiGrid, aiShots, playerGrid, playerHits, aiHits, totalShipCells, isEl]);

  const reset = useCallback(() => {
    setPlayerGrid(autoPlace(createGrid())); setAiGrid(autoPlace(createGrid()));
    setPlayerShots(createGrid()); setAiShots(createGrid());
    setTurn(1); setWinner(null); setPlayerHits(0); setAiHits(0); setShots(0);
    setPlayerCanFire(true);
    setMessage(isEl ? "Πάτα στο πλέγμα του αντιπάλου για να πυροβολήσεις!" : "Click on the enemy grid to fire!");
    onPlayAgain?.();
  }, [isEl, onPlayAgain]);

  const renderGrid = (grid, shots, isEnemy, onClick) => (
    <div className="grid gap-0.5 sm:gap-1 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 backdrop-blur-sm p-1 sm:p-2" style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(2rem, 1fr))` }}>
      {Array.from({ length: SIZE * SIZE }, (_, i) => {
        const r = Math.floor(i / SIZE), c = i % SIZE;
        const cell = grid[r][c];
        const shot = shots[r][c];
        const hasShip = cell >= SHIP && cell < HIT;
        return (
          <button key={i} onClick={() => onClick?.(r, c)}
            className={[
              "aspect-square min-w-[2rem] min-h-[2rem] flex items-center justify-center text-sm sm:text-base transition-all",
              shot === HIT ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xl shadow-red-900/40"
                : shot === MISS ? "bg-white/10 text-slate-400"
                : !isEnemy && hasShip ? "bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-xl shadow-sky-900/40"
                : "bg-white/5 hover:bg-white/10 border border-white/5",
            ].join(" ")}>
            {shot === HIT && "💥"}
            {shot === MISS && "·"}
            {shot === EMPTY && !isEnemy && hasShip && "▪"}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title={isEl ? "Ναυμαχία" : "Battleship"} turn={null} playerNames={playerNames}
          scores={{ 1: playerHits, 2: aiHits }}
          status={`${isEl ? "Πυρά" : "Shots"}: ${shots}`} />

        <div className="p-4 sm:p-6 space-y-4 bg-white/5 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Enemy grid */}
            <div>
              <p className="text-xs font-bold text-rose-400 uppercase mb-2 text-center">
                {isEl ? "Εχθρικά νερά" : "Enemy Waters"} 🎯
              </p>
              {renderGrid(aiGrid, playerShots, true, fireAt)}
            </div>

            {/* Player grid */}
            <div>
              <p className="text-xs font-bold text-sky-400 uppercase mb-2 text-center">
                {isEl ? "Τα πλοία σου" : "Your Fleet"} ⚓
              </p>
              {renderGrid(playerGrid, aiShots, false, null)}
            </div>
          </div>

          {/* Ship legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            {SHIPS.map(sh => (
              <span key={sh.name} className="text-[10px] px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300">
                {sh.icon} {isEl ? sh.nameEl : sh.name} ({sh.size})
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-3 justify-center text-sm font-semibold">
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-emerald-300">
              🎯 {playerHits}/{totalShipCells}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-rose-400">
              🤖 {aiHits}/{totalShipCells}
            </span>
          </div>

          {message && <p className="text-center text-sm text-slate-400 font-medium">{message}</p>}
        </div>
      </div>

      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{
          [isEl ? "Βολές" : "Shots"]: shots,
          [isEl ? "Ευστοχίες" : "Hits"]: playerHits,
          [isEl ? "Ακρίβεια" : "Accuracy"]: shots > 0 ? `${Math.round(playerHits / shots * 100)}%` : "0%",
        }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
