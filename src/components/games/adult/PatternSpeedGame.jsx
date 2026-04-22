import React, { useState, useCallback, useMemo, useEffect } from "react";

function randomPattern() {
  const p = [];
  for (let i = 0; i < 9; i++) p.push(Math.random() < 0.45 ? 1 : 0);
  return p;
}

function patternsEqual(a, b) {
  return a.every((v, i) => v === b[i]);
}

function flipOne(p) {
  const q = [...p];
  const i = Math.floor(Math.random() * 9);
  q[i] = 1 - q[i];
  return q;
}

function generateRound() {
  const target = randomPattern();
  const wrong1 = flipOne(target);
  const wrong2 = flipOne(target);
  const wrong3 = randomPattern();
  const opts = [
    { pattern: target, correct: true },
    { pattern: wrong1, correct: false },
    { pattern: patternsEqual(wrong2, target) ? flipOne(wrong2) : wrong2, correct: false },
    { pattern: patternsEqual(wrong3, target) ? flipOne(wrong3) : wrong3, correct: false },
  ];
  return { target, options: opts.sort(() => Math.random() - 0.5) };
}

function MiniGrid({ pattern }) {
  return (
    <div className="grid grid-cols-3 gap-1 w-24 h-24 sm:w-28 sm:h-28 mx-auto">
      {pattern.map((v, i) => (
        <div
          key={i}
          className={`rounded-md ${v ? "bg-violet-600 dark:bg-violet-400" : "bg-slate-200 dark:bg-slate-600"}`}
        />
      ))}
    </div>
  );
}

export default function PatternSpeedGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("flash");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [data, setData] = useState(() => generateRound());
  const [timeLeft, setTimeLeft] = useState(5);

  const T = useMemo(
    () => ({
      title: isEl ? "Ταχύτητα μοτίβου" : "Pattern speed",
      instructions: isEl
        ? "Θα δεις ένα μοτίβο 3×3 για λίγο. Μετά διάλεξε το ίδιο μοτίβο από 4 επιλογές. Έχεις 5 δευτ. ανά γύρο. 10 γύροι."
        : "A 3×3 pattern flashes briefly. Then pick the matching pattern from four choices. 5 seconds per round. 10 rounds.",
      start: isEl ? "Έναρξη" : "Start",
      round: isEl ? "Γύρος" : "Round",
      score: isEl ? "Βαθμοί" : "Score",
      memorize: isEl ? "Κράτα το μοτίβο…" : "Memorize…",
      pick: isEl ? "Διάλεξε το ίδιο" : "Pick the match",
      time: isEl ? "Χρόνος" : "Time",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Τελική βαθμολογία" : "Final score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const beginRound = useCallback(() => {
    const d = generateRound();
    setData(d);
    setPhase("flash");
    setTimeLeft(5);
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setRound(0);
    setScore(0);
    setGameOver(false);
    const d = generateRound();
    setData(d);
    setPhase("flash");
    setTimeLeft(5);
  }, []);

  useEffect(() => {
    if (!started || gameOver || phase !== "flash") return;
    const id = setTimeout(() => setPhase("pick"), 900);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, data]);

  useEffect(() => {
    if (!started || gameOver || phase !== "pick") return;
    if (timeLeft <= 0) {
      if (round >= 9) {
        setGameOver(true);
        return;
      }
      setRound((r) => r + 1);
      beginRound();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, started, gameOver, phase, round, beginRound]);

  const pick = useCallback(
    (correct) => {
      if (phase !== "pick" || gameOver) return;
      if (correct) setScore((s) => s + 1);
      if (round >= 9) {
        setGameOver(true);
        return;
      }
      setRound((r) => r + 1);
      beginRound();
    },
    [phase, gameOver, round, beginRound]
  );

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">⚡ {T.gameOver}</p>
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
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {T.round}: <strong className="text-amber-600 dark:text-amber-400">{round + 1}/10</strong>
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {T.score}: <strong className="text-emerald-600 dark:text-emerald-400">{score}</strong>
          </span>
          {phase === "pick" && (
            <span className="text-sm text-rose-600 dark:text-rose-400 font-bold">
              {T.time}: {timeLeft}s
            </span>
          )}
        </div>

        {phase === "flash" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">{T.memorize}</p>
            <MiniGrid pattern={data.target} />
          </div>
        )}

        {phase === "pick" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6">
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">{T.pick}</p>
            <div className="grid grid-cols-2 gap-4">
              {data.options.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(o.correct)}
                  className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                >
                  <MiniGrid pattern={o.pattern} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
