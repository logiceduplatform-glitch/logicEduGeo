import React, { useState, useEffect, useCallback } from "react";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🫐", "🥝", "🍑", "🍒", "🥭"];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RememberSequenceGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [phase, setPhase] = useState("idle"); // idle | show | guess
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [guess, setGuess] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const TOTAL_ROUNDS = 8;

  const getSequenceLength = useCallback((r) => Math.min(3 + r, 7), []);

  const startRound = useCallback(() => {
    const len = getSequenceLength(round);
    const pool = shuffle([...EMOJIS]).slice(0, len + 2);
    const seq = pool.slice(0, len);
    setSequence(seq);
    setOptions(shuffle([...pool]));
    setGuess([]);
    setPhase("show");
  }, [round, getSequenceLength]);

  useEffect(() => {
    if (phase === "idle" && round < TOTAL_ROUNDS) {
      startRound();
    }
  }, [phase, round, startRound]);

  useEffect(() => {
    if (phase !== "show") return;
    const t = setTimeout(() => setPhase("guess"), 3000);
    return () => clearTimeout(t);
  }, [phase]);

  const handleOptionClick = useCallback(
    (emoji) => {
      if (phase !== "guess" || showWrong) return;
      const nextGuess = [...guess, emoji];
      setGuess(nextGuess);
      if (nextGuess.length === sequence.length) {
        const correct = nextGuess.every((e, i) => e === sequence[i]);
        if (correct) {
          setScore((s) => s + 1);
          if (round + 1 >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            setRound((r) => r + 1);
            setPhase("idle");
          }
        } else {
          setShowWrong(true);
          setTimeout(() => {
            setShowWrong(false);
            if (round + 1 >= TOTAL_ROUNDS) {
              setGameOver(true);
            } else {
              setRound((r) => r + 1);
              setPhase("idle");
            }
          }, 800);
        }
      }
    },
    [phase, guess, sequence, round, showWrong]
  );

  const T = {
    title: isEl ? "Ανάγνωση Ακολουθίας" : "Remember Sequence",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Βαθμολογία" : "Score",
    watch: isEl ? "Παρατήρησε την ακολουθία..." : "Watch the sequence...",
    select: isEl ? "Επέλεξε τη σωστή σειρά" : "Select the correct order",
    wrong: isEl ? "Λάθος!" : "Wrong!",
    finalScore: isEl ? "Τελική βαθμολογία" : "Final Score",
    playAgain: isEl ? "Παίξτε ξανά" : "Play Again",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{T.finalScore}</h1>
          <div className="text-5xl font-bold text-violet-600 dark:text-violet-400 mb-8">{score} / {TOTAL_ROUNDS}</div>
          <button
            onClick={() => {
              setRound(0);
              setScore(0);
              setGameOver(false);
              setShowWrong(false);
              setPhase("idle");
            }}
            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1} / {TOTAL_ROUNDS}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-xl p-6 min-h-[280px]">
          {phase === "show" && (
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-6">{T.watch}</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {sequence.map((emoji, i) => (
                  <span key={i} className="text-4xl sm:text-5xl">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          )}

          {phase === "guess" && (
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-center">
                {showWrong ? <span className="text-rose-500 dark:text-rose-400 font-semibold">{T.wrong}</span> : T.select}
              </p>
              <div className="flex gap-2 mb-4 min-h-[3rem] flex-wrap justify-center">
                {guess.map((e, i) => (
                  <span key={i} className="text-2xl">{e}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {options.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(emoji)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-violet-200 dark:hover:bg-violet-800 text-2xl sm:text-3xl transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
