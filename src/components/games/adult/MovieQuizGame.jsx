import React, { useState, useCallback, useMemo } from "react";

const MOVIES = [
  { emojis: "🦁👑🌍", opts: { el: ["Ο Βασιλιάς των Λιονταριών", "Ζωούγκλ", "Μαδαγασκάρη", "Φανταστικά Ζώα"], en: ["The Lion King", "Zootopia", "Madagascar", "Fantastic Beasts"] }, ans: { el: "Ο Βασιλιάς των Λιονταριών", en: "The Lion King" } },
  { emojis: "🚢❄️💎", opts: { el: ["Τιτανικός", "Ποσειδώνας", "Κρουαζιέρα", "Μαύρη Πέτρα"], en: ["Titanic", "Poseidon", "The Love Boat", "Black Pearl"] }, ans: { el: "Τιτανικός", en: "Titanic" } },
  { emojis: "🧙‍♂️💍🌋", opts: { el: ["Ο Άρχοντας των Δαχτυλιδιών", "Χάρι Πότερ", "Νάρνια", "Ντουν"], en: ["The Lord of the Rings", "Harry Potter", "Narnia", "Dune"] }, ans: { el: "Ο Άρχοντας των Δαχτυλιδιών", en: "The Lord of the Rings" } },
  { emojis: "🕷️🕸️👦", opts: { el: ["Σπάιντερμαν", "Μπάτμαν", "Σούπερμαν", "Ανθρωπος Μυρμήγκι"], en: ["Spider-Man", "Batman", "Superman", "Ant-Man"] }, ans: { el: "Σπάιντερμαν", en: "Spider-Man" } },
  { emojis: "🤖🚗💨", opts: { el: ["Transformers", "Ταχύτητα & Οργή", "Μatrix", "Terminator"], en: ["Transformers", "Fast & Furious", "The Matrix", "Terminator"] }, ans: { el: "Transformers", en: "Transformers" } },
  { emojis: "👸❄️⛄", opts: { el: ["Ψυχρά κι Ανάποδα", "Χιονάτη", "Σταχτοπούτα", "Ραπουνζέλ"], en: ["Frozen", "Snow White", "Cinderella", "Tangled"] }, ans: { el: "Ψυχρά κι Ανάποδα", en: "Frozen" } },
  { emojis: "🦇🌃🃏", opts: { el: ["Σκοτεινός Ιππότης", "Σπάιντερμαν", "Ξεκλείδωτο", "Λέξι Λούθορ"], en: ["The Dark Knight", "Spider-Man", "Unbreakable", "Lex Luthor"] }, ans: { el: "Σκοτεινός Ιππότης", en: "The Dark Knight" } },
  { emojis: "🧊👨‍🔬💙", opts: { el: ["Breaking Bad", "Better Call Saul", "Dexter", "The Wire"], en: ["Breaking Bad", "Better Call Saul", "Dexter", "The Wire"] }, ans: { el: "Breaking Bad", en: "Breaking Bad" } },
  { emojis: "🦖🦕🏝️", opts: { el: ["Τζουράσικ Παρκ", "Κινγκ Κονγκ", "Γκοτζίλα", "Κρούντα"], en: ["Jurassic Park", "King Kong", "Godzilla", "Cloverfield"] }, ans: { el: "Τζουράσικ Παρκ", en: "Jurassic Park" } },
  { emojis: "🔫🍌🤪", opts: { el: ["Ντέσπισιμπλ Εγώ", "Οι Μινιονς", "Ρίο", "Ψυχρά κι Ανάποδα"], en: ["Despicable Me", "Minions", "Rio", "Frozen"] }, ans: { el: "Ντέσπισιμπλ Εγώ", en: "Despicable Me" } },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUNDS = 10;

export default function MovieQuizGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [order, setOrder] = useState(() => shuffleArr(MOVIES.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const current = MOVIES[order[round]];
  const correct = current.ans[isEl ? "el" : "en"];
  const options = useMemo(() => shuffleArr(current.opts[isEl ? "el" : "en"]), [round, isEl, current]);

  const initGame = useCallback(() => {
    setOrder(shuffleArr(MOVIES.map((_, i) => i)));
    setRound(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
  }, []);

  const pick = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (round >= ROUNDS - 1) {
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setSelected(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🎬 {isEl ? "Κουίζ ταινιών" : "Movie Quiz"}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {ROUNDS}
          </p>
          <button
            type="button"
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            {isEl ? "Ξαναπαίξτε" : "Play Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4 text-sm text-slate-500 dark:text-slate-400">
          <span>
            {isEl ? "Γύρος" : "Round"} {round + 1}/{ROUNDS}
          </span>
          <span>
            {isEl ? "Σκορ" : "Score"}: {score}
          </span>
        </div>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-2 text-sm">{isEl ? "Μαντέψτε την ταινία:" : "Guess the movie:"}</p>
        <p className="text-center text-5xl sm:text-6xl mb-8 tracking-wide">{current.emojis}</p>
        <div className="grid gap-3">
          {options.map((opt, i) => {
            const wrong = selected !== null && opt !== correct;
            const right = selected !== null && opt === correct;
            return (
              <button
                key={`${round}-${i}-${opt}`}
                type="button"
                disabled={selected !== null}
                onClick={() => pick(opt)}
                className={`w-full py-3 px-4 rounded-xl text-left font-medium transition border-2 text-sm sm:text-base ${
                  right
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                    : wrong
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 hover:border-indigo-400"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button
            type="button"
            onClick={next}
            className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            {round >= ROUNDS - 1 ? (isEl ? "Τέλος" : "Finish") : isEl ? "Επόμενο" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
