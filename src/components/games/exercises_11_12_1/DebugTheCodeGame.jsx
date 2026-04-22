import React, { useState, useCallback, useEffect, useRef } from "react";

const TOTAL = 8;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** @type {{ bugLine: number; linesEl: string[]; linesEn: string[] }[]} */
const BANK = [
  {
    bugLine: 2,
    linesEl: [
      "1: sum = 0",
      "2: για i από 1 μέχρι 9",
      "3:   sum = sum + i",
      "4: τέλος για",
    ],
    linesEn: ["1: sum = 0", "2: for i from 1 to 9", "3:   sum = sum + i", "4: end for"],
  },
  {
    bugLine: 3,
    linesEl: ["1: i = 1", "2: όσο i <= 5", "3:   i = i - 1", "4: τέλος όσο"],
    linesEn: ["1: i = 1", "2: while i <= 5", "3:   i = i - 1", "4: end while"],
  },
  {
    bugLine: 1,
    linesEl: ["1: αν x = 5 τότε", "2:   εκτύπωσε \"ναι\"", "3: αλλιώς", "4:   εκτύπωσε \"όχι\""],
    linesEn: ["1: if x = 5 then", "2:   print \"yes\"", "3: else", "4:   print \"no\""],
  },
  {
    bugLine: 3,
    linesEl: ["1: a = 10", "2: b = 3", "3: αποτέλεσμα = a - b * 2", "4: εκτύπωσε αποτέλεσμα"],
    linesEn: ["1: a = 10", "2: b = 3", "3: result = a - b * 2", "4: print result"],
  },
  {
    bugLine: 4,
    linesEl: ["1: μέτρηση = 0", "2: επανάλαβε 5 φορές", "3:   μέτρηση = μέτρηση + 1", "4: μέχρι μέτρηση > 5"],
    linesEn: ["1: count = 0", "2: repeat 5 times", "3:   count = count + 1", "4: until count > 5"],
  },
  {
    bugLine: 2,
    linesEl: ["1: λίστα = [2, 4, 6]", "2: αν κάθε στοιχείο > 5", "3:   εκτύπωσε στοιχείο", "4: τέλος αν"],
    linesEn: ["1: list = [2, 4, 6]", "2: if every item > 5", "3:   print item", "4: end if"],
  },
  {
    bugLine: 3,
    linesEl: ["1: n = 10", "2: όσο n > 0", "3:   n = n + 1", "4: τέλος όσο"],
    linesEn: ["1: n = 10", "2: while n > 0", "3:   n = n + 1", "4: end while"],
  },
  {
    bugLine: 2,
    linesEl: ["1: διάβασε ηλικία", "2: ηλικία = \"12\"", "3: αν ηλικία >= 13", "4:   εκτύπωσε \"έφηβος\""],
    linesEn: ["1: read age", "2: age = \"12\"", "3: if age >= 13", "4:   print \"teen\""],
  },
  {
    bugLine: 1,
    linesEl: ["1: μέγιστο = 0", "2: για κάθε τιμή σε πίνακα", "3:   αν τιμή > μέγιστο", "4:     μέγιστο = τιμή"],
    linesEn: ["1: max = 0", "2: for each value in array", "3:   if value > max", "4:     max = value"],
  },
  {
    bugLine: 3,
    linesEl: ["1: x = 5", "2: y = 10", "3: z = x + y", "4: εκτύπωσε z  @ χρειάζεται εμβαδόν x*y"],
    linesEn: ["1: x = 5", "2: y = 10", "3: z = x + y", "4: print z"],
  },
];

function cleanDisplayLines(lines) {
  return lines.map((s) => s.replace(/\s*@\s*.*$/, "").trim());
}

function buildPuzzle(raw, difficulty) {
  const n = raw.linesEl.length;
  const bug = raw.bugLine;
  const wrongPool = [];
  for (let i = 1; i <= n; i++) {
    if (i !== bug) wrongPool.push(i);
  }
  shuffle(wrongPool);
  const opts = shuffle([bug, wrongPool[0], wrongPool[1], wrongPool[2]]);
  return {
    bugLine: bug,
    linesEl: cleanDisplayLines(raw.linesEl),
    linesEn: cleanDisplayLines(raw.linesEn),
    choiceLines: opts,
  };
}

function pickRounds(difficulty) {
  const pool = shuffle([...BANK]);
  return pool.slice(0, TOTAL).map((r) => buildPuzzle(r, difficulty));
}

export default function DebugTheCodeGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const startRef = useRef(Date.now());
  const [rounds, setRounds] = useState(() => pickRounds(difficulty));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const current = rounds[round];

  const restart = useCallback(() => {
    startRef.current = Date.now();
    setRounds(pickRounds(difficulty));
    setRound(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowResult(false);
  }, [difficulty]);

  const pick = useCallback(
    (lineNum) => {
      if (showResult || finished || !current) return;
      setSelected(lineNum);
      const correct = lineNum === current.bugLine;
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
      }, 800);
    },
    [showResult, finished, current]
  );

  useEffect(() => {
    if (rounds.length === 0) setFinished(true);
  }, [rounds.length]);

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">🐛</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Διόρθωσε τον κώδικα" : "Debug the Code"}
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

  const lines = isEl ? current.linesEl : current.linesEn;
  const correctPick = selected === current.bugLine;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 md:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? "Γύρος" : "Round"} {round + 1}/{TOTAL}
        </p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          {isEl ? "Ποια γραμμή έχει το σφάλμα;" : "Which line has the bug?"}
        </h2>
        <pre className="text-sm md:text-base font-mono bg-slate-100 dark:bg-slate-900 rounded-xl p-4 mb-6 text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">
          {lines.join("\n")}
        </pre>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          {isEl ? "Διάλεξε αριθμό γραμμής:" : "Pick the line number:"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {current.choiceLines.map((ln) => {
            const isSel = selected === ln;
            const showCorrect = showResult && ln === current.bugLine;
            const showWrong = showResult && isSel && ln !== current.bugLine;
            return (
              <button
                key={ln}
                type="button"
                disabled={showResult}
                onClick={() => pick(ln)}
                className={`py-4 rounded-xl text-lg font-semibold transition-colors ${
                  showCorrect
                    ? "bg-emerald-500 text-white"
                    : showWrong
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-rose-100 dark:hover:bg-slate-600"
                }`}
              >
                {isEl ? `Γραμμή ${ln}` : `Line ${ln}`}
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
                ? `Το σφάλμα ήταν στη γραμμή ${current.bugLine}.`
                : `The bug was on line ${current.bugLine}.`}
          </p>
        )}
      </div>
    </div>
  );
}
