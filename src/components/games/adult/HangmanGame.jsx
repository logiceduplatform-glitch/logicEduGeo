import React, { useState, useEffect, useCallback } from "react";

const WORDS_EL = ["ΕΛΛΑΔΑ", "ΘΑΛΑΣΣΑ", "ΜΟΥΣΙΚΗ", "ΚΑΦΕΣ", "ΠΑΡΑΘΥΡΟ", "ΔΕΝΤΡΟ", "ΦΙΛΟΣ", "ΒΙΒΛΙΟ", "ΣΧΟΛΕΙΟ", "ΗΛΙΟΣ"];
const WORDS_EN = ["HOUSE", "MUSIC", "WATER", "BRAIN", "CHESS", "PIANO", "RIVER", "TABLE", "PHONE", "APPLE"];

const LETTERS_EL = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const LETTERS_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const HANGMAN_PARTS = [
  "M 15 90 L 15 15 L 55 15 L 55 25",
  "M 55 25 L 55 38",
  "M 55 52 L 55 72",
  "M 55 48 L 40 62",
  "M 55 48 L 70 62",
  "M 55 72 L 40 90",
  "M 55 72 L 70 90",
];

export default function HangmanGame({ lang = "el" }) {
  const isEl = lang === "el";
  const words = isEl ? WORDS_EL : WORDS_EN;
  const letters = isEl ? LETTERS_EL : LETTERS_EN;
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState(new Set());
  const [wrong, setWrong] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const pickWord = useCallback(() => {
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setGuessed(new Set());
    setWrong(0);
    setGameOver(false);
    setWon(false);
  }, [words]);

  useEffect(() => pickWord(), [pickWord]);

  const handleLetter = useCallback(
    (letter) => {
      if (gameOver) return;
      if (guessed.has(letter)) return;
      setGuessed((prev) => new Set([...prev, letter]));
      if (!word.includes(letter)) {
        setWrong((w) => {
          if (w >= 6) setGameOver(true);
          return w + 1;
        });
      }
    },
    [word, guessed, gameOver]
  );

  useEffect(() => {
    if (!word || gameOver) return;
    const allIn = [...word].every((c) => guessed.has(c));
    if (allIn) {
      setWon(true);
      setGameOver(true);
    }
  }, [word, guessed, gameOver]);

  const reset = () => pickWord();

  const T = {
    title: isEl ? "Κρεμάλα" : "Hangman",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    won: isEl ? "Κέρδισες! Συγχαρητήρια!" : "You won! Congratulations!",
    lost: isEl ? "Έχασες! Η λέξη ήταν:" : "You lost! The word was:",
    guess: isEl ? "Επίλεξε γράμμα" : "Guess a letter",
  };

  const displayWord = word
    ? [...word]
        .map((c) => (guessed.has(c) ? c : "_"))
        .join(" ")
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">{T.title}</h1>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 100 100" className="w-32 h-32 sm:w-40 sm:h-40 text-slate-700 dark:text-slate-300">
              {HANGMAN_PARTS.slice(0, wrong + 1).map((path, i) => (
                <path key={i} d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ))}
              {wrong >= 1 && (
                <circle cx="55" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </div>

          <p className="text-center text-2xl sm:text-3xl font-mono tracking-widest text-slate-800 dark:text-slate-100 mb-8 min-h-[2.5rem]">
            {displayWord}
          </p>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.guess}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[...letters].map((letter) => {
              const used = guessed.has(letter);
              const isWrong = used && !word.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => handleLetter(letter)}
                  disabled={gameOver || used}
                  className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold text-sm transition
                    ${used ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
                    ${isWrong ? "bg-red-400 dark:bg-red-600 text-white" : used ? "bg-amber-300 dark:bg-amber-600 text-slate-800 dark:text-slate-100" : "bg-slate-200 dark:bg-slate-600 hover:bg-amber-300 dark:hover:bg-amber-700 text-slate-800 dark:text-slate-200"}
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {gameOver && (
            <div className="text-center space-y-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50">
              <p className={`text-xl font-bold ${won ? "text-emerald-600" : "text-red-600"}`}>
                {won ? "🎉 " + T.won : "😔 " + T.lost}
              </p>
              {!won && <p className="text-lg font-mono">{word}</p>}
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
              >
                {T.playAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
