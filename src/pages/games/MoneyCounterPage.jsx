import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COINS = [
  { v: 0.01, label: "1¢", color: "bg-orange-300" },
  { v: 0.02, label: "2¢", color: "bg-orange-400" },
  { v: 0.05, label: "5¢", color: "bg-orange-500" },
  { v: 0.10, label: "10¢", color: "bg-yellow-400" },
  { v: 0.20, label: "20¢", color: "bg-yellow-500" },
  { v: 0.50, label: "50¢", color: "bg-amber-500" },
  { v: 1, label: "1€", color: "bg-slate-300" },
  { v: 2, label: "2€", color: "bg-slate-400" },
  { v: 5, label: "5€", color: "bg-emerald-400" },
  { v: 10, label: "10€", color: "bg-rose-400" },
  { v: 20, label: "20€", color: "bg-blue-400" },
];

function genTarget() {
  const v = Math.round((Math.random() * 30 + 1) * 100) / 100;
  return Math.round(v * 100) / 100;
}

export default function MoneyCounterPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [target, setTarget] = useState(() => genTarget());
  const [picked, setPicked] = useState([]);
  const [score, setScore] = useState(0);

  const total = useMemo(() => Math.round(picked.reduce((a, b) => a + b.v, 0) * 100) / 100, [picked]);

  const add = (c) => setPicked((p) => [...p, c]);
  const reset = () => setPicked([]);

  const submit = () => {
    if (Math.abs(total - target) < 0.001) {
      setScore((s) => s + 1);
      setTarget(genTarget());
      setPicked([]);
    }
  };

  const next = () => { setTarget(genTarget()); setPicked([]); };

  const matches = Math.abs(total - target) < 0.001;

  return (
    <GameShell title={isEl ? "Μέτρα τα Χρήματα" : "Money Counter"} description={isEl ? "Φτιάξε ακριβώς το ποσό" : "Make exactly the amount"} emoji="💶" canonical="/games/money" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-1">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <div className="text-sm text-slate-500 mb-1">{isEl ? "Στόχος" : "Target"}</div>
        <div className="text-4xl font-extrabold text-emerald-600 mb-3">{target.toFixed(2)} €</div>
        <div className={`text-2xl font-bold mb-3 ${matches ? "text-emerald-600" : "text-slate-700 dark:text-slate-200"}`}>
          {isEl ? "Μάζεψες" : "You have"}: {total.toFixed(2)} €
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[48px]">
          {picked.map((c, i) => (
            <span key={i} className={`px-2 py-1 rounded-full text-xs font-bold text-white ${c.color}`}>{c.label}</span>
          ))}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
          {COINS.map((c) => (
            <button key={c.label} onClick={() => add(c)} className={`${c.color} text-white font-bold rounded-lg py-2 text-sm hover:scale-105 active:scale-95 transition-transform`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          <button onClick={submit} disabled={!matches} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold rounded-lg">
            {isEl ? "Επιβεβαίωση" : "Confirm"}
          </button>
          <button onClick={reset} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
            {isEl ? "Καθαρισμός" : "Clear"}
          </button>
          <button onClick={next} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
            {isEl ? "Επόμενο" : "Next"}
          </button>
        </div>
      </div>
    </GameShell>
  );
}
