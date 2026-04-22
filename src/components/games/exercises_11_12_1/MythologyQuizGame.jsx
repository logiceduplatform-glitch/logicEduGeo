import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";

const QUESTIONS = [
  {
    id: "m1",
    el: { q: "Ποιος είναι ο θεός της θάλασσας στην ελληνική μυθολογία;" },
    en: { q: "Who is the god of the sea in Greek mythology?" },
    correct: "Poseidon",
    wrong: ["Zeus", "Hades", "Apollo"],
  },
  {
    id: "m2",
    el: { q: "Ποιος είναι ο βασιλιάς των θεών στον Όλυμπο;" },
    en: { q: "Who is the king of the gods on Mount Olympus?" },
    correct: "Zeus",
    wrong: ["Poseidon", "Hermes", "Ares"],
  },
  {
    id: "m3",
    el: { q: "Ποια θεά συνδέεται με τη σοφία και τον πόλεμο στρατηγικής;" },
    en: { q: "Which goddess is linked to wisdom and strategic warfare?" },
    correct: "Athena",
    wrong: ["Hera", "Artemis", "Demeter"],
  },
  {
    id: "m4",
    el: { q: "Ποιος θεός ταυτίζεται κυρίως με τον πόλεμο και τη μάχη;" },
    en: { q: "Which god is mainly associated with war and battle?" },
    correct: "Ares",
    wrong: ["Apollo", "Dionysus", "Hephaestus"],
  },
  {
    id: "m5",
    el: { q: "Ποιος ήρωας νίκησε τη Μέδουσα με καθρέφτη και σπαθί;" },
    en: { q: "Which hero defeated Medusa with a shield and sword?" },
    correct: "Perseus",
    wrong: ["Theseus", "Odysseus", "Achilles"],
  },
  {
    id: "m6",
    el: { q: "Πού κατοικούσαν οι δώδεκα μεγάλοι θεοί της ελληνικής μυθολογίας;" },
    en: { q: "Where did the twelve major Greek gods dwell?" },
    correct: "Mount Olympus",
    wrong: ["Delphi", "Crete", "Athens"],
  },
  {
    id: "m7",
    el: { q: "Ποιος θεός κυβερνά τον Κάτω Κόσμο;" },
    en: { q: "Which god rules the Underworld?" },
    correct: "Hades",
    wrong: ["Thanatos", "Cronus", "Erebus"],
  },
  {
    id: "m8",
    el: { q: "Ποια θεά συνδέεται συχνά με την αγάπη και την ομορφιά;" },
    en: { q: "Which goddess is often linked to love and beauty?" },
    correct: "Aphrodite",
    wrong: ["Hestia", "Nemesis", "Nike"],
  },
  {
    id: "m9",
    el: { q: "Ποιος ημίθεος ήρωας είναι διάσημος για τις δώδεκα άθλους του;" },
    en: { q: "Which demigod hero is famous for his twelve labors?" },
    correct: "Heracles (Hercules)",
    wrong: ["Jason", "Orpheus", "Bellerophon"],
  },
  {
    id: "m10",
    el: { q: "Ποιος μυθικός πολεμιστής ήταν ο «καλύτερος» στον Τρωικό Πόλεμο κατά την παράδοση;" },
    en: { q: "Which mythical warrior was considered the greatest in the Trojan War?" },
    correct: "Achilles",
    wrong: ["Hector", "Ajax", "Patroclus"],
  },
  {
    id: "m11",
    el: { q: "Ποιος θεός είναι ο ταχυδρόμος των θεών και προστάτης των ταξιδιωτών;" },
    en: { q: "Who is the messenger of the gods and patron of travelers?" },
    correct: "Hermes",
    wrong: ["Pan", "Helios", "Eros"],
  },
  {
    id: "m12",
    el: { q: "Ποια μάγισσα μετέτρεψε τους συντρόφους του Οδυσσέα σε χοίρους;" },
    en: { q: "Which enchantress turned Odysseus’s crew into pigs?" },
    correct: "Circe",
    wrong: ["Medea", "Calypso", "Sibyl"],
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

function buildOptions(question) {
  return shuffle([question.correct, ...question.wrong]);
}

export default function MythologyQuizGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const L = isEl ? "el" : "en";
  const TOTAL = 10;
  const startRef = useRef(Date.now());

  const [deckKey, setDeckKey] = useState(0);
  const deck = useMemo(() => shuffle([...QUESTIONS]).slice(0, TOTAL), [deckKey]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [picked, setPicked] = useState(null);

  const q = deck[index];
  const options = useMemo(() => (q ? buildOptions(q) : []), [q]);

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
    (opt) => {
      if (showResult || !q) return;
      setPicked(opt);
      setShowResult(true);
      const correct = opt === q.correct;
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
    [showResult, q, index, difficulty]
  );

  const handleFinish = useCallback(() => {
    const time = Math.round((Date.now() - startRef.current) / 1000);
    onComplete?.({ score, total: TOTAL, time });
  }, [onComplete, score]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">⚡</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Κουίζ μυθολογίας" : "Mythology Quiz"}
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

  if (!q) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? `Ερώτηση ${index + 1}/${TOTAL}` : `Question ${index + 1}/${TOTAL}`}
        </p>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-8">
          {q[L].q}
        </h1>
        <div className="grid gap-3">
          {options.map((opt) => {
            const isCorrect = showResult && opt === q.correct;
            const isWrong = showResult && picked === opt && opt !== q.correct;
            return (
              <button
                key={opt}
                type="button"
                disabled={showResult}
                onClick={() => handlePick(opt)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 font-medium transition-all ${
                  isCorrect
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100"
                    : isWrong
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100"
                      : "border-slate-200 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500 bg-slate-50 dark:bg-slate-700/40 text-slate-800 dark:text-slate-100"
                }`}
              >
                {opt}
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
