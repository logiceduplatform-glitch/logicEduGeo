import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

function genQ(table) {
  const a = table || (Math.floor(Math.random() * 9) + 2);
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, ans: a * b };
}

function genOptions(ans) {
  const opts = new Set([ans]);
  while (opts.size < 4) {
    const delta = (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.5 ? -1 : 1);
    const o = ans + delta;
    if (o > 0) opts.add(o);
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

const DURATION = 60;

export default function TimesTablesRacePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [table, setTable] = useState(0);
  const [q, setQ] = useState(() => genQ(0));
  const opts = useMemo(() => genOptions(q.ans), [q]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem("ttrBest") || 0));
  const interval = useRef(null);

  useEffect(() => () => clearInterval(interval.current), []);

  const start = () => {
    setScore(0); setTime(DURATION); setRunning(true);
    setQ(genQ(table));
    clearInterval(interval.current);
    interval.current = setInterval(() => setTime((t) => {
      if (t <= 1) {
        clearInterval(interval.current);
        setRunning(false);
        setBest((prev) => {
          const next = Math.max(prev, scoreRef.current);
          localStorage.setItem("ttrBest", String(next));
          return next;
        });
        return 0;
      }
      return t - 1;
    }), 1000);
  };

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const choose = (opt) => {
    if (!running) return;
    if (opt === q.ans) {
      setScore((s) => s + 1);
      setQ(genQ(table));
    } else {
      setTime((t) => Math.max(0, t - 3));
    }
  };

  return (
    <GameShell title={isEl ? "Αγώνας Προπαίδειας" : "Times Tables Race"} description={isEl ? "Όσες περισσότερες σωστές μπορείς σε 60''" : "Solve as many as you can in 60s"} emoji="✖️" canonical="/games/times-tables" back="/games">
      <div className="text-center">
        <div className="flex justify-center gap-3 text-sm mb-2">
          <span>⏱️ <b>{time}s</b></span>
          <span>🏆 <b>{score}</b></span>
          <span>👑 {best}</span>
        </div>
        {!running && (
          <div className="space-y-3 my-4">
            <div className="text-sm text-slate-600 dark:text-slate-300">{isEl ? "Διάλεξε προπαίδεια (0 = όλες)" : "Pick table (0 = mixed)"}</div>
            <div className="flex flex-wrap justify-center gap-1">
              {[0, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button key={n} onClick={() => setTable(n)} className={`w-9 h-9 rounded-lg font-bold ${table === n ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>{n}</button>
              ))}
            </div>
            <button onClick={start} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl">
              {isEl ? "▶️ Ξεκίνα" : "▶️ Start"}
            </button>
          </div>
        )}
        {running && (
          <>
            <div className="text-5xl font-extrabold my-6">{q.a} × {q.b} = ?</div>
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              {opts.map((o) => (
                <button key={o} onClick={() => choose(o)} className="px-4 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-2xl">
                  {o}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
}
