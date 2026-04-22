import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";

const ITEMS = [
  {
    id: "i1",
    el: { invention: "Τηλέφωνο", correct: "Alexander Graham Bell" },
    en: { invention: "Telephone", correct: "Alexander Graham Bell" },
    wrong: ["Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
  },
  {
    id: "i2",
    el: { invention: "Λαμπτήρας πυρακτώσεως (εμπορικά)", correct: "Thomas Edison" },
    en: { invention: "Practical incandescent light bulb", correct: "Thomas Edison" },
    wrong: ["Joseph Swan", "James Watt", "Michael Faraday"],
  },
  {
    id: "i3",
    el: { invention: "Τυπογραφική μηχανή με κινητά στοιχεία", correct: "Johannes Gutenberg" },
    en: { invention: "Movable-type printing press", correct: "Johannes Gutenberg" },
    wrong: ["William Caxton", "Aldus Manutius", "Francesco Griffo"],
  },
  {
    id: "i4",
    el: { invention: "Ασύρματο τηλέγραφο (ραδιοεπικοινωνία)", correct: "Guglielmo Marconi" },
    en: { invention: "Wireless telegraph (radio)", correct: "Guglielmo Marconi" },
    wrong: ["Heinrich Hertz", "Samuel Morse", "James Clerk Maxwell"],
  },
  {
    id: "i5",
    el: { invention: "Πενικιλλίνη", correct: "Alexander Fleming" },
    en: { invention: "Penicillin", correct: "Alexander Fleming" },
    wrong: ["Louis Pasteur", "Robert Koch", "Joseph Lister"],
  },
  {
    id: "i6",
    el: { invention: "Βελτιωμένη ατμομηχανή", correct: "James Watt" },
    en: { invention: "Improved steam engine", correct: "James Watt" },
    wrong: ["Thomas Newcomen", "George Stephenson", "Richard Trevithick"],
  },
  {
    id: "i7",
    el: { invention: "Μηχανή ελεγχόμενης πτήσης (αεροπλάνο)", correct: "Wright brothers" },
    en: { invention: "Powered, controlled airplane", correct: "Wright brothers" },
    wrong: ["Otto Lilienthal", "Alberto Santos-Dumont", "Louis Blériot"],
  },
  {
    id: "i8",
    el: { invention: "Παγκόσμιος Ιστός (WWW)", correct: "Tim Berners-Lee" },
    en: { invention: "World Wide Web", correct: "Tim Berners-Lee" },
    wrong: ["Vint Cerf", "Alan Turing", "Bill Gates"],
  },
  {
    id: "i9",
    el: { invention: "Θεωρία σχετικότητας (μοντέλα)", correct: "Albert Einstein" },
    en: { invention: "Theory of relativity (framework)", correct: "Albert Einstein" },
    wrong: ["Isaac Newton", "Max Planck", "Niels Bohr"],
  },
  {
    id: "i10",
    el: { invention: "Ηλεκτρική στοίβα (μπαταρία)", correct: "Alessandro Volta" },
    en: { invention: "Electric battery (voltaic pile)", correct: "Alessandro Volta" },
    wrong: ["Benjamin Franklin", "Luigi Galvani", "André-Marie Ampère"],
  },
  {
    id: "i11",
    el: { invention: "Τηλεσκόπιο (οπτικό, πρώιμο)", correct: "Galileo Galilei" },
    en: { invention: "Optical telescope (early pioneer)", correct: "Galileo Galilei" },
    wrong: ["Hans Lippershey", "Johannes Kepler", "Isaac Newton"],
  },
  {
    id: "i12",
    el: { invention: "Τηλέγραφος και κώδικας Morse", correct: "Samuel Morse" },
    en: { invention: "Telegraph and Morse code", correct: "Samuel Morse" },
    wrong: ["Charles Wheatstone", "Thomas Edison", "Guglielmo Marconi"],
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function optionsFor(item, L) {
  const correct = item.correct;
  const pool = item.wrong.map((w) => ({ key: w, label: w }));
  const correctLabel = item[L].correct;
  return shuffle([{ key: correct, label: correctLabel }, ...pool]);
}

export default function InventorQuizGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const L = isEl ? "el" : "en";
  const TOTAL = 10;
  const startRef = useRef(Date.now());

  const [deckKey, setDeckKey] = useState(0);
  const deck = useMemo(() => shuffle([...ITEMS]).slice(0, TOTAL), [deckKey]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [picked, setPicked] = useState(null);

  const item = deck[index];
  const options = useMemo(() => (item ? optionsFor(item, L) : []), [item, L]);

  useEffect(() => {
    startRef.current = Date.now();
  }, [deckKey]);

  const restart = useCallback(() => {
    startRef.current = Date.now();
    setDeckKey((k) => k + 1);
    setIndex(0);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setPicked(null);
  }, []);

  const handlePick = useCallback(
    (key) => {
      if (showResult || !item) return;
      setPicked(key);
      setShowResult(true);
      const correct = key === item.correct;
      if (correct) setScore((s) => s + 1);

      setTimeout(
        () => {
          if (index + 1 >= TOTAL) {
            setGameOver(true);
          } else {
            setIndex((i) => i + 1);
            setPicked(null);
            setShowResult(false);
          }
        },
        difficulty >= 2 ? 1300 : 800
      );
    },
    [showResult, item, index, difficulty]
  );

  const handleFinish = useCallback(() => {
    const time = Math.round((Date.now() - startRef.current) / 1000);
    onComplete?.({ score, total: TOTAL, time });
  }, [onComplete, score]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">💡</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Εφευρέτες & εφευρέσεις" : "Inventors & inventions"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {score}/{TOTAL}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={restart}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              {isEl ? "Ξαναπαίξε" : "Play Again"}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              {isEl ? "Τέλος" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? `Ερώτηση ${index + 1}/${TOTAL}` : `Question ${index + 1}/${TOTAL}`}
        </p>
        <div className="rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 p-4 mb-6 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300 mb-1">
            {isEl ? "Εφεύρεση" : "Invention"}
          </p>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{item[L].invention}</p>
        </div>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-4">
          {isEl ? "Ποιος/ποιοι το συνδέουμε πιο συχνά;" : "Who do we most often associate with it?"}
        </p>
        <div className="grid gap-3">
          {options.map((opt) => {
            const isCorrect = showResult && opt.key === item.correct;
            const isWrong = showResult && picked === opt.key && opt.key !== item.correct;
            return (
              <button
                key={opt.label}
                type="button"
                disabled={showResult}
                onClick={() => handlePick(opt.key)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 font-medium transition-all ${
                  isCorrect
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100"
                    : isWrong
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100"
                      : "border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500 bg-slate-50 dark:bg-slate-700/40 text-slate-800 dark:text-slate-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          {isEl ? `Σκορ: ${score}` : `Score: ${score}`}
        </p>
      </div>
    </div>
  );
}
