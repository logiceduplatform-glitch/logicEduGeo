import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const EVENTS = [
  { year: -776, el: "Πρώτοι Ολυμπιακοί Αγώνες", en: "First Olympic Games" },
  { year: -490, el: "Μάχη του Μαραθώνα", en: "Battle of Marathon" },
  { year: -336, el: "Μέγας Αλέξανδρος βασιλιάς", en: "Alexander the Great" },
  { year: 1453, el: "Άλωση Κωνσταντινούπολης", en: "Fall of Constantinople" },
  { year: 1492, el: "Ανακάλυψη Αμερικής", en: "Discovery of America" },
  { year: 1789, el: "Γαλλική Επανάσταση", en: "French Revolution" },
  { year: 1821, el: "Ελληνική Επανάσταση", en: "Greek Revolution" },
  { year: 1903, el: "Πρώτη πτήση Wright", en: "Wright Brothers flight" },
  { year: 1914, el: "Α' Παγκόσμιος Πόλεμος", en: "WWI begins" },
  { year: 1939, el: "Β' Παγκόσμιος Πόλεμος", en: "WWII begins" },
  { year: 1969, el: "Πρώτος άνθρωπος στη Σελήνη", en: "First man on the Moon" },
  { year: 1989, el: "Πτώση τείχους Βερολίνου", en: "Fall of Berlin Wall" },
  { year: 2004, el: "Ολυμπιακοί Αθήνας", en: "Athens Olympics" },
];

function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5); }

export default function HistoryTimelinePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const round = useMemo(() => shuffle(EVENTS).slice(0, 5), []);
  const [order, setOrder] = useState(() => shuffle(round));
  const [revealed, setRevealed] = useState(false);

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const arr = order.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setOrder(arr);
  };

  const correct = order.every((e, i, a) => i === 0 || e.year >= a[i - 1].year);

  return (
    <GameShell title={isEl ? "Χρονογραμμή Ιστορίας" : "History Timeline"} description={isEl ? "Βάλε σε σωστή χρονολογική σειρά" : "Order chronologically"} emoji="⏳" canonical="/games/history-timeline" back="/games">
      <div className="space-y-2 mb-4">
        {order.map((e, i) => (
          <div key={e.en} className={`flex items-center gap-2 p-3 rounded-xl border ${revealed && (i === 0 || e.year >= order[i - 1].year) ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300" : revealed ? "bg-rose-50 dark:bg-rose-900/30 border-rose-300" : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"}`}>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="w-7 h-7 rounded bg-slate-300 dark:bg-slate-600 disabled:opacity-30">▲</button>
              <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="w-7 h-7 rounded bg-slate-300 dark:bg-slate-600 disabled:opacity-30">▼</button>
            </div>
            <div className="flex-1">
              <div className="font-bold">{isEl ? e.el : e.en}</div>
              {revealed && <div className="text-xs text-slate-500">{e.year > 0 ? e.year : `${Math.abs(e.year)} π.Χ.`}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setRevealed(true)} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg">
          {isEl ? "Έλεγχος" : "Check"}
        </button>
        <button onClick={() => { setOrder(shuffle(round)); setRevealed(false); }} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
          {isEl ? "Ανακάτεμα" : "Shuffle"}
        </button>
      </div>
      {revealed && (
        <div className={`mt-3 text-center text-xl font-bold ${correct ? "text-emerald-600" : "text-rose-600"}`}>
          {correct ? (isEl ? "🎉 Όλα σωστά!" : "🎉 All correct!") : (isEl ? "Δοκίμασε ξανά" : "Try again")}
        </div>
      )}
    </GameShell>
  );
}
