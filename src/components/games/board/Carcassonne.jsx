import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const TILE_TYPES = [
  { id: "road", icon: "🛤️", sides: ["road","field","road","field"], points: 1 },
  { id: "city", icon: "🏰", sides: ["city","city","field","field"], points: 2 },
  { id: "monastery", icon: "⛪", sides: ["field","field","field","field"], points: 3 },
  { id: "crossroad", icon: "✚", sides: ["road","road","road","road"], points: 1 },
  { id: "fortress", icon: "🏯", sides: ["city","city","city","field"], points: 3 },
  { id: "bridge", icon: "🌉", sides: ["road","field","road","city"], points: 2 },
];

const GRID = 5;
function initGrid() { return Array.from({length: GRID}, () => new Array(GRID).fill(null)); }

function drawTile() { return { ...TILE_TYPES[Math.floor(Math.random()*TILE_TYPES.length)], rotation: 0 }; }

export default function Carcassonne({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Παίκτης 1" : "Player 1", 2: isEl ? "Παίκτης 2" : "Player 2" };

  const [grid, setGrid] = useState(() => { const g = initGrid(); g[2][2] = { ...drawTile(), owner: 0 }; return g; });
  const [currentTile, setCurrentTile] = useState(drawTile);
  const [meeples, setMeeples] = useState({ 1: 7, 2: 7 });
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [turn, setTurn] = useState(1);
  const [tilesLeft, setTilesLeft] = useState(20);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState(isEl ? "Τοποθέτησε πλακίδιο!" : "Place a tile!");

  const gameOver = winner !== null;

  const canInteract = !gameOver && (mode === "local" || turn === 1);

  const placeTile = useCallback((r, c) => {
    if (gameOver || grid[r][c] || !canInteract) return;
    const hasNeighbor = [[-1,0],[1,0],[0,-1],[0,1]].some(([dr,dc]) => {
      const nr = r+dr, nc = c+dc;
      return nr>=0 && nr<GRID && nc>=0 && nc<GRID && grid[nr][nc];
    });
    if (!hasNeighbor) { setMessage(isEl ? "Πρέπει να είναι δίπλα σε άλλο!" : "Must be adjacent!"); return; }

    const currentPlayer = turn;
    const newGrid = grid.map(row => [...row]);
    const meepleCount = meeples[currentPlayer];
    const useMeeple = meepleCount > 0 && Math.random() > 0.3;
    const points = currentTile.points + (useMeeple ? 2 : 0);
    newGrid[r][c] = { ...currentTile, owner: currentPlayer, hasMeeple: useMeeple };

    setGrid(newGrid);
    setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + points }));
    if (useMeeple) setMeeples(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] - 1 }));
    setMessage(`+${points} ${isEl ? "πόντοι" : "points"}!`);

    const left = tilesLeft - 1;
    setTilesLeft(left);

    if (left <= 0) {
      const s1 = currentPlayer === 1 ? scores[1] + points : scores[1];
      const s2 = currentPlayer === 2 ? scores[2] + points : scores[2];
      setWinner(s1 > s2 ? 1 : s2 > s1 ? 2 : "draw");
      return;
    }

    if (mode === "local") {
      setTurn(prev => prev === 1 ? 2 : 1);
      setCurrentTile(drawTile());
      setMessage(isEl ? "Τοποθέτησε πλακίδιο!" : "Place a tile!");
      return;
    }

    // AI turn (mode === "ai")
    setTurn(2);
    setTimeout(() => {
      const empties = [];
      for (let rr = 0; rr < GRID; rr++) for (let cc = 0; cc < GRID; cc++) {
        if (!newGrid[rr][cc] && [[-1,0],[1,0],[0,-1],[0,1]].some(([dr,dc]) => {
          const nr = rr+dr, nc = cc+dc;
          return nr>=0 && nr<GRID && nc>=0 && nc<GRID && newGrid[nr][nc];
        })) empties.push([rr,cc]);
      }
      if (empties.length > 0) {
        const [ar, ac] = empties[Math.floor(Math.random()*empties.length)];
        const aiTile = drawTile();
        setMeeples(prev => {
          const aiMeeple = prev[2] > 0 && Math.random() > 0.4;
          const aiPts = aiTile.points + (aiMeeple ? 2 : 0);
          const ng = newGrid.map(row => [...row]);
          ng[ar][ac] = { ...aiTile, owner: 2, hasMeeple: aiMeeple };
          setGrid(ng);
          setScores(prevS => {
            const next = { ...prevS, 2: prevS[2] + aiPts };
            const newLeft = left - 1;
            setTilesLeft(newLeft);
            if (newLeft <= 0) {
              setWinner(next[1] > next[2] ? 1 : next[2] > next[1] ? 2 : "draw");
            }
            return next;
          });
          return aiMeeple ? { ...prev, 2: prev[2] - 1 } : prev;
        });
      } else {
        // AI has no valid placement - skip AI turn and return to player
      }
      setCurrentTile(drawTile());
      setTurn(1);
      setMessage(isEl ? "Τοποθέτησε πλακίδιο!" : "Place a tile!");
    }, 600);
    setTurn(2);
  }, [gameOver, grid, turn, currentTile, meeples, scores, tilesLeft, isEl]);

  const rotateTile = useCallback(() => {
    setCurrentTile(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  }, []);

  const reset = useCallback(() => {
    const g = initGrid(); g[2][2] = { ...drawTile(), owner: 0 };
    setGrid(g); setCurrentTile(drawTile()); setMeeples({ 1: 7, 2: 7 });
    setScores({ 1: 0, 2: 0 }); setTurn(1); setTilesLeft(20); setWinner(null);
    setMessage(isEl ? "Τοποθέτησε πλακίδιο!" : "Place a tile!");
    onPlayAgain?.();
  }, [isEl, onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Carcassonne" turn={gameOver ? null : turn} playerNames={playerNames} scores={scores} />
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, maxWidth: 420 }}>
            {Array.from({length: GRID*GRID}, (_,i) => {
              const r = Math.floor(i/GRID), c = i%GRID;
              const tile = grid[r][c];
              return (
                <button key={i} onClick={() => placeTile(r,c)}
                  className={["aspect-square rounded-2xl flex items-center justify-center text-2xl border-2 transition-all",
                    tile ? (tile.owner === 1 ? "border-violet-400/50 bg-gradient-to-br from-violet-500/30 to-violet-600/20 ring-[3px] ring-violet-400/50 shadow-xl shadow-violet-900/20"
                      : tile.owner === 2 ? "border-amber-400/50 bg-gradient-to-br from-amber-500/30 to-amber-600/20 ring-[3px] ring-amber-400/50 shadow-xl shadow-amber-900/20"
                      : "border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm")
                    : "border-dashed border-white/10 bg-gradient-to-br from-white/5 to-white/10 hover:bg-white/10 cursor-pointer",
                  ].join(" ")}>
                  {tile ? (
                    <div style={{ transform: `rotate(${tile.rotation}deg)` }}>
                      {tile.icon}{tile.hasMeeple ? (tile.owner === 1 ? "🟣" : "🔴") : ""}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Current tile */}
          <div className="flex items-center justify-center gap-4">
            <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-xl flex items-center gap-3">
              <span className="text-4xl drop-shadow-md" style={{ transform: `rotate(${currentTile.rotation}deg)`, display: "inline-block" }}>
                {currentTile.icon}
              </span>
              <span className="text-base font-bold text-slate-300">{currentTile.id}</span>
            </div>
            <button onClick={rotateTile} className="px-5 py-2.5 text-base rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-semibold hover:bg-white/20 transition-all">
              🔄 {isEl ? "Περιστροφή" : "Rotate"}
            </button>
          </div>

          <div className="flex gap-3 justify-center text-base font-semibold">
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">📦 {tilesLeft}</span>
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">🧍 {meeples[1]}</span>
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">{playerNames[2]}: 🧍 {meeples[2]}</span>
          </div>

          {message && <p className="text-center text-sm text-slate-400 font-medium">{message}</p>}
        </div>
      </div>
      {gameOver && <GameOverModal winner={winner} playerNames={playerNames} scores={scores}
        stats={{ [isEl ? "Πόντοι" : "Score"]: scores[1], [playerNames[2]]: scores[2], [isEl ? "Βοηθοί" : "Meeples left"]: meeples[1] }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
