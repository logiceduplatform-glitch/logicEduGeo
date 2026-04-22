import React, { useState, useCallback, useMemo, useEffect } from "react";

const COLORS = [
  { key: "r", className: "bg-rose-500" },
  { key: "b", className: "bg-sky-500" },
  { key: "g", className: "bg-emerald-500" },
  { key: "y", className: "bg-amber-400" },
];

function randomSequence(len) {
  const s = [];
  for (let i = 0; i < len; i++) s.push(COLORS[Math.floor(Math.random() * COLORS.length)].key);
  return s;
}

export default function ColorSequenceGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("show");
  const [seqLen, setSeqLen] = useState(3);
  const [bestLen, setBestLen] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [showStep, setShowStep] = useState(0);
  const [playerStep, setPlayerStep] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const T = useMemo(
    () => ({
      title: isEl ? "Χρωματική ακολουθία" : "Color sequence",
      instructions: isEl
        ? "Θυμήσου τη σειρά των χρωμάτων και την επανάλαβε με την ίδια σειρά. Ξεκινά από 3 κύκλους, έως 10. Λάθος = τέλος. Σκορ: καλύτερο μήκος που ολοκλήρωσες."
        : "Watch the color sequence, then repeat it in order. Starts at 3, up to 10. Wrong tap ends the run. Score: longest sequence you completed.",
      start: isEl ? "Έναρξη" : "Start",
      watch: isEl ? "Πρόσεχε…" : "Watch…",
      yourTurn: isEl ? "Η σειρά σου" : "Your turn",
      level: isEl ? "Μήκος" : "Length",
      gameOver: isEl ? "Τέλος" : "Game Over",
      best: isEl ? "Καλύτερο μήκος" : "Best length",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const startRound = useCallback((len) => {
    const seq = randomSequence(len);
    setSequence(seq);
    setShowStep(0);
    setPlayerStep(0);
    setPhase("show");
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setSeqLen(3);
    setBestLen(0);
    setGameOver(false);
    startRound(3);
  }, [startRound]);

  useEffect(() => {
    if (!started || gameOver || phase !== "show") return;
    if (showStep >= sequence.length) {
      setPhase("play");
      return;
    }
    const id = setTimeout(() => setShowStep((s) => s + 1), 650);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, showStep, sequence.length]);

  const tapColor = useCallback(
    (key) => {
      if (phase !== "play" || gameOver) return;
      const expected = sequence[playerStep];
      if (key !== expected) {
        setGameOver(true);
        return;
      }
      if (playerStep >= sequence.length - 1) {
        setBestLen((b) => Math.max(b, seqLen));
        if (seqLen >= 10) {
          setGameOver(true);
          return;
        }
        const nl = seqLen + 1;
        setSeqLen(nl);
        startRound(nl);
      } else {
        setPlayerStep((p) => p + 1);
      }
    },
    [phase, gameOver, sequence, playerStep, seqLen, startRound]
  );

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎨 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.best}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{bestLen}</span>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🎨 {T.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-left sm:text-center">{T.instructions}</p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.start}
          </button>
        </div>
      </div>
    );
  }

  const highlightKey = phase === "show" && showStep < sequence.length ? sequence[showStep] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{T.title}</h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
          {T.level}: <span className="font-bold text-amber-600 dark:text-amber-400">{seqLen}</span>
        </p>

        {phase === "show" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-10">
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{T.watch}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {COLORS.map((c) => (
                <div
                  key={c.key}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${c.className} transition ring-4 ${
                    highlightKey === c.key ? "ring-amber-400 scale-110 opacity-100" : "ring-transparent opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "play" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8">
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">{T.yourTurn}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => tapColor(c.key)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${c.className} hover:scale-105 transition shadow-lg`}
                  aria-label={c.key}
                />
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              {playerStep + 1}/{sequence.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
