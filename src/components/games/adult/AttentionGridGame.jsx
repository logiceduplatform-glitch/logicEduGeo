import React, { useState, useCallback, useMemo, useEffect } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function buildGrid() {
  const cells = [];
  for (let i = 0; i < 25; i++) cells.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  return cells;
}

function countLetter(grid, letter) {
  return grid.filter((c) => c === letter).length;
}

function makeChoices(correct) {
  const set = new Set([correct]);
  while (set.size < 4) {
    const d = correct + (Math.floor(Math.random() * 5) - 2);
    if (d >= 0 && d <= 12) set.add(d);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

export default function AttentionGridGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("memorize");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState(() => buildGrid());
  const [targetLetter, setTargetLetter] = useState("A");
  const [choices, setChoices] = useState([0, 1, 2, 3]);
  const [memSeconds, setMemSeconds] = useState(3);

  const T = useMemo(
    () => ({
      title: isEl ? "Πλέγμα προσοχής" : "Attention grid",
      instructions: isEl
        ? "Θα δεις πλέγμα 5×5 με γράμματα για 3 δευτερόλεπτα. Μετά ρωτάμε πόσες φορές εμφανίστηκε ένα συγκεκριμένο γράμμα. 10 γύροι."
        : "You will see a 5×5 letter grid for 3 seconds. Then answer how many times a given letter appeared. 10 rounds.",
      start: isEl ? "Έναρξη" : "Start",
      memorize: isEl ? "Μνημόνευσε…" : "Memorize…",
      question: isEl ? "Πόσες φορές εμφανίστηκε το γράμμα" : "How many times did the letter",
      appear: isEl ? ";" : "appear?",
      round: isEl ? "Γύρος" : "Round",
      score: isEl ? "Βαθμοί" : "Score",
      gameOver: isEl ? "Τέλος" : "Game Over",
      finalScore: isEl ? "Τελική βαθμολογία" : "Final score",
      playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
    }),
    [isEl]
  );

  const newRound = useCallback(() => {
    const g = buildGrid();
    const t = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const c = countLetter(g, t);
    setGrid(g);
    setTargetLetter(t);
    setChoices(makeChoices(c));
    setPhase("memorize");
    setMemSeconds(3);
  }, []);

  const initGame = useCallback(() => {
    setStarted(true);
    setRound(0);
    setScore(0);
    setGameOver(false);
    const g = buildGrid();
    const t = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const c = countLetter(g, t);
    setGrid(g);
    setTargetLetter(t);
    setChoices(makeChoices(c));
    setPhase("memorize");
    setMemSeconds(3);
  }, []);

  useEffect(() => {
    if (!started || gameOver || phase !== "memorize") return;
    if (memSeconds <= 0) {
      setPhase("quiz");
      return;
    }
    const id = setTimeout(() => setMemSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [started, gameOver, phase, memSeconds]);

  const answer = useCallback(
    (n) => {
      if (phase !== "quiz" || gameOver) return;
      const correct = countLetter(grid, targetLetter);
      if (n === correct) setScore((s) => s + 1);
      if (round >= 9) {
        setGameOver(true);
        return;
      }
      setRound((r) => r + 1);
      newRound();
    },
    [phase, gameOver, grid, targetLetter, round, newRound]
  );

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🔤 {T.gameOver}</p>
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">🔤 {T.title}</h1>
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
        <div className="flex justify-center gap-6 mb-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {T.round}: <strong className="text-amber-600 dark:text-amber-400">{round + 1}/10</strong>
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {T.score}: <strong className="text-emerald-600 dark:text-emerald-400">{score}</strong>
          </span>
        </div>

        {phase === "memorize" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6">
            <p className="text-center text-slate-500 dark:text-slate-400 mb-2">
              {T.memorize} {memSeconds}s
            </p>
            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
              {grid.map((ch, i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center text-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "quiz" && (
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 text-center">
            <p className="text-lg text-slate-700 dark:text-slate-200 mb-6">
              {T.question} <span className="font-black text-2xl text-indigo-600 dark:text-indigo-400">{targetLetter}</span> {T.appear}
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {choices.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => answer(n)}
                  className="py-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-bold text-xl text-slate-800 dark:text-slate-100 transition"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
