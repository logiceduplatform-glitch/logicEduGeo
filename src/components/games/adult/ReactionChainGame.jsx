import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";

const TOTAL = 20;

export default function ReactionChainGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [index, setIndex] = useState(0);
  const [times, setTimes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const shownAtRef = useRef(0);

  const T = useMemo(
    () => ({
      title: isEl ? "Αλυσίδα αντίδρασης" : "Reaction chain",
      instructions: isEl
        ? "Εμφανίζεται στόχος σε τυχαία θέση. Πάτησέ τον όσο πιο γρήγορα μπορείς. 20 στόχοι. Το σκορ είναι ο μέσος χρόνος (ms)· όσο χαμηλότερο, τόσο καλύτερα."
        : "A target appears at a random spot. Tap it as fast as you can — 20 targets. Score is your average reaction time in milliseconds; lower is better.",
      start: isEl ? "Έναρξη" : "Start",
      go: isEl ? "Πάμε!" : "Go!",
      tap: isEl ? "Πάτα!" : "Tap!",
      progress: isEl ? "Στόχος" : "Target",
      gameOver: isEl ? "Τέλος" : "Game Over",
      avg: isEl ? "Μέσος χρόνος αντίδρασης" : "Average reaction time",
      ms: isEl ? "χιλιοστά" : "ms",
      lower: isEl ? "(χαμηλότερο = καλύτερο)" : "(lower is better)",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const placeTarget = useCallback(() => {
    setPos({
      x: 15 + Math.random() * 70,
      y: 18 + Math.random() * 62,
    });
    shownAtRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setPhase("ready");
    setIndex(0);
    setTimes([]);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (!started || gameOver || phase !== "ready") return;
    const id = setTimeout(() => {
      setPhase("play");
      placeTarget();
    }, 800);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, placeTarget]);

  const hit = useCallback(() => {
    if (phase !== "play" || gameOver) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = Math.round(now - shownAtRef.current);
    setTimes((prev) => [...prev, dt]);
    if (index >= TOTAL - 1) {
      setGameOver(true);
      return;
    }
    setIndex((i) => i + 1);
    placeTarget();
  }, [phase, gameOver, index, placeTarget]);

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">⚡ {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-1">{T.avg}</p>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {avg} {T.ms}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{T.lower}</p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">⚡ {T.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-left sm:text-center">{T.instructions}</p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.start}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{T.title}</h1>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
          {T.progress}: {index + 1}/{TOTAL}
        </p>
        <div className="relative rounded-2xl bg-white dark:bg-slate-800 shadow-lg h-[360px] sm:h-[420px] overflow-hidden">
          {phase === "ready" && (
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400">
              {T.go}
            </div>
          )}
          {phase === "play" && (
            <button
              type="button"
              onClick={hit}
              className="absolute min-w-[4.5rem] min-h-[4.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg ring-4 ring-rose-200 dark:ring-rose-900 transition flex items-center justify-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {T.tap}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
