import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound() {
  const nums = new Set();
  while (nums.size < 6) nums.add(Math.floor(Math.random() * 18) + 2);
  const arr = [...nums];
  const i = Math.floor(Math.random() * 6);
  let j = Math.floor(Math.random() * 6);
  while (j === i) j = Math.floor(Math.random() * 6);
  const target = arr[i] + arr[j];
  return { numbers: shuffle(arr), target };
}

export default function NumberBondsGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [data, setData] = useState(() => generateRound());
  const [selected, setSelected] = useState([]);
  const [timeLeft, setTimeLeft] = useState(12);
  const roundRef = useRef(0);

  const T = useMemo(
    () => ({
      title: isEl ? "Αριθμητικά ζεύγη" : "Number bonds",
      instructions: isEl
        ? "Διάλεξε δύο αριθμούς από τους έξι που αθροίζουν στον στόχο. 12 δευτ. ανά γύρο, 10 γύροι."
        : "Pick two of the six numbers that add up to the target. 12 seconds per round, 10 rounds.",
      start: isEl ? "Έναρξη" : "Start",
      sum: isEl ? "Άθροισμα" : "Sum",
      pickTwo: isEl ? "Διάλεξε ακριβώς 2" : "Pick exactly 2",
      round: isEl ? "Γύρος" : "Round",
      score: isEl ? "Βαθμοί" : "Score",
      time: isEl ? "Χρόνος" : "Time",
      clear: isEl ? "Καθαρισμός" : "Clear",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Τελική βαθμολογία" : "Final score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  const advanceAfterCorrect = useCallback(() => {
    setScore((sc) => sc + 1);
    const r = roundRef.current;
    if (r >= 9) {
      setGameOver(true);
      return;
    }
    setRound(r + 1);
    setData(generateRound());
    setSelected([]);
    setTimeLeft(12);
  }, []);

  const initGame = useCallback(() => {
    handledPairRef.current = "";
    setStarted(true);
    setRound(0);
    roundRef.current = 0;
    setScore(0);
    setGameOver(false);
    setData(generateRound());
    setSelected([]);
    setTimeLeft(12);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft <= 0) {
      if (roundRef.current >= 9) {
        setGameOver(true);
        return;
      }
      setRound((r) => r + 1);
      setData(generateRound());
      setSelected([]);
      setTimeLeft(12);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, started, gameOver]);

  const handledPairRef = useRef("");

  const toggle = useCallback(
    (n) => {
      if (gameOver) return;
      setSelected((s) => {
        if (s.includes(n)) return s.filter((x) => x !== n);
        if (s.length >= 2) return [s[1], n];
        return [...s, n];
      });
    },
    [gameOver]
  );

  useEffect(() => {
    if (selected.length !== 2 || gameOver) return;
    if (selected[0] + selected[1] !== data.target) return;
    const sig = `${round}-${data.target}-${selected[0]}-${selected[1]}`;
    if (handledPairRef.current === sig) return;
    handledPairRef.current = sig;
    const t = setTimeout(() => advanceAfterCorrect(), 320);
    return () => clearTimeout(t);
  }, [selected, data.target, round, gameOver, advanceAfterCorrect]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">➕ {T.gameOver}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {T.finalScore}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}/10</span>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">➕ {T.title}</h1>
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
        <div className="flex justify-center gap-4 mb-4 flex-wrap text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {T.round}: <strong className="text-amber-600 dark:text-amber-400">{round + 1}/10</strong>
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            {T.score}: <strong className="text-emerald-600 dark:text-emerald-400">{score}</strong>
          </span>
          <span className="text-rose-600 dark:text-rose-400 font-bold">
            {T.time}: {timeLeft}s
          </span>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 text-center mb-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{T.sum}</p>
          <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{data.target}</p>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">{T.pickTwo}</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {data.numbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              className={`py-4 rounded-xl text-xl font-bold transition ${
                selected.includes(n)
                  ? "bg-emerald-500 text-white ring-2 ring-emerald-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setSelected([])}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100"
          >
            {T.clear}
          </button>
        </div>
      </div>
    </div>
  );
}
