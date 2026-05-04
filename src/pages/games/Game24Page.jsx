import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: {
    title: "24 Game",
    desc: "Συνδύασε τους 4 αριθμούς με +, −, ×, ÷ για να φτιάξεις 24!",
    target: "Στόχος",
    new: "Νέοι αριθμοί",
    clear: "Καθάρισε",
    success: "🎉 Τα κατάφερες!",
    notEqual: "= {v} (όχι 24)",
    needAll: "Χρησιμοποίησε και τους 4 αριθμούς.",
    hint: "Δοκίμασε ξανά",
    score: "Λυμένα",
  },
  en: {
    title: "24 Game",
    desc: "Combine the 4 numbers with +, −, ×, ÷ to make 24!",
    target: "Target",
    new: "New numbers",
    clear: "Clear",
    success: "🎉 You did it!",
    notEqual: "= {v} (not 24)",
    needAll: "Use all 4 numbers.",
    hint: "Try again",
    score: "Solved",
  },
};

// Curated puzzles — all are guaranteed to have a solution to 24.
const PUZZLES = [
  [3, 3, 8, 8], [1, 5, 5, 5], [4, 4, 6, 8], [2, 3, 5, 12],
  [3, 7, 8, 8], [1, 2, 7, 7], [2, 5, 7, 8], [3, 8, 8, 9],
  [4, 6, 7, 9], [2, 4, 6, 8], [3, 4, 5, 6], [4, 4, 7, 8],
  [1, 3, 4, 6], [2, 2, 11, 11], [5, 5, 5, 1], [3, 3, 3, 8],
  [1, 4, 5, 6], [3, 6, 7, 8], [4, 5, 6, 7], [2, 3, 4, 5],
];

function pickPuzzle() {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
}

function safeEval(expr) {
  // Only digits, parentheses, +-*/, and whitespace allowed.
  if (!/^[\d+\-*/().\s]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict";return (${expr});`)();
    return typeof v === "number" && isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

function usedNumbers(expr) {
  const matches = expr.match(/\d+/g) || [];
  return matches.map(Number);
}

function multisetEqual(a, b) {
  if (a.length !== b.length) return false;
  const ca = [...a].sort((x, y) => x - y);
  const cb = [...b].sort((x, y) => x - y);
  return ca.every((v, i) => v === cb[i]);
}

export default function Game24Page() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [puzzle, setPuzzle] = useState(pickPuzzle);
  const [expr, setExpr] = useState("");
  const [solved, setSolved] = useState(0);
  const [feedback, setFeedback] = useState("");

  const newPuzzle = useCallback(() => {
    setPuzzle(pickPuzzle());
    setExpr("");
    setFeedback("");
  }, []);

  const append = (s) => setExpr((e) => e + s);
  const backspace = () => setExpr((e) => e.slice(0, -1));
  const clear = () => { setExpr(""); setFeedback(""); };

  const evaluate = useCallback(() => {
    if (!expr.trim()) return;
    const used = usedNumbers(expr);
    if (!multisetEqual(used, puzzle)) {
      setFeedback(l.needAll);
      return;
    }
    const v = safeEval(expr);
    if (v === null) {
      setFeedback(l.hint);
      return;
    }
    if (Math.abs(v - 24) < 0.0001) {
      setFeedback(l.success);
      setSolved((n) => n + 1);
      setTimeout(newPuzzle, 1200);
    } else {
      setFeedback(l.notEqual.replace("{v}", String(v)));
    }
  }, [expr, puzzle, l, newPuzzle]);

  return (
    <GameShell title={l.title} description={l.desc} emoji="🔢" canonical="/games/24">
      <div className="flex justify-between items-center mb-3">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg px-3 py-1.5 text-center">
          <div className="text-[10px] uppercase text-emerald-700 dark:text-emerald-300">{l.target}</div>
          <div className="font-extrabold text-2xl text-emerald-700 dark:text-emerald-300">24</div>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg px-3 py-1.5 text-center">
          <div className="text-[10px] uppercase text-amber-700 dark:text-amber-300">{l.score}</div>
          <div className="font-extrabold text-amber-700 dark:text-amber-300">{solved}</div>
        </div>
        <button onClick={newPuzzle} className="px-3 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm">{l.new}</button>
      </div>

      {/* Number tiles */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {puzzle.map((n, i) => (
          <button
            key={i}
            onClick={() => append(String(n))}
            className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-extrabold rounded-xl shadow hover:scale-105 active:scale-95"
          >
            {n}
          </button>
        ))}
      </div>

      {/* Expression display */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-lg px-3 py-3 text-2xl font-mono font-bold text-slate-800 dark:text-slate-100 text-center min-h-[3rem] mb-3 break-all">
        {expr || <span className="text-slate-400">…</span>}
      </div>

      {/* Operator buttons */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        {["+", "-", "*", "/", "(", ")"].map((op) => (
          <button
            key={op}
            onClick={() => append(op)}
            className="bg-blue-500 text-white text-xl font-bold rounded-lg p-2 hover:bg-blue-600"
          >
            {op === "*" ? "×" : op === "/" ? "÷" : op}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <button onClick={backspace} className="bg-slate-300 dark:bg-slate-600 font-bold rounded-lg p-2">⌫</button>
        <button onClick={clear} className="bg-rose-400 text-white font-bold rounded-lg p-2">{l.clear}</button>
        <button onClick={evaluate} className="bg-emerald-500 text-white font-bold rounded-lg p-2">=</button>
      </div>

      {feedback && (
        <div className="text-center font-bold text-slate-700 dark:text-slate-200">{feedback}</div>
      )}
    </GameShell>
  );
}
