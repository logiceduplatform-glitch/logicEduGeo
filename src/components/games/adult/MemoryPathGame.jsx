import React, { useState, useEffect, useCallback, useRef } from "react";

function getNeighbors(idx, size) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const n = [];
  if (row > 0) n.push(idx - size);
  if (row < size - 1) n.push(idx + size);
  if (col > 0) n.push(idx - 1);
  if (col < size - 1) n.push(idx + 1);
  return n;
}

function buildPath(steps, size) {
  const total = size * size;
  const path = [];
  let current = Math.floor(Math.random() * total);
  path.push(current);

  for (let i = 1; i < steps; i++) {
    const neighbors = getNeighbors(current, size).filter((n) => !path.includes(n));
    if (neighbors.length === 0) break;
    current = neighbors[Math.floor(Math.random() * neighbors.length)];
    path.push(current);
  }
  return path;
}

export default function MemoryPathGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [gridSize, setGridSize] = useState(4);
  const [phase, setPhase] = useState("watch"); // watch | recall
  const [path, setPath] = useState([]);
  const [lightIndex, setLightIndex] = useState(-1);
  const [selectedPath, setSelectedPath] = useState([]);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const pathLength = Math.min(2 + level, 8);
  const totalCells = gridSize * gridSize;

  const startRound = useCallback(() => {
    const p = buildPath(pathLength, gridSize);
    setPath(p);
    setSelectedPath([]);
    setPhase("watch");
    setLightIndex(-1);
  }, [pathLength, gridSize]);

  const initGame = useCallback(() => {
    setGridSize(4);
    setLevel(1);
    setGameOver(false);
    setWon(false);
    setPath([]);
    setSelectedPath([]);
    setPhase("watch");
    setLightIndex(-1);
  }, []);

  const timeoutIdsRef = useRef([]);

  useEffect(() => {
    if (!gameOver && path.length > 0 && phase === "watch") {
      const ids = [];
      timeoutIdsRef.current = ids;
      let i = 0;
      const showNext = () => {
        if (i < path.length) {
          setLightIndex(path[i]);
          i++;
          const id = setTimeout(showNext, 600);
          ids.push(id);
          return id;
        } else {
          setLightIndex(-1);
          setPhase("recall");
          return null;
        }
      };
      const firstId = setTimeout(showNext, 400);
      ids.push(firstId);
      return () => {
        ids.forEach((id) => clearTimeout(id));
      };
    }
  }, [path, phase, gameOver]);


  const handleCellClick = useCallback(
    (idx) => {
      if (phase !== "recall" || gameOver) return;
      const expected = path[selectedPath.length];
      if (idx !== expected) {
        setGameOver(true);
        return;
      }
      const next = [...selectedPath, idx];
      setSelectedPath(next);
      if (next.length === path.length) {
        setLevel((l) => l + 1);
        if (level >= 6) {
          setWon(true);
          setGameOver(true);
        } else {
          setTimeout(() => startRound(), 500);
        }
      }
    },
    [phase, gameOver, path, selectedPath, level, startRound]
  );

  useEffect(() => {
    if (!gameOver && path.length === 0) {
      const t = setTimeout(startRound, 200);
      return () => clearTimeout(t);
    }
  }, [gameOver, path.length, startRound]);

  const T = {
    title: isEl ? "Μνήμη Διαδρομής" : "Memory Path",
    level: isEl ? "Επίπεδο" : "Level",
    watch: isEl ? "Παρακολούθησε τη διαδρομή..." : "Watch the path...",
    recall: isEl ? "Κάνε κλικ με τη σωστή σειρά" : "Click in the correct order",
    gameOver: isEl ? "Τέλος παιχνιδιού" : "Game Over",
    youWon: isEl ? "Κέρδισες!" : "You Won!",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    finalLevel: isEl ? "Έφτασες στο επίπεδο" : "You reached level",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {won ? "🎉" : "💔"} {won ? T.youWon : T.gameOver}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalLevel} {level}
          </p>
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6 text-sm">
          {phase === "watch" ? T.watch : T.recall}
        </p>
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.level}</span>
            <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">{level}</span>
          </div>
        </div>

        <div
          className="grid gap-2 mx-auto max-w-[240px]"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: totalCells }, (_, i) => {
            const isLit = phase === "watch" && lightIndex === i;
            const isSelected = selectedPath.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                disabled={phase === "watch"}
                className={`
                  aspect-square rounded-xl transition-all duration-300
                  ${phase === "watch" ? "cursor-default" : "cursor-pointer hover:scale-105"}
                  ${isLit ? "bg-amber-400 dark:bg-amber-500" : ""}
                  ${isSelected ? "bg-emerald-500 dark:bg-emerald-600" : ""}
                  ${!isLit && !isSelected ? "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500" : ""}
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
