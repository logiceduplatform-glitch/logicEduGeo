import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

export default function EcosystemPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [grass, setGrass] = useState(50);
  const [rabbits, setRabbits] = useState(20);
  const [foxes, setFoxes] = useState(5);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
      setGrass((g) => {
        let next = g + 4 - (rabbits * 0.1);
        return Math.max(0, Math.min(200, Math.round(next)));
      });
      setRabbits((r) => {
        if (r === 0) return 0;
        const food = grass / 100;
        const grow = food * 1.2;
        const eaten = foxes * 0.15;
        return Math.max(0, Math.round(r + grow - eaten - 0.3));
      });
      setFoxes((f) => {
        if (f === 0) return 0;
        const food = rabbits / 30;
        return Math.max(0, Math.round(f + food * 0.4 - 0.4));
      });
      setHistory((h) => [...h.slice(-30), { tick, g: grass, r: rabbits, f: foxes }]);
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [running, grass, rabbits, foxes, tick]);

  const reset = () => { setRunning(false); setGrass(50); setRabbits(20); setFoxes(5); setTick(0); setHistory([]); };

  const dead = grass === 0 && rabbits === 0 && foxes === 0;

  return (
    <GameShell title={isEl ? "Οικοσύστημα" : "Ecosystem"} description={isEl ? "Δες την τροφική αλυσίδα ζωντανά" : "Watch the food chain in action"} emoji="🌳" canonical="/games/ecosystem" back="/games">
      <div className="text-center text-sm mb-2">⏱️ Tick: <b>{tick}</b></div>

      <div className="space-y-3">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-xl p-3">
          <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-300">
            <span>🌱 {isEl ? "Γρασίδι" : "Grass"}</span><span>{grass}</span>
          </div>
          <div className="h-3 bg-emerald-200 dark:bg-emerald-950 rounded mt-1">
            <div className="h-full bg-emerald-500 rounded transition-all" style={{ width: `${(grass / 200) * 100}%` }} />
          </div>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/40 rounded-xl p-3">
          <div className="flex justify-between font-bold text-amber-700 dark:text-amber-300">
            <span>🐰 {isEl ? "Κουνέλια" : "Rabbits"}</span><span>{rabbits}</span>
          </div>
          <div className="h-3 bg-amber-200 dark:bg-amber-950 rounded mt-1">
            <div className="h-full bg-amber-500 rounded transition-all" style={{ width: `${Math.min(100, (rabbits / 100) * 100)}%` }} />
          </div>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900/40 rounded-xl p-3">
          <div className="flex justify-between font-bold text-rose-700 dark:text-rose-300">
            <span>🦊 {isEl ? "Αλεπούδες" : "Foxes"}</span><span>{foxes}</span>
          </div>
          <div className="h-3 bg-rose-200 dark:bg-rose-950 rounded mt-1">
            <div className="h-full bg-rose-500 rounded transition-all" style={{ width: `${Math.min(100, (foxes / 30) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button onClick={() => setRunning((r) => !r)} className={`px-5 py-2 ${running ? "bg-rose-500" : "bg-emerald-500"} text-white font-bold rounded-lg`}>
          {running ? "❚❚ " + (isEl ? "Παύση" : "Pause") : "▶ " + (isEl ? "Παίξε" : "Play")}
        </button>
        <button onClick={() => { setGrass((g) => g + 30); }} className="px-3 py-2 bg-emerald-500 text-white font-bold rounded-lg">+🌱</button>
        <button onClick={() => setRabbits((r) => r + 5)} className="px-3 py-2 bg-amber-500 text-white font-bold rounded-lg">+🐰</button>
        <button onClick={() => setFoxes((f) => f + 2)} className="px-3 py-2 bg-rose-500 text-white font-bold rounded-lg">+🦊</button>
        <button onClick={reset} className="px-3 py-2 bg-slate-300 dark:bg-slate-700 font-bold rounded-lg">↺</button>
      </div>

      {dead && (
        <div className="mt-3 p-3 bg-rose-100 dark:bg-rose-900/40 rounded-lg text-center text-rose-700 dark:text-rose-200 font-bold">
          💀 {isEl ? "Το οικοσύστημα κατέρρευσε!" : "The ecosystem collapsed!"}
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">
        💡 {isEl ? "Συμβουλή: ισορροπία είναι το παν!" : "Tip: balance is everything!"}
      </div>
    </GameShell>
  );
}
