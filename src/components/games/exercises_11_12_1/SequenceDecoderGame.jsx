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

function uniqueChoices(answer, distractors, stringify) {
  const ansStr = stringify(answer);
  const opts = new Set([ansStr]);
  for (const d of distractors) opts.add(stringify(d));
  let n = 1;
  while (opts.size < 4) {
    const extra =
      typeof answer === "number"
        ? answer + n * (answer === 0 ? 1 : Math.sign(answer) || 1)
        : String.fromCharCode(answer.charCodeAt(0) + n);
    opts.add(stringify(extra));
    n += 1;
  }
  const arr = [...opts];
  if (arr.length > 4) {
    const wrong = arr.filter((x) => x !== ansStr);
    shuffle(wrong);
    return shuffle([ansStr, ...wrong.slice(0, 3)]);
  }
  return shuffle(arr);
}

function generateRound(difficulty) {
  const hard = difficulty >= 2;
  const types = hard ? ["arith", "arith", "geom", "fib", "letter"] : ["arith", "arith", "geom", "letter"];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === "arith") {
    const step = hard ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 4) + 2;
    const start = Math.floor(Math.random() * (hard ? 15 : 10)) + 1;
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const answer = start + 4 * step;
    const str = seq.join(", ") + ", ?";
    const choices = uniqueChoices(answer, [answer + step, answer - step, start], (x) => String(x));
    return { prompt: str, answerStr: String(answer), choices, numeric: true };
  }

  if (type === "geom") {
    const r = hard ? Math.floor(Math.random() * 3) + 2 : 2;
    const a = hard ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 5) + 2;
    const seq = [a, a * r, a * r * r, a * r ** 3];
    const answer = a * r ** 4;
    const str = seq.join(", ") + ", ?";
    const choices = uniqueChoices(answer, [answer + r, answer - a, a * r ** 2], (x) => String(x));
    return { prompt: str, answerStr: String(answer), choices, numeric: true };
  }

  if (type === "fib") {
    let x = Math.floor(Math.random() * 4) + 1;
    let y = Math.floor(Math.random() * 4) + 1;
    if (hard) {
      x += 2;
      y += 2;
    }
    const seq = [x, y, x + y, x + 2 * y];
    const answer = 2 * x + 3 * y;
    const str = seq.join(", ") + ", ?";
    const choices = uniqueChoices(answer, [x + 3 * y, x + y, y], (n) => String(n));
    return { prompt: str, answerStr: String(answer), choices, numeric: true };
  }

  // letter pattern — skip by 2 or 3
  const step = hard ? 3 : 2;
  const startCode = "A".charCodeAt(0) + Math.floor(Math.random() * (hard ? 8 : 10));
  const seq = [];
  for (let i = 0; i < 4; i++) {
    seq.push(String.fromCharCode(startCode + i * step));
  }
  const answer = String.fromCharCode(startCode + 4 * step);
  const str = seq.join(", ") + ", ?";
  const wrong1 = String.fromCharCode(startCode + 4 * step + 1);
  const wrong2 = String.fromCharCode(startCode + 4 * step - 1);
  const wrong3 = String.fromCharCode(startCode + 3 * step + 1);
  const choices = uniqueChoices(answer, [wrong1, wrong2, wrong3], (c) => c);
  return { prompt: str, answerStr: answer, choices, numeric: false };
}

export default function SequenceDecoderGame({ onComplete, difficulty = 1, lang = "el" }) {
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
      const correct = val === puzzle.answerStr;
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
      }, 700);
    },
    [showResult, finished, puzzle.answerStr]
  );

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-6xl mb-4">🔢</p>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Ακολουθίες" : "Sequences"}
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

  const title = isEl ? "Ποιος είναι ο επόμενος αριθμός ή χαρακτήρας;" : "What comes next?";
  const correct = selected === puzzle.answerStr;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 md:p-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {isEl ? "Γύρος" : "Round"} {round + 1}/{TOTAL}
        </p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
        <p className="text-2xl md:text-3xl font-mono font-bold text-center my-6 text-teal-600 dark:text-teal-400 tracking-wide">
          {puzzle.prompt}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {puzzle.choices.map((c) => {
            const isSel = selected === c;
            const showCorrect = showResult && c === puzzle.answerStr;
            const showWrong = showResult && isSel && c !== puzzle.answerStr;
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
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-teal-100 dark:hover:bg-slate-600"
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
                ? `Σωστή απάντηση: ${puzzle.answerStr}`
                : `Correct answer: ${puzzle.answerStr}`}
          </p>
        )}
      </div>
    </div>
  );
}
