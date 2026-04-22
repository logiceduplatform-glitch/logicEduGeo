import React, { useState, useEffect, useCallback, useRef } from "react";

const COLORS = [
  { id: 0, bg: "bg-red-500", hover: "hover:bg-red-400", active: "bg-red-300", dark: "dark:bg-red-600" },
  { id: 1, bg: "bg-blue-500", hover: "hover:bg-blue-400", active: "bg-blue-300", dark: "dark:bg-blue-600" },
  { id: 2, bg: "bg-green-500", hover: "hover:bg-green-400", active: "bg-green-300", dark: "dark:bg-green-600" },
  { id: 3, bg: "bg-yellow-500", hover: "hover:bg-yellow-400", active: "bg-yellow-300", dark: "dark:bg-yellow-600" },
];

export default function SimonGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [phase, setPhase] = useState("idle"); // idle | playing | player | gameOver
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [litIndex, setLitIndex] = useState(-1);
  const [gameOver, setGameOver] = useState(false);
  const playIntervalRef = useRef(null);

  const addToSequence = useCallback(() => {
    setSequence((s) => [...s, Math.floor(Math.random() * 4)]);
  }, []);

  const playSequence = useCallback(() => {
    setPhase("playing");
    setPlayerIndex(0);
    let i = 0;
    const playNext = () => {
      if (i >= sequence.length) {
        setPhase("player");
        setLitIndex(-1);
        return;
      }
      setLitIndex(sequence[i]);
      i++;
      playIntervalRef.current = setTimeout(playNext, 600);
    };
    playIntervalRef.current = setTimeout(playNext, 500);
  }, [sequence]);

  const handleStart = useCallback(() => {
    setLevel(1);
    setSequence([]);
    addToSequence();
    setGameOver(false);
  }, [addToSequence]);

  useEffect(() => {
    if (phase === "idle" && sequence.length > 0 && level > 0) {
      const t = setTimeout(() => playSequence(), 800);
      return () => {
        clearTimeout(t);
        if (playIntervalRef.current) clearTimeout(playIntervalRef.current);
      };
    }
  }, [phase, sequence, playSequence, level]);

  const handlePadClick = useCallback(
    (idx) => {
      if (phase !== "player") return;
      setLitIndex(idx);
      setTimeout(() => setLitIndex(-1), 200);
      const expected = sequence[playerIndex];
      if (idx !== expected) {
        setPhase("gameOver");
        setGameOver(true);
        return;
      }
      const next = playerIndex + 1;
      setPlayerIndex(next);
      if (next >= sequence.length) {
        setLevel((l) => l + 1);
        addToSequence();
        setPhase("idle");
      }
    },
    [phase, playerIndex, sequence, addToSequence]
  );

  const handlePlayAgain = useCallback(() => {
    setPhase("idle");
    setLevel(0);
    setSequence([]);
    setGameOver(false);
    setLitIndex(-1);
  }, []);

  const T = {
    title: isEl ? "Simon Λέει" : "Simon Says",
    level: isEl ? "Επίπεδο" : "Level",
    start: isEl ? "Έναρξη" : "Start",
    gameOver: isEl ? "Λάθος! Παιχνίδι τέλος." : "Wrong! Game over.",
    playAgain: isEl ? "Παίξτε ξανά" : "Play Again",
    watch: isEl ? "Παρατήρησε..." : "Watch...",
    yourTurn: isEl ? "Η σειρά σου!" : "Your turn!",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>

        {gameOver ? (
          <div className="text-center mt-8">
            <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">{T.gameOver}</p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {T.level}: {level}
            </p>
            <button
              onClick={handlePlayAgain}
              className="px-6 py-3 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition"
            >
              {T.playAgain}
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-sm">{T.level}</span>
                <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{level}</span>
              </div>
            </div>

            {phase === "idle" && level === 0 && (
              <div className="text-center mb-6">
                <button
                  onClick={handleStart}
                  className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition shadow-lg"
                >
                  {T.start}
                </button>
              </div>
            )}

            {(phase === "playing" || phase === "idle") && level > 0 && (
              <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{T.watch}</p>
            )}
            {phase === "player" && <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{T.yourTurn}</p>}

            <div className="grid grid-cols-2 gap-4 max-w-[260px] mx-auto">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handlePadClick(c.id)}
                  disabled={phase === "playing"}
                  className={`
                    aspect-square rounded-2xl transition-all duration-150
                    ${c.bg} ${c.dark} ${c.hover}
                    ${litIndex === c.id ? "ring-4 ring-white scale-95 opacity-90" : ""}
                    ${phase === "playing" ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
