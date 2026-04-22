import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";

const EMOJIS = ["🍎", "🍌", "🍇", "🍊", "🥝", "🍓", "🍑", "🥭", "🍉", "🍒"];

function buildSequence(length) {
  const seq = [];
  for (let i = 0; i < length; i++) seq.push(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  return seq;
}

export default function NBackGame({ lang = "el" }) {
  const isEl = lang === "el";
  const N = 2;
  const TOTAL = 22;
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const sequenceRef = useRef(buildSequence(TOTAL));

  const T = useMemo(
    () => ({
      title: isEl ? "N-Πίσω (2-back)" : "N-Back (2-back)",
      instructions: isEl
        ? "Εμφανίζεται μία σειρά από emoji. Όταν το τρέχον ίδιο με αυτό πριν από 2 βήματα, πάτησε «Ταίριασμα». Αλλιώς «Όχι». Οι δύο πρώτοι γύροι είναι προθέρμανση. 20 απαντήσεις μετά."
        : "Symbols appear one at a time. When the current symbol matches the one from 2 steps ago, tap Match. Otherwise No Match. First two steps are practice; then 20 scored trials.",
      start: isEl ? "Έναρξη" : "Start",
      trial: isEl ? "Δοκιμή" : "Trial",
      score: isEl ? "Βαθμοί" : "Score",
      match: isEl ? "Ταίριασμα" : "Match",
      noMatch: isEl ? "Όχι" : "No match",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Τελική βαθμολογία" : "Final score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const initGame = useCallback(() => {
    sequenceRef.current = buildSequence(TOTAL);
    setStarted(true);
    setGameOver(false);
    setScore(0);
    setIndex(0);
  }, []);

  const isMatchAt = (i) => i >= N && sequenceRef.current[i] === sequenceRef.current[i - N];

  const respond = useCallback(
    (saidMatch) => {
      if (gameOver || !started) return;
      const i = index;
      if (i < N) {
        setIndex(i + 1);
        return;
      }
      const actual = isMatchAt(i);
      if (saidMatch === actual) setScore((s) => s + 1);
      const scoredTrialsEnd = N + 20;
      if (i + 1 >= scoredTrialsEnd) {
        setGameOver(true);
        return;
      }
      setIndex(i + 1);
    },
    [gameOver, started, index]
  );

  useEffect(() => {
    if (!started || gameOver) return;
    const onKey = (e) => {
      if (e.key === "m" || e.key === "M") respond(true);
      if (e.key === "n" || e.key === "N") respond(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, gameOver, respond]);

  const current = sequenceRef.current[index];
  const trialLabel = index < N ? `${T.trial} ${index + 1}` : `${T.trial} ${index - N + 1}/20`;

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🧠 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}/20</span>
          </p>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🧠 {T.title}</h1>
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
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{trialLabel}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-12 flex flex-col items-center">
          <div className="text-8xl mb-10 select-none" aria-hidden>
            {current}
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <button
              type="button"
              onClick={() => respond(true)}
              className="py-4 rounded-xl bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-900 dark:text-rose-100 font-semibold transition"
            >
              {T.match}
            </button>
            <button
              type="button"
              onClick={() => respond(false)}
              className="py-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold transition"
            >
              {T.noMatch}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
