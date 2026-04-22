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
  const useMulDiv = difficulty >= 2;
  const types = useMulDiv
    ? ["add", "sub", "mul", "div"]
    : ["add", "sub"];
  const type = types[Math.floor(Math.random() * types.length)];

  let display;
  let answer;

  if (type === "add") {
    answer = Math.floor(Math.random() * (useMulDiv ? 18 : 12)) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const sum = answer + b;
    display = { left: null, op: "+", right: b, result: sum };
  } else if (type === "sub") {
    const b = Math.floor(Math.random() * 8) + 1;
    answer = Math.floor(Math.random() * 12) + b + 2;
    const diff = answer - b;
    display = { left: null, op: "−", right: b, result: diff };
  } else if (type === "mul") {
    answer = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    display = { left: null, op: "×", right: b, result: answer * b };
  } else {
    const b = Math.floor(Math.random() * 7) + 2;
    answer = b * (Math.floor(Math.random() * 8) + 2);
    display = { left: null, op: "÷", right: b, result: answer / b };
  }

  const opts = new Set([answer]);
  while (opts.size < 4) {
    const delta = Math.floor(Math.random() * 7) - 3 || 2;
    opts.add(Math.max(0, answer + delta));
  }
  const choices = shuffle([...opts]);

  return { display, answer, choices };
}

function formatEquation(d) {
  const left = d.left == null ? "_" : d.left;
  return `${left} ${d.op} ${d.right} = ${d.result}`;
}

export default function EquationBalancerGame({ onComplete, difficulty = 1, lang = "el" }) {
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
      setShowResult(true);
      if (correct) setScore((s) => s + 1);
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
      }, 700);
    },
    [showResult, finished, puzzle.answer]
  );

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">⚖️</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ισορροπία εξισώσεων" : "Equation Balancer"}
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

  const eq = formatEquation(puzzle.display);
  const correct = selected === puzzle.answer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 md:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? "Γύρος" : "Round"} {round + 1}/{TOTAL}
        </p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {isEl ? "Βρες τον αριθμό που λείπει" : "Find the missing number"}
        </h2>
        <p className="text-3xl md:text-4xl font-mono font-bold text-center my-8 text-indigo-600 dark:text-indigo-400">
          {eq}
        </p>
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
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-indigo-100 dark:hover:bg-slate-600"
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
                ? `Η απάντηση ήταν ${puzzle.answer}.`
                : `The answer was ${puzzle.answer}.`}
          </p>
        )}
      </div>
    </div>
  );
}
