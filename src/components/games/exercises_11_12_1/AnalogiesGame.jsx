import React, { useState, useCallback, useEffect, useRef } from "react";

const TOTAL = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** @type {{ stemEl: string; stemEn: string; options: { el: string; en: string }[]; answerEl: string }[]} */
const BANK = [
  {
    stemEl: "Ζεστό προς Κρύο, όπως Πάνω προς ___;",
    stemEn: "Hot is to Cold as Up is to ___?",
    options: [
      { el: "Κάτω", en: "Down" },
      { el: "Αριστερά", en: "Left" },
      { el: "Μεγάλο", en: "Big" },
      { el: "Γρήγορα", en: "Fast" },
    ],
    answerEl: "Κάτω",
  },
  {
    stemEl: "Ημέρα προς Νύχτα, όπως Ξύπνημα προς ___;",
    stemEn: "Day is to Night as Wake is to ___?",
    options: [
      { el: "Ύπνος", en: "Sleep" },
      { el: "Τρέξιμο", en: "Run" },
      { el: "Φαγητό", en: "Eat" },
      { el: "Ανάγνωση", en: "Read" },
    ],
    answerEl: "Ύπνος",
  },
  {
    stemEl: "Βιβλίο προς Ανάγνωση, όπως Φαγητό προς ___;",
    stemEn: "Book is to Reading as Food is to ___?",
    options: [
      { el: "Κατανάλωση", en: "Eating" },
      { el: "Ύπνος", en: "Sleeping" },
      { el: "Σχέδιο", en: "Drawing" },
      { el: "Τραγούδι", en: "Singing" },
    ],
    answerEl: "Κατανάλωση",
  },
  {
    stemEl: "Νερό προς Υγρό, όπως Πάγος προς ___;",
    stemEn: "Water is to Liquid as Ice is to ___?",
    options: [
      { el: "Στερεό", en: "Solid" },
      { el: "Αέριο", en: "Gas" },
      { el: "Ζεστό", en: "Warm" },
      { el: "Υγρό", en: "Wet" },
    ],
    answerEl: "Στερεό",
  },
  {
    stemEl: "Λιοντάρι προς Ζούγκλα, όπως Ψάρι προς ___;",
    stemEn: "Lion is to Jungle as Fish is to ___?",
    options: [
      { el: "Ωκεανός", en: "Ocean" },
      { el: "Έρημος", en: "Desert" },
      { el: "Ουρανός", en: "Sky" },
      { el: "Δάσος", en: "Forest" },
    ],
    answerEl: "Ωκεανός",
  },
  {
    stemEl: "Μολύβι προς Γραφή, όπως Πινέλο προς ___;",
    stemEn: "Pencil is to Writing as Brush is to ___?",
    options: [
      { el: "Ζωγραφική", en: "Painting" },
      { el: "Μαγείρεμα", en: "Cooking" },
      { el: "Τρέξιμο", en: "Running" },
      { el: "Μέτρηση", en: "Counting" },
    ],
    answerEl: "Ζωγραφική",
  },
  {
    stemEl: "Καρδιά προς Σώμα, όπως Μηχανή προς ___;",
    stemEn: "Heart is to Body as Engine is to ___?",
    options: [
      { el: "Αυτοκίνητο", en: "Car" },
      { el: "Τροχός", en: "Wheel" },
      { el: "Δρόμος", en: "Road" },
      { el: "Οδηγός", en: "Driver" },
    ],
    answerEl: "Αυτοκίνητο",
  },
  {
    stemEl: "Μήνας προς Έτος, όπως Ώρα προς ___;",
    stemEn: "Month is to Year as Hour is to ___?",
    options: [
      { el: "Ημέρα", en: "Day" },
      { el: "Εβδομάδα", en: "Week" },
      { el: "Λεπτό", en: "Minute" },
      { el: "Δευτερόλεπτο", en: "Second" },
    ],
    answerEl: "Ημέρα",
  },
  {
    stemEl: "Κλειδί προς Πόρτα, όπως Κωδικός προς ___;",
    stemEn: "Key is to Door as Password is to ___?",
    options: [
      { el: "Λογαριασμός", en: "Account" },
      { el: "Παράθυρο", en: "Window" },
      { el: "Καρέκλα", en: "Chair" },
      { el: "Βιβλίο", en: "Book" },
    ],
    answerEl: "Λογαριασμός",
  },
  {
    stemEl: "Ήλιος προς Φως, όπως Φεγγάρι προς ___;",
    stemEn: "Sun is to Light as Moon is to ___?",
    options: [
      { el: "Νύχτα", en: "Night" },
      { el: "Αστέρι", en: "Star" },
      { el: "Σύννεφο", en: "Cloud" },
      { el: "Βροχή", en: "Rain" },
    ],
    answerEl: "Νύχτα",
  },
  {
    stemEl: "Μαθητής προς Σχολείο, όπως Γιατρός προς ___;",
    stemEn: "Student is to School as Doctor is to ___?",
    options: [
      { el: "Νοσοκομείο", en: "Hospital" },
      { el: "Βιβλιοθήκη", en: "Library" },
      { el: "Κατάστημα", en: "Shop" },
      { el: "Πάρκο", en: "Park" },
    ],
    answerEl: "Νοσοκομείο",
  },
  {
    stemEl: "Χειμώνας προς Χιόνι, όπως Καλοκαίρι προς ___;",
    stemEn: "Winter is to Snow as Summer is to ___?",
    options: [
      { el: "Ζέστη", en: "Heat" },
      { el: "Βροχή", en: "Rain" },
      { el: "Άνεμος", en: "Wind" },
      { el: "Φύλλο", en: "Leaf" },
    ],
    answerEl: "Ζέστη",
  },
];

function buildRound(raw) {
  const opts = shuffle([...raw.options]);
  const answerEn = raw.options.find((o) => o.el === raw.answerEl)?.en ?? "";
  return {
    stemEl: raw.stemEl,
    stemEn: raw.stemEn,
    choices: opts,
    answerEl: raw.answerEl,
    answerEn,
  };
}

function pickQuestions(difficulty) {
  const source = difficulty >= 2 ? [...BANK] : BANK.slice(0, 10);
  const pool = shuffle(source);
  return pool.slice(0, TOTAL).map(buildRound);
}

export default function AnalogiesGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const startRef = useRef(Date.now());
  const [questions, setQuestions] = useState(() => pickQuestions(difficulty));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const current = questions[round];

  const restart = useCallback(() => {
    startRef.current = Date.now();
    setQuestions(pickQuestions(difficulty));
    setRound(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowResult(false);
  }, [difficulty]);

  useEffect(() => {
    if (questions.length === 0) setFinished(true);
  }, [questions.length]);

  const pick = useCallback(
    (opt) => {
      if (showResult || finished || !current) return;
      const selKey = `${opt.el}|${opt.en}`;
      setSelected(selKey);
      const correct = opt.el === current.answerEl;
      if (correct) setScore((s) => s + 1);
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setSelected(null);
        setRound((r) => {
          if (r + 1 >= TOTAL) {
            setFinished(true);
            return r;
          }
          return r + 1;
        });
      }, 750);
    },
    [showResult, finished, current, isEl]
  );

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">🔗</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Αναλογίες" : "Analogies"}
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
              onClick={() =>
                onComplete?.({
                  score,
                  total: TOTAL,
                  time: Math.floor((Date.now() - startRef.current) / 1000),
                })
              }
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              {isEl ? "Τέλος" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const stem = isEl ? current.stemEl : current.stemEn;
  const answerLabel = isEl ? current.answerEl : current.answerEn;
  const correctPick =
    selected &&
    current.choices.some((o) => `${o.el}|${o.en}` === selected && o.el === current.answerEl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 md:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? "Γύρος" : "Round"} {round + 1}/{TOTAL}
        </p>
        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center leading-relaxed">
          {stem}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {current.choices.map((c) => {
            const key = `${c.el}|${c.en}`;
            const isSel = selected === key;
            const showCorrect = showResult && c.el === current.answerEl;
            const showWrong = showResult && isSel && c.el !== current.answerEl;
            const text = isEl ? c.el : c.en;
            return (
              <button
                key={key}
                type="button"
                disabled={showResult}
                onClick={() => pick(c)}
                className={`py-4 rounded-xl text-base font-semibold transition-colors ${
                  showCorrect
                    ? "bg-emerald-500 text-white"
                    : showWrong
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-100 dark:hover:bg-slate-600"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
        {showResult && (
          <p className="text-center mt-4 text-slate-600 dark:text-slate-400">
            {correctPick
              ? isEl
                ? "Σωστά!"
                : "Correct!"
              : isEl
                ? `Σωστή απάντηση: ${answerLabel}`
                : `Correct answer: ${answerLabel}`}
          </p>
        )}
      </div>
    </div>
  );
}
