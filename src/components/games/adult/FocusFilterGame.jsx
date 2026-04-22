import React, { useState, useCallback, useMemo, useEffect } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateLevel() {
  const reds = [];
  const used = new Set();
  while (reds.length < 5) {
    const n = Math.floor(Math.random() * 40) + 1;
    if (!used.has(n)) {
      used.add(n);
      reds.push(n);
    }
  }
  reds.sort((a, b) => a - b);
  const blues = [];
  while (blues.length < 5) {
    const n = Math.floor(Math.random() * 60) + 41;
    if (!used.has(n)) {
      used.add(n);
      blues.push(n);
    }
  }
  const items = [
    ...reds.map((n) => ({ n, color: "red" })),
    ...blues.map((n) => ({ n, color: "blue" })),
  ];
  const positions = shuffle(items.map((item, i) => ({ ...item, id: i, x: 8 + Math.random() * 72, y: 12 + Math.random() * 58 })));
  return { redsSorted: [...reds], positions };
}

export default function FocusFilterGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(() => generateLevel());
  const [nextIdx, setNextIdx] = useState(0);
  const [sequences, setSequences] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);

  const T = useMemo(
    () => ({
      title: isEl ? "Φίλτρο εστίασης" : "Focus filter",
      instructions: isEl
        ? "Κόκκινοι και μπλε αριθμοί εμφανίζονται τυχαία. Πάτησε ΜΟΝΟ τους κόκκινους με αύξουσα σειρά. Λάθος πάτημα = τέλος. 45 δευτ. Όσες περισσότερες πλήρεις σειρές, τόσο καλύτερα."
        : "Red and blue numbers appear scattered. Tap ONLY the red numbers in ascending order. Wrong tap ends the run. 45 seconds — complete as many full sequences as you can.",
      start: isEl ? "Έναρξη" : "Start",
      next: isEl ? "Επόμενος κόκκινος (αύξουσα)" : "Next red (ascending)",
      score: isEl ? "Ολοκληρωμένες σειρές" : "Sequences cleared",
      time: isEl ? "Χρόνος" : "Time",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Σκορ" : "Score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const initGame = useCallback(() => {
    setStarted(true);
    setLevel(generateLevel());
    setNextIdx(0);
    setSequences(0);
    setTimeLeft(45);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, gameOver]);

  const tap = useCallback(
    (item) => {
      if (gameOver || !started) return;
      const target = level.redsSorted[nextIdx];
      if (item.color !== "red" || item.n !== target) {
        setGameOver(true);
        return;
      }
      if (nextIdx >= level.redsSorted.length - 1) {
        setSequences((s) => s + 1);
        const nv = generateLevel();
        setLevel(nv);
        setNextIdx(0);
      } else {
        setNextIdx((i) => i + 1);
      }
    },
    [gameOver, started, level, nextIdx]
  );

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎯 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{sequences}</span>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🎯 {T.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-left sm:text-center">{T.instructions}</p>
          <button onClick={initGame} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
            {T.start}
          </button>
        </div>
      </div>
    );
  }

  const nextVal = level.redsSorted[nextIdx];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-2 flex-wrap">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {T.score}: <strong className="text-emerald-600 dark:text-emerald-400">{sequences}</strong>
          </span>
          <span className="text-sm text-rose-600 dark:text-rose-400 font-bold">
            {T.time}: {timeLeft}s
          </span>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
          {T.next}: <span className="font-bold text-red-600 dark:text-red-400">{nextVal}</span>
        </p>
        <div className="relative rounded-2xl bg-white dark:bg-slate-800 shadow-lg h-[320px] sm:h-[380px] overflow-hidden">
          {level.positions.map((item) => (
            <button
              key={`${item.id}-${item.n}-${item.x}`}
              type="button"
              onClick={() => tap(item)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[3rem] py-2 px-3 rounded-xl font-bold text-lg shadow-md transition hover:scale-105 ${
                item.color === "red"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
