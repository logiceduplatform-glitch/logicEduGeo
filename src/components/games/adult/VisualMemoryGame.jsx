import React, { useState, useEffect, useCallback } from "react";

function pickRandomIndices(count, max) {
  const indices = [];
  const available = [...Array(max).keys()];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    indices.push(available.splice(idx, 1)[0]);
  }
  return indices.sort((a, b) => a - b);
}

export default function VisualMemoryGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [phase, setPhase] = useState("memorize");
  const [gridSize, setGridSize] = useState(3);
  const [highlighted, setHighlighted] = useState([]);
  const [targetIndices, setTargetIndices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const totalCells = gridSize * gridSize;
  const targetCount = Math.min(level + 2, totalCells);

  const startRound = useCallback(() => {
    const indices = pickRandomIndices(targetCount, totalCells);
    setTargetIndices(indices);
    setHighlighted(indices);
    setSelected([]);
    setPhase("memorize");
    setTimeout(() => {
      setHighlighted([]);
      setPhase("recall");
    }, 2000);
  }, [targetCount, totalCells]);

  const initGame = useCallback(() => {
    setGridSize(3);
    setLevel(1);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setHighlighted([]);
    setTargetIndices([]);
    setSelected([]);
    setPhase("memorize");
    setTimeout(() => {
      setGridSize(3);
      const indices = pickRandomIndices(3, 9);
      setTargetIndices(indices);
      setHighlighted(indices);
      setPhase("memorize");
      setTimeout(() => {
        setHighlighted([]);
        setPhase("recall");
      }, 2000);
    }, 150);
  }, []);

  useEffect(() => {
    if (level <= 3) setGridSize(3);
    else if (level <= 6) setGridSize(4);
    else setGridSize(5);
  }, [level]);

  const handleCellClick = useCallback(
    (idx) => {
      if (phase !== "recall" || gameOver) return;
      const next = selected.includes(idx) ? selected.filter((i) => i !== idx) : [...selected, idx].sort((a, b) => a - b);
      setSelected(next);

      if (next.length === targetCount) {
        const correct =
          next.length === targetIndices.length &&
          next.every((i) => targetIndices.includes(i));
        if (correct) {
          const newLevel = level + 1;
          setLevel(newLevel);
          if (newLevel >= 9) {
            setWon(true);
            setGameOver(true);
          } else {
            setTimeout(() => startRound(), 600);
          }
        } else {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) {
            setGameOver(true);
          } else {
            setTimeout(() => startRound(), 800);
          }
        }
      }
    },
    [phase, gameOver, selected, targetCount, targetIndices, lives, level, startRound]
  );

  const T = {
    title: isEl ? "Οπτική Μνήμη" : "Visual Memory",
    level: isEl ? "Επίπεδο" : "Level",
    lives: isEl ? "Ζωές" : "Lives",
    memorize: isEl ? "Θυμήσου τα τετράγωνα..." : "Memorize the squares...",
    recall: isEl ? "Κάνε κλικ στα ίδια τετράγωνα" : "Click the same squares",
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
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">
          {phase === "memorize" ? T.memorize : T.recall}
        </p>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.level}</span>
            <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">{level}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.lives}</span>
            <span className="ml-2 font-semibold text-rose-500 dark:text-rose-400">{lives} ❤️</span>
          </div>
        </div>

        <div
          className="grid gap-2 sm:gap-3 mx-auto max-w-[280px]"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: totalCells }, (_, i) => {
            const isHighlighted = phase === "memorize" && highlighted.includes(i);
            const isSel = selected.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                disabled={phase === "memorize"}
                className={`
                  aspect-square rounded-xl transition-all duration-300
                  ${phase === "memorize" ? "cursor-default" : "cursor-pointer hover:scale-105"}
                  ${isHighlighted ? "bg-amber-400 dark:bg-amber-500" : "bg-white dark:bg-slate-700"}
                  ${phase === "recall" && isSel ? "ring-4 ring-emerald-500 dark:ring-emerald-400 bg-emerald-200 dark:bg-emerald-800" : ""}
                  ${phase === "recall" && !isSel ? "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500" : ""}
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
