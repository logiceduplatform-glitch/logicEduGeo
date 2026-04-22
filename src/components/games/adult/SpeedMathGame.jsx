import React, { useState, useEffect, useCallback } from "react";

function generateProblem() {
  const op = Math.floor(Math.random() * 3);
  if (op === 0) {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    return { q: `${a} + ${b}`, ans: a + b };
  }
  if (op === 1) {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 10) + 1;
    return { q: `${a} − ${b}`, ans: a - b };
  }
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  return { q: `${a} × ${b}`, ans: a * b };
}

function generateOptions(correct) {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 15) - 7;
    const v = correct + (offset === 0 ? 1 : offset);
    if (v >= 0 && v !== correct) opts.add(v);
  }
  return [...opts].sort((a, b) => a - b);
}

function getNewProblem() {
  const p = generateProblem();
  return { problem: p, options: generateOptions(p.ans) };
}

export default function SpeedMathGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [problemState, setProblemState] = useState(getNewProblem);
  const { problem, options } = problemState;
  const [playing, setPlaying] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const nextProblem = useCallback(() => {
    setProblemState(getNewProblem());
  }, []);

  const handleAnswer = useCallback(
    (val) => {
      if (!playing || gameOver) return;
      if (val === problem.ans) {
        setScore((s) => s + 1);
      }
      nextProblem();
    },
    [playing, gameOver, problem.ans, nextProblem]
  );

  useEffect(() => {
    if (!playing || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPlaying(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, gameOver]);

  const initGame = useCallback(() => {
    setTimeLeft(60);
    setScore(0);
    setPlaying(true);
    setGameOver(false);
    setProblemState(getNewProblem());
  }, []);

  const T = {
    title: isEl ? "Γρήγορα Μαθηματικά" : "Speed Math",
    time: isEl ? "Χρόνος" : "Time",
    score: isEl ? "Βαθμοί" : "Score",
    gameOver: isEl ? "Τέλος" : "Game Over",
    finalScore: isEl ? "Τελική Βαθμολογία" : "Final Score",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🧮 {T.gameOver}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.time}</span>
            <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">{timeLeft}s</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 mb-6">
          <p className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 text-center mb-8">
            {problem.q} = ?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <button
                key={`${opt}-${i}`}
                onClick={() => handleAnswer(opt)}
                className="py-4 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-800 dark:text-slate-200 font-semibold text-xl transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
