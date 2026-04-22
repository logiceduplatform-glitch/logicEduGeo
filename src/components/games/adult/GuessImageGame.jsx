import React, { useState, useEffect, useCallback, useMemo } from "react";

const ITEMS = [
  { emoji: "🍎", answers: { el: ["Μήλο", "Μήλο", "Μήλο", "Μήλο"], en: ["Apple", "Apple", "Apple", "Apple"] } },
  { emoji: "🚀", answers: { el: ["Ρακέτα", "Ρακέτα", "Ρακέτα", "Ρακέτα"], en: ["Rocket", "Rocket", "Rocket", "Rocket"] } },
  { emoji: "🏠", answers: { el: ["Σπίτι", "Σπίτι", "Σπίτι", "Σπίτι"], en: ["House", "House", "House", "House"] } },
  { emoji: "🌙", answers: { el: ["Φεγγάρι", "Φεγγάρι", "Φεγγάρι", "Φεγγάρι"], en: ["Moon", "Moon", "Moon", "Moon"] } },
  { emoji: "🎸", answers: { el: ["Κιθάρα", "Κιθάρα", "Κιθάρα", "Κιθάρα"], en: ["Guitar", "Guitar", "Guitar", "Guitar"] } },
  { emoji: "🐱", answers: { el: ["Γάτα", "Γάτα", "Γάτα", "Γάτα"], en: ["Cat", "Cat", "Cat", "Cat"] } },
  { emoji: "🌈", answers: { el: ["Ουράνιο τόξο", "Ουράνιο τόξο", "Ουράνιο τόξο", "Ουράνιο τόξο"], en: ["Rainbow", "Rainbow", "Rainbow", "Rainbow"] } },
  { emoji: "⛵", answers: { el: ["Ιστιοφόρο", "Ιστιοφόρο", "Ιστιοφόρο", "Ιστιοφόρο"], en: ["Sailboat", "Sailboat", "Sailboat", "Sailboat"] } },
];

const BLUR_LEVELS = [20, 12, 6, 0];
const POINTS = [100, 75, 50, 25];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GuessImageGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [order, setOrder] = useState([]);
  const [selected, setSelected] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);

  useEffect(() => {
    setOrder(shuffle([...Array(ITEMS.length).keys()]));
  }, []);

  const current = order.length ? ITEMS[order[round]] : null;
  const correctAnswer = current ? current.answers[lang][0] : "";
  const allOptions = useMemo(() => {
    if (!current) return [];
    const wrongPool = ITEMS.filter((_, i) => order[round] !== i).map((it) => it.answers[lang][0]);
    const uniqueWrong = [...new Set(wrongPool)].filter((x) => x !== correctAnswer);
    return shuffle([correctAnswer, ...uniqueWrong.slice(0, 3)]);
  }, [current, round, lang, correctAnswer, order]);

  useEffect(() => {
    if (!roundComplete && stage < 3) {
      const t = setTimeout(() => setStage((s) => s + 1), 2500);
      return () => clearTimeout(t);
    }
  }, [stage, roundComplete]);

  const handleGuess = useCallback(
    (opt) => {
      if (roundComplete) return;
      setSelected(opt);
      setRoundComplete(true);
      const pts = POINTS[stage];
      if (opt === correctAnswer) setScore((s) => s + pts);
    },
    [roundComplete, stage, correctAnswer]
  );

  const handleNext = () => {
    if (round >= 7) {
      setRoundComplete(false);
      setRound(-1);
    } else {
      setRound((r) => r + 1);
      setStage(0);
      setSelected(null);
      setRoundComplete(false);
    }
  };

  const reset = () => {
    setOrder(shuffle([...Array(ITEMS.length).keys()]));
    setRound(0);
    setStage(0);
    setScore(0);
    setSelected(null);
    setRoundComplete(false);
  };

  const T = {
    title: isEl ? "Μάντεψε την Εικόνα" : "Guess the Image",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Πόντοι" : "Score",
    next: isEl ? "Επόμενο" : "Next",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες το παιχνίδι!" : "Congratulations! You completed the game!",
    correct: isEl ? "Σωστά!" : "Correct!",
    wrong: isEl ? "Λάθος!" : "Wrong!",
    guess: isEl ? "Τι είναι;" : "What is it?",
    earlier: isEl ? "Πιο νωρίς = περισσότεροι πόντοι!" : "Earlier guess = more points!",
  };

  if (order.length === 0 || !current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (round < 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-fuchsia-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🖼️ {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">{score}</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  const blur = BLUR_LEVELS[stage];
  const showResult = roundComplete && selected !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-fuchsia-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.earlier}</p>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1}/8</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Stage</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{stage + 1}/4</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <p className="text-center text-slate-500 dark:text-slate-400 mb-6">{T.guess}</p>
          <div className="flex justify-center mb-8">
            <div
              className="text-8xl sm:text-9xl transition-all duration-500 ease-out"
              style={{ filter: `blur(${blur}px)` }}
            >
              {current.emoji}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {allOptions.map((opt) => {
              const isChosen = selected === opt;
              const isCorrect = opt === correctAnswer;
              const reveal = showResult;

              return (
                <button
                  key={opt}
                  onClick={() => handleGuess(opt)}
                  disabled={roundComplete}
                  className={`
                    py-3 px-4 rounded-xl text-center font-medium transition text-sm sm:text-base
                    ${reveal && isCorrect ? "bg-emerald-500 dark:bg-emerald-600 text-white" : ""}
                    ${reveal && isChosen && !isCorrect ? "bg-red-500 dark:bg-red-600 text-white" : ""}
                    ${!roundComplete ? "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200" : ""}
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 text-center space-y-2">
              <p className={`text-lg font-semibold ${selected === correctAnswer ? "text-emerald-600" : "text-red-600"}`}>
                {selected === correctAnswer ? T.correct : T.wrong}
                {selected === correctAnswer && ` +${POINTS[stage]} pts`}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold transition"
              >
                {round >= 7 ? (isEl ? "Τέλος" : "Finish") : T.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
