import React, { useState, useCallback } from "react";

// expr tree: { t:'val', v:bool } | { t:'not', a } | { t:'and'|'or', left, right }
function evalExpr(node) {
  if (node.t === "val") return node.v;
  if (node.t === "not") return !evalExpr(node.a);
  if (node.t === "and") return evalExpr(node.left) && evalExpr(node.right);
  if (node.t === "or") return evalExpr(node.left) || evalExpr(node.right);
  return false;
}

const ROUNDS = [
  {
    el: "A = αληθές, B = ψευδές. Εξόδος: A AND B",
    en: "A = true, B = false. Output: A AND B",
    env: { A: true, B: false },
    expr: { t: "and", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } },
  },
  {
    el: "A = αληθές, B = αληθές. Εξόδος: A OR B",
    en: "A = true, B = true. Output: A OR B",
    env: { A: true, B: true },
    expr: { t: "or", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } },
  },
  {
    el: "A = ψευδές. Εξόδος: NOT A",
    en: "A = false. Output: NOT A",
    env: { A: false },
    expr: { t: "not", a: { t: "val", k: "A" } },
  },
  {
    el: "A=αληθές, B=ψευδές, C=αληθές. (A AND B) OR C",
    en: "A=true, B=false, C=true. (A AND B) OR C",
    env: { A: true, B: false, C: true },
    expr: {
      t: "or",
      left: { t: "and", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } },
      right: { t: "val", k: "C" },
    },
  },
  {
    el: "A=ψευδές, B=αληθές. NOT (A OR B)",
    en: "A=false, B=true. NOT (A OR B)",
    env: { A: false, B: true },
    expr: { t: "not", a: { t: "or", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } } },
  },
  {
    el: "A=αληθές, B=ψευδές, C=ψευδές. (A OR B) AND (NOT C)",
    en: "A=true, B=false, C=false. (A OR B) AND (NOT C)",
    env: { A: true, B: false, C: false },
    expr: {
      t: "and",
      left: { t: "or", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } },
      right: { t: "not", a: { t: "val", k: "C" } },
    },
  },
  {
    el: "A=αληθές, B=αληθές. A AND (NOT B)",
    en: "A=true, B=true. A AND (NOT B)",
    env: { A: true, B: true },
    expr: {
      t: "and",
      left: { t: "val", k: "A" },
      right: { t: "not", a: { t: "val", k: "B" } },
    },
  },
  {
    el: "A=ψευδές, B=ψευδές. (NOT A) AND (NOT B)",
    en: "A=false, B=false. (NOT A) AND (NOT B)",
    env: { A: false, B: false },
    expr: {
      t: "and",
      left: { t: "not", a: { t: "val", k: "A" } },
      right: { t: "not", a: { t: "val", k: "B" } },
    },
  },
  {
    el: "A=αληθές, B=ψευδές. (A OR B) AND (NOT (A AND B))",
    en: "A=true, B=false. (A OR B) AND (NOT (A AND B))",
    env: { A: true, B: false, C: true },
    expr: {
      t: "and",
      left: { t: "or", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } },
      right: { t: "not", a: { t: "and", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } } },
    },
  },
  {
    el: "A=ψευδές, B=αληθές, C=ψευδές. (A AND B) OR (B AND C) OR (A AND C)",
    en: "A=false, B=true, C=false. (A AND B) OR (B AND C) OR (A AND C)",
    env: { A: false, B: true, C: false },
    expr: {
      t: "or",
      left: {
        t: "or",
        left: { t: "and", left: { t: "val", k: "A" }, right: { t: "val", k: "B" } },
        right: { t: "and", left: { t: "val", k: "B" }, right: { t: "val", k: "C" } },
      },
      right: { t: "and", left: { t: "val", k: "A" }, right: { t: "val", k: "C" } },
    },
  },
];

function bindEnv(node, env) {
  if (node.t === "val") return { t: "val", v: env[node.k] };
  if (node.t === "not") return { t: "not", a: bindEnv(node.a, env) };
  return {
    t: node.t,
    left: bindEnv(node.left, env),
    right: bindEnv(node.right, env),
  };
}

export default function LogicGatesGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
  }, []);

  const r = ROUNDS[round];
  const bound = bindEnv(r.expr, r.env);
  const truth = evalExpr(bound);

  const pick = (v) => {
    if (gameOver || feedback) return;
    const ok = v === truth;
    setFeedback(ok ? "ok" : "bad");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (round >= ROUNDS.length - 1) setGameOver(true);
      else setRound((x) => x + 1);
    }, 550);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8 text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isEl ? "Λογικές πύλες" : "Logic gates"}
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isEl ? "Σκορ" : "Score"}: {score} / {ROUNDS.length}
          </p>
          <button
            type="button"
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            {isEl ? "Ξαναπαίξτε" : "Play Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
          {isEl ? "Λογικές πύλες" : "Logic gates"}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
          {isEl ? `Γύρος ${round + 1} / ${ROUNDS.length} · Σκορ: ${score}` : `Round ${round + 1} / ${ROUNDS.length} · Score: ${score}`}
        </p>
        <div
          className={`rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-6 mb-6 border-2 ${
            feedback === "ok" ? "border-emerald-400" : feedback === "bad" ? "border-rose-400" : "border-transparent"
          }`}
        >
          <p className="text-slate-800 dark:text-slate-100 font-mono text-sm leading-relaxed">{isEl ? r.el : r.en}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
            {isEl ? "AND = ΚΑΙ, OR = Ή, NOT = όχι" : "AND, OR, NOT as in Boolean logic."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={!!feedback}
            onClick={() => pick(true)}
            className="py-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xl font-bold transition"
          >
            {isEl ? "Αληθές" : "True"}
          </button>
          <button
            type="button"
            disabled={!!feedback}
            onClick={() => pick(false)}
            className="py-6 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-xl font-bold transition"
          >
            {isEl ? "Ψευδές" : "False"}
          </button>
        </div>
      </div>
    </div>
  );
}
