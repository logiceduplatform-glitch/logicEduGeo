import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const OPS = ["+", "-", "×", "÷"];

function gen() {
  const op = OPS[Math.floor(Math.random() * OPS.length)];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  let ans;
  if (op === "+") ans = a + b;
  if (op === "-") { if (b > a) [a, b] = [b, a]; ans = a - b; }
  if (op === "×") { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; ans = a * b; }
  if (op === "÷") { ans = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; a = ans * b; }
  return { a, b, op, ans };
}

const DURATION = 60;

export default function MathSprintPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(gen());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem("mathSprintBest") || 0));
  const interval = useRef(null);

  useEffect(() => () => clearInterval(interval.current), []);

  const start = () => {
    setScore(0); setTime(DURATION); setRunning(true); setQ(gen()); setInput("");
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(interval.current);
          setRunning(false);
          setBest((prev) => {
            const next = Math.max(prev, scoreRef.current);
            localStorage.setItem("mathSprintBest", String(next));
            return next;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const submit = (e) => {
    e?.preventDefault();
    if (!running) return;
    if (Number(input) === q.ans) {
      setScore((s) => s + 1);
      setQ(gen());
      setInput("");
    } else {
      setInput("");
    }
  };

  return (
    <GameShell title={isEl ? "Math Sprint" : "Math Sprint"} description={isEl ? "Όσες σωστές μπορείς σε 60''" : "As many as you can in 60s"} emoji="⚡" canonical="/games/math-sprint" back="/games">
      <div className="text-center">
        <div className="flex justify-center gap-3 text-sm mb-2">
          <span>⏱️ <b>{time}s</b></span>
          <span>🏆 <b>{score}</b></span>
          <span>👑 {best}</span>
        </div>
        {!running && (
          <button onClick={start} className="my-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-lg">
            {isEl ? "▶️ Ξεκίνα" : "▶️ Start"}
          </button>
        )}
        {running && (
          <form onSubmit={submit} className="space-y-3 my-4">
            <div className="text-5xl font-extrabold">{q.a} {q.op} {q.b} = ?</div>
            <input
              autoFocus
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-40 mx-auto block px-4 py-3 text-2xl text-center rounded-xl border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:border-orange-500 outline-none"
            />
            <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg">
              {isEl ? "Έλεγχος" : "Check"}
            </button>
          </form>
        )}
      </div>
    </GameShell>
  );
}
