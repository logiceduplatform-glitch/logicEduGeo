import React, { useState, useEffect, useCallback } from "react";

const WORDS_EL = ["ΕΛΛΑΔΑ", "ΘΑΛΑΣΣΑ", "ΜΟΥΣΙΚΗ", "ΗΛΙΟΣ", "ΒΙΒΛΙΟ", "ΣΧΟΛΕΙΟ", "ΠΛΑΝΗΤΗΣ", "ΔΕΝΤΡΟ", "ΚΟΣΜΟΣ", "ΦΙΛΟΣ"];
const WORDS_EN = ["GUITAR", "PLANET", "CASTLE", "RHYTHM", "BRIDGE", "FOREST", "GARDEN", "SPIRIT", "WONDER", "TRAVEL"];

function shuffle(str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export default function WordScrambleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const words = isEl ? WORDS_EL : WORDS_EN;
  const [round, setRound] = useState(0);
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const pickWord = useCallback(() => {
    const w = words[round];
    setWord(w);
    setScrambled(shuffle(w));
    setGuess("");
    setHintUsed(false);
    setTimeLeft(30);
    setRoundComplete(false);
  }, [round, words]);

  useEffect(() => {
    pickWord();
  }, [pickWord]);

  useEffect(() => {
    if (roundComplete || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRoundComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [round, roundComplete, gameOver]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (roundComplete || gameOver) return;
    const g = guess.trim().toUpperCase();
    if (!g) return;
    const correct = g === word;
    setRoundComplete(true);
    if (correct) {
      const bonus = timeLeft > 0 ? Math.floor(timeLeft / 5) : 0;
      setScore((s) => s + 100 + (hintUsed ? 0 : 50) + bonus);
    }
  };

  const handleNext = () => {
    if (round >= 9) {
      setGameOver(true);
    } else {
      setRound((r) => r + 1);
    }
  };

  const handleHint = () => {
    if (!hintUsed && !roundComplete) {
      setGuess(word[0]);
      setHintUsed(true);
    }
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setGameOver(false);
    setRoundComplete(false);
  };

  const T = {
    title: isEl ? "Ανακατεμένα Γράμματα" : "Word Scramble",
    hint: isEl ? "Υπόδειξη" : "Hint",
    submit: isEl ? "Υποβολή" : "Submit",
    next: isEl ? "Επόμενο" : "Next",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Πόντοι" : "Score",
    timeLeft: isEl ? "Χρόνος" : "Time",
    correct: isEl ? "Σωστά!" : "Correct!",
    wrong: isEl ? "Λάθος!" : "Wrong!",
    correctWord: isEl ? "Η σωστή λέξη ήταν:" : "The correct word was:",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες όλους τους γύρους!" : "Congratulations! You completed all rounds!",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎉 {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{round + 1}/10</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.timeLeft}</span>
            <span className={`ml-2 font-semibold ${timeLeft <= 5 ? "text-red-600" : "text-slate-800 dark:text-slate-200"}`}>{timeLeft}s</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-2">
            {isEl ? "Ανακατέψε τις λέξεις:" : "Unscramble the word:"}
          </p>
          <p className="text-center text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 tracking-widest mb-6">
            {scrambled}
          </p>

          {roundComplete ? (
            <div className="text-center space-y-4">
              <p className={`text-2xl font-bold ${guess.trim().toUpperCase() === word ? "text-emerald-600" : "text-red-600"}`}>
                {guess.trim().toUpperCase() === word ? T.correct : T.wrong}
              </p>
              {guess.trim().toUpperCase() !== word && (
                <p className="text-slate-600 dark:text-slate-300">{T.correctWord} <span className="font-bold">{word}</span></p>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
              >
                {round >= 9 ? (isEl ? "Τέλος" : "Finish") : T.next}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder={isEl ? "Η λέξη σου..." : "Your guess..."}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 text-center text-lg uppercase tracking-widest focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleHint}
                  disabled={hintUsed}
                  className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {T.hint} {hintUsed && "✓"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  {T.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
