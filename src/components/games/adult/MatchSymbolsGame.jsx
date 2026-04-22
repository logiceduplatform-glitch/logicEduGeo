import React, { useState, useEffect, useCallback } from "react";

const SYMBOLS = "◆◇●○★☆■□▲△▪▫".split("");

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchSymbolsGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("memorize"); // memorize | select
  const [originalSymbols, setOriginalSymbols] = useState([]);
  const [allSymbols, setAllSymbols] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const count = Math.min(4 + round - 1, 8);

  const startRound = useCallback(() => {
    const pool = shuffle([...SYMBOLS]);
    const orig = pool.slice(0, count);
    const others = pool.slice(count, count * 2);
    const combined = shuffle([...orig, ...others]);
    setOriginalSymbols(orig);
    setAllSymbols(combined);
    setSelected([]);
    setPhase("memorize");
    setTimeout(() => setPhase("select"), 3000);
  }, [count]);

  const initGame = useCallback(() => {
    setRound(1);
    setScore(0);
    setGameOver(false);
    setOriginalSymbols([]);
    setAllSymbols([]);
    setSelected([]);
    setPhase("memorize");
  }, []);

  useEffect(() => {
    if (!gameOver && round >= 1) {
      const t = setTimeout(startRound, 200);
      return () => clearTimeout(t);
    }
  }, [round, gameOver]);

  const toggleSelect = useCallback(
    (sym) => {
      if (phase !== "select" || gameOver) return;
      setSelected((prev) =>
        prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
      );
    },
    [phase, gameOver]
  );

  const submitSelection = useCallback(() => {
    if (phase !== "select" || gameOver || selected.length === 0) return;
    const origSet = new Set(originalSymbols);
    let roundScore = 0;
    selected.forEach((s) => {
      if (origSet.has(s)) roundScore++;
      else roundScore--;
    });
    const missed = originalSymbols.filter((s) => !selected.includes(s));
    roundScore -= missed.length;
    setScore((sc) => Math.max(0, sc + roundScore));
    if (round >= 6) {
      setGameOver(true);
    } else {
      setRound((r) => r + 1);
    }
  }, [phase, gameOver, selected, originalSymbols, round]);

  const T = {
    title: isEl ? "Ταίριασμα Συμβόλων" : "Match Symbols",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Βαθμοί" : "Score",
    memorize: isEl ? "Θυμήσου τα σύμβολα..." : "Memorize the symbols...",
    select: isEl ? "Επίλεξε μόνο αυτά που είδες" : "Select only the ones you saw",
    submit: isEl ? "Υποβολή" : "Submit",
    gameOver: isEl ? "Τέλος" : "Game Over",
    finalScore: isEl ? "Τελική Βαθμολογία" : "Final Score",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">✨ {T.gameOver}</p>
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
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6 text-sm">
          {phase === "memorize" ? T.memorize : T.select}
        </p>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round}/6</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">{score}</span>
          </div>
        </div>

        {phase === "memorize" ? (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {originalSymbols.map((s, i) => (
              <div
                key={`${s}-${i}`}
                className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl text-slate-800 dark:text-slate-200"
              >
                {s}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {allSymbols.map((s, i) => {
                const isSel = selected.includes(s);
                return (
                  <button
                    key={`${s}-${i}`}
                    onClick={() => toggleSelect(s)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition
                      ${isSel ? "bg-emerald-500 dark:bg-emerald-600 ring-2 ring-emerald-300" : "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300"}
                    `}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="text-center">
              <button
                onClick={submitSelection}
                disabled={selected.length === 0}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
              >
                {T.submit}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
