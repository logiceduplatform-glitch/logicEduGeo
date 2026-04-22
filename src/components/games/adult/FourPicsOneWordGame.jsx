import React, { useState, useEffect, useCallback, useMemo } from "react";

// { emojis: [4], wordEl, wordEn }
const ROUNDS = [
  { emojis: ["🌊", "🏖️", "🐚", "🏄"], wordEl: "Παραλία", wordEn: "Beach" },
  { emojis: ["🎄", "🎅", "🎁", "⛄"], wordEl: "Χριστούγεννα", wordEn: "Christmas" },
  { emojis: ["☕", "🫖", "🍵", "🧊"], wordEl: "Ρόφημα", wordEn: "Drink" },
  { emojis: ["🍎", "🍊", "🍇", "🍌"], wordEl: "Φρούτα", wordEn: "Fruit" },
  { emojis: ["✈️", "🌍", "🧳", "🗺️"], wordEl: "Ταξίδι", wordEn: "Travel" },
  { emojis: ["🎸", "🥁", "🎤", "🎧"], wordEl: "Μουσική", wordEn: "Music" },
  { emojis: ["🌞", "🕶️", "🏖️", "🧴"], wordEl: "Καλοκαίρι", wordEn: "Summer" },
  { emojis: ["📚", "✏️", "🎒", "🏫"], wordEl: "Σχολείο", wordEn: "School" },
  { emojis: ["🐶", "🐱", "🐰", "🐦"], wordEl: "Ζώα", wordEn: "Animals" },
  { emojis: ["🍕", "🍔", "🍟", "🌮"], wordEl: "Φαγητό", wordEn: "Food" },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getLetters(word) {
  return word.toUpperCase().split("").filter((c) => c.trim());
}

export default function FourPicsOneWordGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [roundIndex, setRoundIndex] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = rounds[roundIndex];
  const word = current ? (isEl ? current.wordEl : current.wordEn) : "";
  const letterCount = word?.length || 0;

  useEffect(() => {
    setRounds(shuffle([...ROUNDS]).slice(0, 10));
  }, []);

  const decoyPool = isEl ? "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const decoys = useMemo(
    () =>
      current
        ? Array.from({ length: Math.max(0, 12 - letterCount) }, () => decoyPool[Math.floor(Math.random() * decoyPool.length)])
        : [],
    [current, letterCount, decoyPool]
  );
  const tiles = useMemo(
    () => (current ? shuffle([...getLetters(word), ...decoys]) : []),
    [current, word, decoys]
  );

  const handleTileClick = useCallback(
    (letter) => {
      if (!current || feedback !== null || gameOver) return;
      const target = word.split("");
      const next = [...selected, letter];
      if (next.length > target.length) return;
      setSelected(next);

      const attempt = next.join("");
      if (attempt === word || attempt.length === target.length) {
        const correct = attempt === word;
        setFeedback(correct);
        if (correct) setScore((s) => s + 100);
        setTimeout(() => {
          setFeedback(null);
          setSelected([]);
          if (roundIndex >= 9) {
            setGameOver(true);
          } else {
            setRoundIndex((r) => r + 1);
          }
        }, 1200);
      }
    },
    [current, word, selected, feedback, gameOver, roundIndex]
  );

  const handleRemove = useCallback(() => {
    if (selected.length === 0 || feedback !== null) return;
    setSelected((s) => s.slice(0, -1));
  }, [selected, feedback]);

  const reset = () => {
    setRoundIndex(0);
    setRounds(shuffle([...ROUNDS]).slice(0, 10));
    setSelected([]);
    setScore(0);
    setFeedback(null);
    setGameOver(false);
  };

  const T = {
    title: isEl ? "Τέσσερις Εικόνες Μία Λέξη" : "Four Pics One Word",
    round: isEl ? "Γύρος" : "Round",
    score: isEl ? "Πόντοι" : "Score",
    correct: isEl ? "Σωστά!" : "Correct!",
    wrong: isEl ? "Λάθος!" : "Wrong!",
    playAgain: isEl ? "Ξανά παίξτε" : "Play Again",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες το παιχνίδι!" : "Congratulations! You completed the game!",
    finalScore: isEl ? "Τελικό σκορ" : "Final score",
    delete: isEl ? "Διαγραφή" : "Delete",
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎉 {T.congrats}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            {T.finalScore}: <span className="font-bold text-amber-600 dark:text-amber-400">{score}</span>
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition shadow-lg"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.round}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{roundIndex + 1}/10</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.score}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{score}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {current.emojis.map((e, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl sm:text-5xl shadow-inner"
              >
                {e}
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-3">
            {isEl ? "Ποια λέξη συνδέει τις εικόνες;" : "What word connects the pictures?"}
          </p>

          <div className="flex justify-center gap-2 mb-4 min-h-[3rem]">
            {word.split("").map((_, i) => (
              <div
                key={i}
                className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg border-2 flex items-center justify-center text-lg sm:text-xl font-bold uppercase transition ${
                  selected[i]
                    ? "border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/40 text-slate-800 dark:text-slate-200"
                    : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                }`}
              >
                {selected[i] || ""}
              </div>
            ))}
          </div>

          {feedback !== null && (
            <p
              className={`text-center text-xl font-bold mb-4 ${
                feedback ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {feedback ? T.correct : T.wrong}
            </p>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
            {tiles.map((letter, i) => (
              <button
                key={`${letter}-${i}`}
                onClick={() => handleTileClick(letter)}
                disabled={feedback !== null}
                className="py-2 sm:py-3 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold hover:bg-amber-300 dark:hover:bg-amber-700 transition disabled:opacity-50"
              >
                {letter}
              </button>
            ))}
          </div>

          <button
            onClick={handleRemove}
            disabled={selected.length === 0 || feedback !== null}
            className="w-full py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 transition"
          >
            {T.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
