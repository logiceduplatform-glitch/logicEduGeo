import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";

/** key = correct planet id */
const PLANETS = {
  mercury: { emoji: "☿️", el: "Ερμής", en: "Mercury" },
  venus: { emoji: "♀️", el: "Αφροδίτη", en: "Venus" },
  earth: { emoji: "🌍", el: "Γη", en: "Earth" },
  mars: { emoji: "♂️", el: "Άρης", en: "Mars" },
  jupiter: { emoji: "♃", el: "Δίας", en: "Jupiter" },
  saturn: { emoji: "🪐", el: "Κρόνος", en: "Saturn" },
  uranus: { emoji: "⛢", el: "Ουρανός", en: "Uranus" },
  neptune: { emoji: "♆", el: "Ποσειδώνας (πλανήτης)", en: "Neptune" },
};

const QUESTIONS = [
  {
    id: "q1",
    el: { text: "Ποιος πλανήτης είναι πιο κοντά στον Ήλιο;", fact: "Ο Ερμής ολοκληρώνει τροχιά σε ~88 ημέρες." },
    en: { text: "Which planet is closest to the Sun?", fact: "Mercury orbits the Sun in about 88 days." },
    correct: "mercury",
  },
  {
    id: "q2",
    el: { text: "Ποιος είναι ο πιο θερμός πλανήτης (επιφάνεια);", fact: "Η πυκνή ατμόσφαιρα της Αφροδίτης παγιδεύει θερμότητα." },
    en: { text: "Which planet is the hottest (surface)?", fact: "Venus’s thick atmosphere traps heat." },
    correct: "venus",
  },
  {
    id: "q3",
    el: { text: "Ποιος είναι ο μεγαλύτερος πλανήτης;", fact: "Ο Δίας είναι γίγαντας αερίων." },
    en: { text: "Which is the largest planet?", fact: "Jupiter is a gas giant." },
    correct: "jupiter",
  },
  {
    id: "q4",
    el: { text: "Ποιος πλανήτης φημίζεται για τα εντυπωσιακά δακτυλίδια του;", fact: "Και άλλοι γίγαντες έχουν δακτυλίδια, αλλά του Κρόνου είναι τα πιο γνωστά." },
    en: { text: "Which planet is famous for its spectacular rings?", fact: "Other giants have rings too, but Saturn’s are the most famous." },
    correct: "saturn",
  },
  {
    id: "q5",
    el: { text: "Ποιος είναι ο «κόκκινος πλανήτης»;", fact: "Οξείδιο του σιδήρου δίνει κοκκινωπή απόχρωση." },
    en: { text: "Which is the “Red Planet”?", fact: "Iron oxide gives it a reddish color." },
    correct: "mars",
  },
  {
    id: "q6",
    el: { text: "Σε ποιον πλανήτη ζούμε;", fact: "Η μόνη γνωστή ζωή στο ηλιακό μας σύστημα." },
    en: { text: "Which planet do we live on?", fact: "The only known life in our solar system." },
    correct: "earth",
  },
  {
    id: "q7",
    el: { text: "Ποιος είναι ο πιο μακρινός από τους οκτώ κλασικούς πλανήτες;", fact: "Παγωμένος γίγαντας αερίων." },
    en: { text: "Which is farthest of the eight classical planets?", fact: "An icy gas giant." },
    correct: "neptune",
  },
  {
    id: "q8",
    el: { text: "Ποιος πλανήτης έχει τη Μεγάλη Ερυθρά Κηλίδα;", fact: "Καταιγίδα μεγαλύτερη από τη Γη!" },
    en: { text: "Which planet has the Great Red Spot?", fact: "A storm larger than Earth!" },
    correct: "jupiter",
  },
  {
    id: "q9",
    el: { text: "Ποιος πλανήτης «γέρνει» πολύ στον άξονά του και «κυλάει» σχεδόν στο πλάι;", fact: "Μοναδική κλίση ~98°." },
    en: { text: "Which planet is tilted almost on its side?", fact: "Unique ~98° axial tilt." },
    correct: "uranus",
  },
  {
    id: "q10",
    el: { text: "Ποιος είναι ο μικρότερος πλανήτης του ηλιακού συστήματος;", fact: "Λιγότερο από τη Γη σε διάμετρο." },
    en: { text: "Which is the smallest planet in the solar system?", fact: "Smaller in diameter than Earth." },
    correct: "mercury",
  },
  {
    id: "q11",
    el: { text: "Ποιος πλανήτης έχει την πιο πυκνή ατμόσφαιρα από τους εσωτερικούς «βραχώδεις» γείτονές μας;", fact: "Πίεση επιφάνειας τεράστια." },
    en: { text: "Which inner rocky neighbor has the densest atmosphere?", fact: "Crushing surface pressure." },
    correct: "venus",
  },
  {
    id: "q12",
    el: { text: "Ποιος πλανήτης έχει τον μεγαλύτερο ηφαίστειο (Όλυμπος Άρη);", fact: "Ύψος ~22 χλμ." },
    en: { text: "Which planet has Olympus Mons, a huge volcano?", fact: "About 22 km tall." },
    correct: "mars",
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

function pickOptions(correctKey, allKeys, lang) {
  const wrong = shuffle(allKeys.filter((k) => k !== correctKey)).slice(0, 3);
  const keys = shuffle([correctKey, ...wrong]);
  return keys.map((k) => ({
    key: k,
    emoji: PLANETS[k].emoji,
    label: PLANETS[k][lang === "el" ? "el" : "en"],
  }));
}

export default function SpaceExplorerGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const L = isEl ? "el" : "en";
  const TOTAL = 10;
  const startRef = useRef(Date.now());

  const [deckKey, setDeckKey] = useState(0);
  const deck = useMemo(() => shuffle([...QUESTIONS]).slice(0, TOTAL), [deckKey]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [picked, setPicked] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const allPlanetKeys = useMemo(() => Object.keys(PLANETS), []);
  const q = deck[index];
  const options = useMemo(() => (q ? pickOptions(q.correct, allPlanetKeys, L) : []), [q, allPlanetKeys, L]);

  const restartSoft = useCallback(() => {
    startRef.current = Date.now();
    setDeckKey((k) => k + 1);
    setIndex(0);
    setScore(0);
    setGameOver(false);
    setPicked(null);
    setShowResult(false);
  }, []);

  useEffect(() => {
    startRef.current = Date.now();
  }, [deckKey]);

  const handlePick = useCallback(
    (key) => {
      if (showResult || !q) return;
      setPicked(key);
      setShowResult(true);
      const correct = key === q.correct;
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        if (index + 1 >= TOTAL) {
          setGameOver(true);
        } else {
          setIndex((i) => i + 1);
          setPicked(null);
          setShowResult(false);
        }
      }, difficulty >= 2 ? 1400 : 900);
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
          <p className="text-6xl mb-4">🚀</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Εξερεύνηση διαστήματος" : "Space Explorer"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {score}/{TOTAL}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={restartSoft}
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

  const copy = q[L];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? `Ερώτηση ${index + 1}/${TOTAL}` : `Question ${index + 1}/${TOTAL}`}
        </p>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-4">
          {copy.text}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6 rounded-lg bg-slate-100 dark:bg-slate-700/60 p-3">
          💡 {copy.fact}
        </p>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-3">
          {isEl ? "Διάλεξε πλανήτη:" : "Pick the planet:"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isCorrect = showResult && opt.key === q.correct;
            const isWrong = showResult && picked === opt.key && opt.key !== q.correct;
            return (
              <button
                key={opt.key}
                type="button"
                disabled={showResult}
                onClick={() => handlePick(opt.key)}
                className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all hover:scale-[1.02] disabled:cursor-default ${
                  isCorrect
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40"
                    : isWrong
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-900/40"
                      : "border-slate-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-700/40"
                }`}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{opt.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400">
          {isEl ? `Σκορ: ${score}` : `Score: ${score}`}
        </p>
      </div>
    </div>
  );
}
