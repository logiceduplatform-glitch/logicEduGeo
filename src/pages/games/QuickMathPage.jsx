import React, { useContext, useEffect, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

function genQ() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 20) + 1, b = Math.floor(Math.random() * 20) + 1, ans;
  if (op === "+") ans = a + b;
  if (op === "-") { if (b > a) [a, b] = [b, a]; ans = a - b; }
  if (op === "×") { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; ans = a * b; }
  const correct = Math.random() < 0.5;
  const shown = correct ? ans : ans + (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1);
  return { a, b, op, shown, correct: shown === ans };
}

export default function QuickMathPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(genQ());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem("quickMathBest") || 0));

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setBest((b) => { const n = Math.max(b, score); localStorage.setItem("quickMathBest", String(n)); return n; });
      return;
    }
    const t = setTimeout(() => setTime((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [running, time]); // eslint-disable-line

  const start = () => { setScore(0); setTime(30); setQ(genQ()); setRunning(true); };

  const answer = (val) => {
    if (!running) return;
    if (val === q.correct) {
      setScore((s) => s + 1); setQ(genQ());
    } else {
      setTime((t) => Math.max(0, t - 3));
    }
  };

  return (
    <GameShell title={isEl ? "Quick Math" : "Quick Math"} description={isEl ? "Σωστό ή Λάθος; Σε 30''" : "True or False? In 30s"} emoji="🧮" canonical="/games/quick-math" back="/games">
      <div className="text-center text-sm mb-2">⏱️ <b>{time}s</b> · 🏆 <b>{score}</b> · 👑 {best}</div>
      {!running ? (
        <div className="text-center my-6"><button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα" : "Start"}</button></div>
      ) : (
        <>
          <div className="text-center text-5xl font-extrabold my-6">{q.a} {q.op} {q.b} = {q.shown}</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => answer(true)} className="px-4 py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-2xl">✅ {isEl ? "Σωστό" : "True"}</button>
            <button onClick={() => answer(false)} className="px-4 py-6 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl text-2xl">❌ {isEl ? "Λάθος" : "False"}</button>
          </div>
        </>
      )}
    </GameShell>
  );
}
