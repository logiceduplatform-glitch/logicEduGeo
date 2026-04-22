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

function generateRound(difficulty) {
  const easyPercents = [10, 20, 25, 50, 75, 100];
  const harderPercents = [5, 12, 15, 18, 30, 40, 60];
  const percents = difficulty >= 2 ? [...easyPercents, ...harderPercents] : easyPercents;
  const p = percents[Math.floor(Math.random() * percents.length)];
  const maxBase = difficulty >= 2 ? 120 : 80;

  let base = 100;
  let answer = p;
  for (let tries = 0; tries < 80; tries++) {
    const b = Math.floor(Math.random() * (maxBase - 10)) + 10;
    const exact = (p * b) / 100;
    if (Math.abs(exact - Math.round(exact)) < 1e-6) {
      base = b;
      answer = Math.round(exact);
      break;
    }
  }

  const opts = new Set([answer]);
  while (opts.size < 4) {
    const off = Math.floor(Math.random() * 15) - 7 || 3;
    opts.add(Math.max(0, answer + off));
  }
  const choices = shuffle([...opts]);

  return { percent: p, base, answer, choices };
}

export default function PercentageCalcGame({ onComplete, difficulty = 1, lang = "el" }) {
  const isEl = lang === "el";
  const startRef = useRef(Date.now());
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [puzzle, setPuzzle] = useState(() => generateRound(difficulty));

  useEffect(() => {
    setPuzzle(generateRound(difficulty));
  }, [round, difficulty]);

  const restart = useCallback(() => {
    startRef.current = Date.now();
    setRound(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowResult(false);
    setPuzzle(generateRound(difficulty));
  }, [difficulty]);

  const pick = useCallback(
    (val) => {
      if (showResult || finished) return;
      setSelected(val);
      const correct = val === puzzle.answer;
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
    [showResult, finished, puzzle.answer, round]
  );

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">📊</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ποσοστά" : "Percentages"}
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

  const question = isEl
    ? `Ποιο είναι το ${puzzle.percent}% του ${puzzle.base};`
    : `What is ${puzzle.percent}% of ${puzzle.base}?`;
  const correct = selected === puzzle.answer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 md:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? "Γύρος" : "Round"} {round + 1}/{TOTAL}
        </p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center leading-snug">
          {question}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {puzzle.choices.map((c) => {
            const isSel = selected === c;
            const showCorrect = showResult && c === puzzle.answer;
            const showWrong = showResult && isSel && c !== puzzle.answer;
            return (
              <button
                key={c}
                type="button"
                disabled={showResult}
                onClick={() => pick(c)}
                className={`py-4 rounded-xl text-lg font-semibold transition-colors ${
                  showCorrect
                    ? "bg-emerald-500 text-white"
                    : showWrong
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-violet-100 dark:hover:bg-slate-600"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {showResult && (
          <p className="text-center mt-4 text-slate-600 dark:text-slate-400">
            {correct
              ? isEl
                ? "Σωστά!"
                : "Correct!"
              : isEl
                ? `Σωστή απάντηση: ${puzzle.answer}`
                : `Correct answer: ${puzzle.answer}`}
          </p>
        )}
      </div>
    </div>
  );
}
