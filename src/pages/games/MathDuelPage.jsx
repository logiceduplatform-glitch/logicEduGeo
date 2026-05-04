import React, { useContext, useEffect, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

function genQ() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 20) + 1, b = Math.floor(Math.random() * 20) + 1, ans;
  if (op === "+") ans = a + b;
  if (op === "-") { if (b > a) [a, b] = [b, a]; ans = a - b; }
  if (op === "×") { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; ans = a * b; }
  return { a, b, op, ans };
}

function genOpts(ans) {
  const set = new Set([ans]);
  while (set.size < 4) set.add(ans + (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.5 ? -1 : 1));
  return Array.from(set).filter((n) => n > 0).sort(() => Math.random() - 0.5).slice(0, 4);
}

const TARGET = 5;

export default function MathDuelPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(genQ());
  const opts = useMemo(() => genOpts(q.ans), [q]);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const winner = score.p1 >= TARGET ? "p1" : score.p2 >= TARGET ? "p2" : null;

  const choose = (p, val) => {
    if (winner) return;
    if (val === q.ans) {
      setScore((s) => ({ ...s, [p]: s[p] + 1 }));
      setTimeout(() => setQ(genQ()), 200);
    } else {
      setScore((s) => ({ ...s, [p]: Math.max(0, s[p] - 1) }));
    }
  };

  const reset = () => { setScore({ p1: 0, p2: 0 }); setQ(genQ()); };

  const Side = ({ p, color, rotate }) => (
    <div className={`${color} text-white rounded-xl p-3 ${rotate ? "rotate-180" : ""}`}>
      <div className="text-center text-xs opacity-90">{p === "p1" ? (isEl ? "Παίκτης 1" : "Player 1") : (isEl ? "Παίκτης 2" : "Player 2")}</div>
      <div className="text-center text-3xl font-bold mb-2">{score[p]}/{TARGET}</div>
      {!winner && (
        <div className="grid grid-cols-2 gap-1">
          {opts.map((o) => (
            <button key={o} onClick={() => choose(p, o)} className="bg-white/20 hover:bg-white/30 font-bold rounded py-2 text-xl">{o}</button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <GameShell title={isEl ? "Math Duel" : "Math Duel"} description={isEl ? `Πρώτος στο ${TARGET}` : `First to ${TARGET}`} emoji="➗" canonical="/games/math-duel" back="/games">
      <Side p="p2" color="bg-rose-500" rotate />
      <div className="text-center my-3 text-3xl font-extrabold">{q.a} {q.op} {q.b} = ?</div>
      <Side p="p1" color="bg-blue-500" />
      {winner && (
        <div className="text-center mt-4">
          <div className="text-2xl font-extrabold mb-2">🏆 {winner === "p1" ? "Player 1" : "Player 2"}</div>
          <button onClick={reset} className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg">{isEl ? "Ξανά" : "Again"}</button>
        </div>
      )}
    </GameShell>
  );
}
