import React, { useState, useEffect, useCallback } from "react";

const PUZZLES = [
  {
    id: 1,
    namesEl: ["Α", "Β", "Γ"],
    namesEn: ["A", "B", "C"],
    statementsEl: [
      "Ο Α λέει: Ο Β είναι ψεύτης.",
      "Ο Β λέει: Ο Γ λέει την αλήθεια.",
      "Ο Γ λέει: Ο Α είναι ψεύτης.",
    ],
    statementsEn: [
      "A says: B is a liar.",
      "B says: C tells the truth.",
      "C says: A is a liar.",
    ],
    truthTellers: [0],
  },
  {
    id: 2,
    namesEl: ["Άννα", "Μάρκος", "Χρήστος"],
    namesEn: ["Anna", "Bob", "Chris"],
    statementsEl: [
      "Η Άννα λέει: Ο Μάρκος λέει την αλήθεια.",
      "Ο Μάρκος λέει: Ο Χρήστος είναι ψεύτης.",
      "Ο Χρήστος λέει: Η Άννα είναι ψεύτρια.",
    ],
    statementsEn: [
      "Anna says: Bob tells the truth.",
      "Bob says: Chris is a liar.",
      "Chris says: Anna is a liar.",
    ],
    truthTellers: [0, 1],
  },
  {
    id: 3,
    namesEl: ["Δημήτρης", "Έλενα", "Φίλιππος"],
    namesEn: ["Dan", "Eve", "Frank"],
    statementsEl: [
      "Ο Δημήτρης λέει: Ακριβώς ένας λέει αλήθεια.",
      "Η Έλενα λέει: Ακριβώς δύο λένε αλήθεια.",
      "Ο Φίλιππος λέει: Όλοι λένε αλήθεια.",
    ],
    statementsEn: [
      "Dan says: Exactly one tells the truth.",
      "Eve says: Exactly two tell the truth.",
      "Frank says: Everyone tells the truth.",
    ],
    truthTellers: [0],
  },
  {
    id: 4,
    namesEl: ["Γιάννης", "Κατερίνα", "Λουκία", "Μιχάλης"],
    namesEn: ["John", "Kate", "Lucy", "Mike"],
    statementsEl: [
      "Ο Γιάννης λέει: Η Κατερίνα λέει αλήθεια.",
      "Η Κατερίνα λέει: Ο Μιχάλης είναι ψεύτης.",
      "Η Λουκία λέει: Ο Γιάννης είναι ψεύτης.",
      "Ο Μιχάλης λέει: Η Λουκία λέει αλήθεια.",
    ],
    statementsEn: [
      "John says: Kate tells the truth.",
      "Kate says: Mike is a liar.",
      "Lucy says: John is a liar.",
      "Mike says: Lucy tells the truth.",
    ],
    truthTellers: [0, 1],
  },
  {
    id: 5,
    namesEl: ["Νίκος", "Όλγα", "Πέτρος"],
    namesEn: ["Nick", "Olga", "Paul"],
    statementsEl: [
      "Ο Νίκος λέει: Ο Πέτρος είναι ψεύτης.",
      "Η Όλγα λέει: Ο Νίκος λέει αλήθεια.",
      "Ο Πέτρος λέει: Η Όλγα είναι ψεύτρια.",
    ],
    statementsEn: [
      "Nick says: Paul is a liar.",
      "Olga says: Nick tells the truth.",
      "Paul says: Olga is a liar.",
    ],
    truthTellers: [2],
  },
  {
    id: 6,
    namesEl: ["Ρένα", "Στέφανος", "Τίνα"],
    namesEn: ["Rita", "Steve", "Tina"],
    statementsEl: [
      "Η Ρένα λέει: Ο Στέφανος είναι ψεύτης.",
      "Ο Στέφανος λέει: Η Τίνα λέει αλήθεια.",
      "Η Τίνα λέει: Η Ρένα και ο Στέφανος είναι αντίθετοι.",
    ],
    statementsEn: [
      "Rita says: Steve is a liar.",
      "Steve says: Tina tells the truth.",
      "Tina says: Rita and Steve are opposites.",
    ],
    truthTellers: [1, 2],
  },
];

export default function WhoTellsTruthGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);

  const p = PUZZLES[puzzleIndex];
  const names = isEl ? p.namesEl : p.namesEn;
  const statements = isEl ? p.statementsEl : p.statementsEn;
  const truthTellers = p.truthTellers;

  const T = {
    title: isEl ? "Ποιος Λέει Αλήθεια;" : "Who Tells the Truth?",
    hint: isEl ? "Κάθε άτομο λέει είτε πάντα αλήθεια είτε πάντα ψέματα. Βρες ποιοι λένε αλήθεια." : "Each person either always tells the truth or always lies. Find the truth-tellers.",
    truth: isEl ? "Αλήθεια" : "Truth",
    lie: isEl ? "Ψέμα" : "Lie",
    check: isEl ? "Έλεγχος" : "Check",
    next: isEl ? "Επόμενο" : "Next",
    prev: isEl ? "Προηγούμενο" : "Previous",
    correct: isEl ? "Σωστό!" : "Correct!",
    wrong: isEl ? "Λάθος" : "Wrong",
  };

  const toggleSelection = useCallback((idx, value) => {
    setSelections((s) => ({ ...s, [idx]: value }));
    setShowResult(false);
  }, []);

  const checkSolution = useCallback(() => {
    const expected = new Set(truthTellers);
    const actual = new Set(Object.keys(selections).filter((k) => selections[k] === "truth").map(Number));
    if (expected.size !== actual.size) {
      setCorrect(false);
    } else {
      setCorrect([...expected].every((i) => actual.has(i)));
    }
    setShowResult(true);
  }, [selections, truthTellers]);

  useEffect(() => {
    setSelections({});
    setShowResult(false);
  }, [puzzleIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50/50 to-sky-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.hint}</p>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setPuzzleIndex((i) => Math.max(0, i - 1))}
            disabled={puzzleIndex === 0}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition"
          >
            {T.prev}
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {puzzleIndex + 1} / {PUZZLES.length}
          </span>
          <button
            onClick={() => setPuzzleIndex((i) => Math.min(PUZZLES.length - 1, i + 1))}
            disabled={puzzleIndex === PUZZLES.length - 1}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition"
          >
            {T.next}
          </button>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 sm:p-8">
          <div className="space-y-4 mb-6">
            {statements.map((stmt, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
              >
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">{stmt}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleSelection(i, "truth")}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${
                      selections[i] === "truth"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    }`}
                  >
                    ✓ {T.truth}
                  </button>
                  <button
                    onClick={() => toggleSelection(i, "lie")}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${
                      selections[i] === "lie"
                        ? "bg-rose-500 text-white"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                    }`}
                  >
                    ✗ {T.lie}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={checkSolution}
              className="px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg transition"
            >
              {T.check}
            </button>
          </div>

          {showResult && (
            <div
              className={`mt-6 p-4 rounded-xl font-semibold text-center ${
                correct
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
              }`}
            >
              {correct ? `✓ ${T.correct}` : `✗ ${T.wrong}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
