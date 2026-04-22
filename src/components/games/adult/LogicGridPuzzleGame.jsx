import React, { useState, useEffect, useCallback } from "react";

const PUZZLES = [
  {
    id: 1,
    peopleEl: ["Άννα", "Μάρκος", "Χριστίνα"],
    peopleEn: ["Anna", "Bob", "Chris"],
    attrEl: ["γάτα", "σκύλος", "ψάρι"],
    attrEn: ["cat", "dog", "fish"],
    cluesEl: [
      "Η Άννα δεν έχει γάτα.",
      "Ο Μάρκος έχει σκύλο.",
      "Η Χριστίνα δεν έχει ψάρι.",
    ],
    cluesEn: [
      "Anna doesn't have a cat.",
      "Bob has a dog.",
      "Chris doesn't have a fish.",
    ],
    solution: { 0: 2, 1: 1, 2: 0 },
  },
  {
    id: 2,
    peopleEl: ["Δημήτρης", "Έλενα", "Φώτης"],
    peopleEn: ["Alex", "Beth", "Carl"],
    attrEl: ["κάστανο", "μπλε", "κόκκινο"],
    attrEn: ["brown", "blue", "red"],
    cluesEl: [
      "Ο Δημήτρης δεν φοράει κάστανο.",
      "Η Έλενα φοράει μπλε.",
      "Ο Φώτης δεν έχει κόκκινο.",
    ],
    cluesEn: [
      "Alex doesn't wear brown.",
      "Beth wears blue.",
      "Carl doesn't wear red.",
    ],
    solution: { 0: 1, 1: 0, 2: 2 },
  },
  {
    id: 3,
    peopleEl: ["Γιάννης", "Κατερίνα", "Λάζαρος", "Μαρία"],
    peopleEn: ["John", "Kate", "Leo", "Mary"],
    attrEl: ["πρωί", "μεσημέρι", "απόγευμα", "βράδυ"],
    attrEn: ["morning", "noon", "afternoon", "evening"],
    cluesEl: [
      "Ο Γιάννης δεν ξυπνάει το πρωί.",
      "Η Κατερίνα ξυπνάει το μεσημέρι.",
      "Ο Λάζαρος δεν ξυπνάει το απόγευμα.",
      "Η Μαρία ξυπνάει το βράδυ.",
    ],
    cluesEn: [
      "John doesn't wake in the morning.",
      "Kate wakes at noon.",
      "Leo doesn't wake in the afternoon.",
      "Mary wakes in the evening.",
    ],
    solution: { 0: 3, 1: 1, 2: 0, 3: 2 },
  },
  {
    id: 4,
    peopleEl: ["Όλγα", "Πέτρος", "Ραχήλ"],
    peopleEn: ["Olga", "Paul", "Ruth"],
    attrEl: ["πιάνο", "κιθάρα", "τραγούδι"],
    attrEn: ["piano", "guitar", "singing"],
    cluesEl: [
      "Η Όλγα δεν παίζει πιάνο.",
      "Ο Πέτρος παίζει κιθάρα.",
      "Η Ραχήλ δεν τραγουδά.",
    ],
    cluesEn: [
      "Olga doesn't play piano.",
      "Paul plays guitar.",
      "Ruth doesn't sing.",
    ],
    solution: { 0: 2, 1: 0, 2: 1 },
  },
  {
    id: 5,
    peopleEl: ["Στέφανος", "Τάσος", "Υβόννη", "Φραγκίσκος"],
    peopleEn: ["Steve", "Tom", "Ursula", "Frank"],
    attrEl: ["καφέ", "τσάι", "χυμός", "γάλα"],
    attrEn: ["coffee", "tea", "juice", "milk"],
    cluesEl: [
      "Ο Στέφανος δεν πίνει καφέ.",
      "Ο Τάσος πίνει τσάι.",
      "Η Υβόννη δεν πίνει χυμό.",
      "Ο Φραγκίσκος πίνει γάλα.",
    ],
    cluesEn: [
      "Steve doesn't drink coffee.",
      "Tom drinks tea.",
      "Ursula doesn't drink juice.",
      "Frank drinks milk.",
    ],
    solution: { 0: 2, 1: 0, 2: 3, 3: 1 },
  },
];

export default function LogicGridPuzzleGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [marks, setMarks] = useState({});
  const [showResult, setShowResult] = useState(false);

  const p = PUZZLES[puzzleIndex];
  const people = isEl ? p.peopleEl : p.peopleEn;
  const attrs = isEl ? p.attrEl : p.attrEn;
  const clues = isEl ? p.cluesEl : p.cluesEn;
  const solution = p.solution;

  const T = {
    title: isEl ? "Λογικό Πλέγμα" : "Logic Grid",
    clues: isEl ? "Ένδειξες" : "Clues",
    yes: "✓",
    no: "✗",
    check: isEl ? "Έλεγχος" : "Check",
    next: isEl ? "Επόμενο" : "Next",
    prev: isEl ? "Προηγούμενο" : "Previous",
    correct: isEl ? "Σωστό!" : "Correct!",
    wrong: isEl ? "Λάθος" : "Wrong",
    whoHas: isEl ? "Ποιος έχει τι;" : "Who has what?",
  };

  const markKey = (personIdx, attrIdx) => `${personIdx}-${attrIdx}`;

  const setMark = useCallback((personIdx, attrIdx, value) => {
    setMarks((m) => ({ ...m, [`${personIdx}-${attrIdx}`]: value }));
    setShowResult(false);
  }, []);

  const cycleMark = useCallback((personIdx, attrIdx) => {
    setMarks((m) => {
      const k = markKey(personIdx, attrIdx);
      const v = m[k];
      const next = v === "yes" ? "no" : v === "no" ? null : "yes";
      return next ? { ...m, [k]: next } : (() => { const n = { ...m }; delete n[k]; return n; })();
    });
    setShowResult(false);
  }, []);

  const checkSolution = useCallback(() => {
    let correct = true;
    for (let i = 0; i < people.length; i++) {
      const expected = solution[i];
      const actual = marks[markKey(i, expected)];
      if (actual !== "yes") correct = false;
    }
    setShowResult(true);
  }, [marks, people.length, solution]);

  const isCorrect = useCallback(() => {
    for (let i = 0; i < people.length; i++) {
      const expected = solution[i];
      if (marks[markKey(i, expected)] !== "yes") return false;
    }
    return true;
  }, [marks, people.length, solution]);

  useEffect(() => {
    setMarks({});
    setShowResult(false);
  }, [puzzleIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/50 to-fuchsia-50 dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">{T.whoHas}</p>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setPuzzleIndex((i) => Math.max(0, i - 1))}
            disabled={puzzleIndex === 0}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-500 transition"
          >
            {T.prev}
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {puzzleIndex + 1} / {PUZZLES.length}
          </span>
          <button
            onClick={() => setPuzzleIndex((i) => Math.min(PUZZLES.length - 1, i + 1))}
            disabled={puzzleIndex === PUZZLES.length - 1}
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-500 transition"
          >
            {T.next}
          </button>
        </div>

        <div className="mb-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{T.clues}:</h2>
          <ul className="space-y-2">
            {clues.map((c, i) => (
              <li key={i} className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{c}</li>
            ))}
          </ul>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full rounded-xl bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="p-2 text-left text-slate-600 dark:text-slate-300 font-semibold w-24"></th>
                  {attrs.map((a, i) => (
                    <th key={i} className="p-2 text-center text-slate-600 dark:text-slate-300 font-semibold min-w-[4rem]">
                      {a}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {people.map((person, pi) => (
                  <tr key={pi} className="border-t border-slate-200 dark:border-slate-600">
                    <td className="p-2 font-medium text-slate-700 dark:text-slate-300">{person}</td>
                    {attrs.map((_, ai) => {
                      const mk = marks[markKey(pi, ai)];
                      return (
                        <td key={ai} className="p-1">
                          <button
                            onClick={() => cycleMark(pi, ai)}
                            className={`w-full min-w-[3rem] py-2 rounded-lg font-bold transition
                              ${mk === "yes" ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""}
                              ${mk === "no" ? "bg-rose-400 dark:bg-rose-600 text-white hover:bg-rose-500 dark:hover:bg-rose-500" : ""}
                              ${!mk ? "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600" : ""}`}
                          >
                            {mk === "yes" ? "✓" : mk === "no" ? "✗" : "?"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={checkSolution}
            className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-lg transition"
          >
            {T.check}
          </button>
        </div>

        {showResult && (
          <div
            className={`mt-4 p-4 rounded-xl font-semibold text-center ${
              isCorrect()
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
            }`}
          >
            {isCorrect() ? `✓ ${T.correct}` : `✗ ${T.wrong}`}
          </div>
        )}
      </div>
    </div>
  );
}
