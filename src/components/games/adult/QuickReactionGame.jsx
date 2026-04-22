import React, { useState, useEffect, useCallback, useRef } from "react";

const TARGET = "⭐";
const TOTAL_ROUNDS = 10;
const COUNTDOWN_SECONDS = 3;
const MIN_DELAY_MS = 1500;
const MAX_DELAY_MS = 4000;

export default function QuickReactionGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [phase, setPhase] = useState("idle"); // idle | countdown | wait | tap | result | gameOver
  const [round, setRound] = useState(0);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [targetVisible, setTargetVisible] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const appearTimeRef = useRef(null);
  const timerRef = useRef(null);

  const startGame = useCallback(() => {
    setPhase("idle");
    setRound(0);
    setReactionTimes([]);
    setGameOver(false);
    setTooEarly(false);
  }, []);

  const startCountdown = useCallback(() => {
    setPhase("countdown");
    setCountdown(COUNTDOWN_SECONDS);
    setTooEarly(false);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("wait");
      setTargetVisible(false);
      const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
      timerRef.current = setTimeout(() => {
        setTargetPos({
          x: 15 + Math.random() * 70,
          y: 25 + Math.random() * 50,
        });
        setTargetVisible(true);
        appearTimeRef.current = Date.now();
        setPhase("tap");
      }, delay);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "wait") {
      setTooEarly(true);
      setPhase("result");
      setTimeout(() => {
        if (round + 1 >= TOTAL_ROUNDS) setGameOver(true);
        else {
          setRound((r) => r + 1);
          startCountdown();
        }
      }, 1500);
      return;
    }
    if (phase !== "tap" || !targetVisible) return;
    const rt = Date.now() - appearTimeRef.current;
    setCurrentReaction(rt);
    setReactionTimes((t) => [...t, rt]);
    setTargetVisible(false);
    setPhase("result");
    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) setGameOver(true);
      else {
        setRound((r) => r + 1);
        startCountdown();
      }
    }, 1200);
  }, [phase, targetVisible, round, startCountdown]);

  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const T = {
    title: isEl ? "Γρήγορη Αντίδραση" : "Quick Reaction",
    round: isEl ? "Γύρος" : "Round",
    avg: isEl ? "Μέσος χρόνος" : "Avg. time",
    ms: isEl ? "ms" : "ms",
    start: isEl ? "Έναρξη" : "Start",
    getReady: isEl ? "Προετοιμάσου..." : "Get ready...",
    tooEarly: isEl ? "Πολύ νωρίς!" : "Too early!",
    playAgain: isEl ? "Παίξτε ξανά" : "Play Again",
    tapTarget: isEl ? "Πάτα το αστέρι όταν εμφανιστεί!" : "Tap the star when it appears!",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{T.title}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">{T.avg}</p>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">{avgReaction} {T.ms}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden cursor-crosshair"
      onClick={handleClick}
    >
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-6 z-10">
        <div className="px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
          <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1} / {TOTAL_ROUNDS}</span>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 text-sm">{T.avg}</span>
          <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{avgReaction} {T.ms}</span>
        </div>
      </div>

      {phase === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-center px-4">{T.tapTarget}</p>
          <button
            onClick={startCountdown}
            className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg transition shadow-lg"
          >
            {T.start}
          </button>
        </div>
      )}

      {phase === "countdown" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl sm:text-8xl font-bold text-slate-700 dark:text-slate-300">{countdown}</span>
        </div>
      )}

      {phase === "wait" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">{T.getReady}</p>
        </div>
      )}

      {targetVisible && phase === "tap" && (
        <div
          className="absolute w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-4xl sm:text-5xl cursor-pointer select-none animate-pulse"
          style={{
            left: `${targetPos.x}%`,
            top: `${targetPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {TARGET}
        </div>
      )}

      {phase === "result" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 dark:bg-black/20">
          {tooEarly ? (
            <p className="text-2xl font-bold text-red-500">{T.tooEarly}</p>
          ) : (
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{currentReaction} {T.ms}</p>
          )}
        </div>
      )}
    </div>
  );
}
