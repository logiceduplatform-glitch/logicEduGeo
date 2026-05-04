import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const GATES = {
  AND:  (a, b) => a && b,
  OR:   (a, b) => a || b,
  XOR:  (a, b) => !!(a ^ b),
  NAND: (a, b) => !(a && b),
  NOR:  (a, b) => !(a || b),
  NOT:  (a) => !a,
};

const GATE_KEYS = Object.keys(GATES);

function genQ() {
  const gate = GATE_KEYS[Math.floor(Math.random() * GATE_KEYS.length)];
  const a = Math.random() < 0.5;
  const b = Math.random() < 0.5;
  const ans = gate === "NOT" ? GATES.NOT(a) : GATES[gate](a, b);
  return { gate, a, b, ans };
}

export default function LogicGatesPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => genQ());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const choose = (val) => {
    if (val === q.ans) {
      setScore((s) => s + 1);
      setFeedback("✅");
      setTimeout(() => { setQ(genQ()); setFeedback(""); }, 500);
    } else setFeedback("❌");
  };

  const truthTable = useMemo(() => {
    const rows = q.gate === "NOT" ? [[true], [false]] : [[true, true], [true, false], [false, true], [false, false]];
    return rows.map((r) => ({ inputs: r, out: q.gate === "NOT" ? GATES.NOT(r[0]) : GATES[q.gate](r[0], r[1]) }));
  }, [q.gate]);

  return (
    <GameShell title={isEl ? "Λογικές Πύλες" : "Logic Gates"} description={isEl ? "Υπολόγισε την έξοδο" : "Compute the output"} emoji="🔌" canonical="/games/logic-gates" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-2">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <div className="my-4 inline-flex items-center gap-3 text-2xl">
          <span className={`px-4 py-2 rounded-lg font-mono ${q.a ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>{q.a ? 1 : 0}</span>
          <span className="px-3 py-2 rounded-lg bg-purple-600 text-white font-bold">{q.gate}</span>
          {q.gate !== "NOT" && (
            <span className={`px-4 py-2 rounded-lg font-mono ${q.b ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>{q.b ? 1 : 0}</span>
          )}
          <span className="text-3xl">→</span>
          <span className="text-3xl font-bold">?</span>
        </div>
        <div className="flex gap-3 justify-center my-3">
          <button onClick={() => choose(true)} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-2xl">1</button>
          <button onClick={() => choose(false)} className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-2xl">0</button>
        </div>
        {feedback && <div className="text-2xl">{feedback}</div>}

        <details className="mt-5 text-left text-sm">
          <summary className="cursor-pointer font-bold">{isEl ? "Πίνακας Αλήθειας" : "Truth Table"} ({q.gate})</summary>
          <table className="mt-2 mx-auto text-center">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-1">A</th>
                {q.gate !== "NOT" && <th className="px-3 py-1">B</th>}
                <th className="px-3 py-1">Out</th>
              </tr>
            </thead>
            <tbody>
              {truthTable.map((r, i) => (
                <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                  <td className="px-3 py-1 font-mono">{r.inputs[0] ? 1 : 0}</td>
                  {q.gate !== "NOT" && <td className="px-3 py-1 font-mono">{r.inputs[1] ? 1 : 0}</td>}
                  <td className="px-3 py-1 font-mono font-bold">{r.out ? 1 : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </GameShell>
  );
}
