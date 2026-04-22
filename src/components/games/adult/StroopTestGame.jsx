import React, { useState, useEffect, useCallback, useMemo } from "react";

const COLOR_KEYS = ["red", "blue", "green", "yellow"];
const COLOR_STYLES = {
  red: "text-red-600",
  blue: "text-blue-600",
  green: "text-green-600",
  yellow: "text-yellow-500",
};

function randomStroop() {
  const wordKey = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
  let inkKey = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
  while (inkKey === wordKey) inkKey = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
  return { wordKey, inkKey };
}

export default function StroopTestGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [stroop, setStroop] = useState(() => randomStroop());
  const [timeLeft, setTimeLeft] = useState(3);

  const T = useMemo(
    () => ({
      title: isEl ? "Δοκιμασία Στρούπ" : "Stroop Test",
      instructions: isEl
        ? "Η λέξη δείχνει ένα χρώμα, αλλά το κείμενο είναι βαμμένο αλλού. Πάτησε το χρώμα του ΚΕΙΜΕΝΟΥ, όχι τη λέξη. 20 γύροι, 3 δευτ. ανά γύρο."
        : "The word names a color, but the text is printed in a different ink color. Tap the INK color of the text, not the word. 20 rounds, 3s each.",
      start: isEl ? "Έναρξη" : "Start",
      round: isEl ? "Γύρος" : "Round",
      score: isEl ? "Βαθμοί" : "Score",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Σωστές απαντήσεις" : "Correct answers",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
      tapInk: isEl ? "Χρώμα γραμμάτων" : "Ink color",
    }),
    [isEl]
  );

  const wordLabel = (key) => {
    const el = { red: "ΚΟΚΚΙΝΟ", blue: "ΜΠΛΕ", green: "ΠΡΑΣΙΝΟ", yellow: "ΚΙΤΡΙΝΟ" };
    const en = { red: "RED", blue: "BLUE", green: "GREEN", yellow: "YELLOW" };
    return isEl ? el[key] : en[key];
  };

  const colorButtonLabel = (key) => {
    const el = { red: "Κόκκινο", blue: "Μπλε", green: "Πράσινο", yellow: "Κίτρινο" };
    const en = { red: "Red", blue: "Blue", green: "Green", yellow: "Yellow" };
    return isEl ? el[key] : en[key];
  };

  const initGame = useCallback(() => {
    setStarted(true);
    setRound(0);
    setScore(0);
    setGameOver(false);
    setStroop(randomStroop());
    setTimeLeft(3);
  }, []);

  const advanceRound = useCallback((correct) => {
    setScore((s) => (correct ? s + 1 : s));
    setRound((r) => {
      if (r >= 19) {
        setGameOver(true);
        return r;
      }
      setStroop(randomStroop());
      setTimeLeft(3);
      return r + 1;
    });
  }, []);

  const handlePick = useCallback(
    (inkKey) => {
      if (gameOver || !started) return;
      const correct = inkKey === stroop.inkKey;
      advanceRound(correct);
    },
    [gameOver, started, stroop.inkKey, advanceRound]
  );

  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
      return () => clearTimeout(t);
    }
    setRound((r) => {
      if (r >= 19) {
        setGameOver(true);
        return r;
      }
      setStroop(randomStroop());
      setTimeLeft(3);
      return r + 1;
    });
  }, [timeLeft, started, gameOver]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎨 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
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

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🎨 {T.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-left sm:text-center">{T.instructions}</p>
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            {T.start}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">{Math.min(round + 1, 20)}/20</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="ml-2 font-bold text-rose-600 dark:text-rose-400">{timeLeft}s</span>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">{T.tapInk}</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 mb-6">
          <p className={`text-4xl sm:text-5xl font-black text-center mb-8 ${COLOR_STYLES[stroop.inkKey]}`}>
            {wordLabel(stroop.wordKey)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {COLOR_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handlePick(k)}
                className="py-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-800 dark:text-slate-200 font-semibold transition"
              >
                {colorButtonLabel(k)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
