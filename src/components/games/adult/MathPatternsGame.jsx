import React, { useState, useCallback } from "react";

const PATTERN_TYPES = ["arithmetic", "geometric", "squared", "fibonacci", "alternating"];

function generateArithmetic() {
  const diff = Math.floor(Math.random() * 5) + 2;
  const start = Math.floor(Math.random() * 8) + 2;
  const seq = [start];
  for (let i = 0; i < 4; i++) seq.push(seq[seq.length - 1] + diff);
  return { seq, answer: seq[seq.length - 1], type: "arithmetic" };
}

function generateGeometric() {
  const mult = Math.random() > 0.5 ? 2 : 3;
  const start = Math.floor(Math.random() * 4) + 2;
  const seq = [start];
  for (let i = 0; i < 4; i++) seq.push(seq[seq.length - 1] * mult);
  return { seq, answer: seq[seq.length - 1], type: "geometric" };
}

function generateSquared() {
  const start = Math.floor(Math.random() * 4) + 2;
  const seq = [];
  for (let i = start; i < start + 5; i++) seq.push(i * i);
  return { seq, answer: seq[seq.length - 1], type: "squared" };
}

function generateFibonacci() {
  const a = Math.floor(Math.random() * 3) + 1;
  const b = a + Math.floor(Math.random() * 2) + 1;
  const seq = [a, b];
  for (let i = 0; i < 3; i++) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  return { seq, answer: seq[seq.length - 1], type: "fibonacci" };
}

function generateAlternating() {
  const d1 = Math.floor(Math.random() * 3) + 2;
  const d2 = Math.floor(Math.random() * 3) + 2;
  if (d2 === d1) return generateAlternating();
  const start = Math.floor(Math.random() * 5) + 1;
  const seq = [start];
  for (let i = 0; i < 4; i++) seq.push(seq[seq.length - 1] + (i % 2 === 0 ? d1 : d2));
  return { seq, answer: seq[seq.length - 1], type: "alternating" };
}

function generateRound() {
  const type = PATTERN_TYPES[Math.floor(Math.random() * PATTERN_TYPES.length)];
  let result;
  if (type === "arithmetic") result = generateArithmetic();
  else if (type === "geometric") result = generateGeometric();
  else if (type === "squared") result = generateSquared();
  else if (type === "fibonacci") result = generateFibonacci();
  else result = generateAlternating();
  const opts = new Set([result.answer]);
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const v = result.answer + (offset === 0 ? 6 : offset);
    if (v > 0 && v !== result.answer) opts.add(v);
  }
  return { ...result, options: [...opts].sort((a, b) => a - b) };
}

export default function MathPatternsGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [roundData, setRoundData] = useState(() => generateRound());
  const [gameOver, setGameOver] = useState(false);

  const T = {
    title: isEl ? "Μαθηματικά Μοτίβα" : "Math Patterns",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Βαθμοί" : "Score",
    next: isEl ? "Επόμενο;" : "Next?",
    gameOver: isEl ? "Τέλος" : "Game Over",
    finalScore: isEl ? "Τελική Βαθμολογία" : "Final Score",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
  };

  const handleAnswer = useCallback(
    (val) => {
      if (gameOver) return;
      if (val === roundData.answer) setScore((s) => s + 1);
      if (round >= 9) {
        setGameOver(true);
      } else {
        setRound((r) => r + 1);
        setRoundData(generateRound());
      }
    },
    [round, roundData.answer, gameOver]
  );

  const initGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setRoundData(generateRound());
    setGameOver(false);
  }, []);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔢 {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-violet-600 dark:text-violet-400">{score}/10</span>
          </p>
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  const displaySeq = [...roundData.seq.slice(0, -1), "?"].join(", ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-bold text-violet-600 dark:text-violet-400">{round + 1}/10</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 mb-6">
          <p className="text-lg text-slate-500 dark:text-slate-400 text-center mb-2">{T.next}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-8 font-mono">
            {displaySeq}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roundData.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="py-4 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-slate-800 dark:text-slate-200 font-semibold text-xl transition"
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
