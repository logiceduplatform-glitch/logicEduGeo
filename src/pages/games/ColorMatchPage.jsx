import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COLORS = [
  { name: { el: "ΚΟΚΚΙΝΟ", en: "RED" }, css: "#ef4444" },
  { name: { el: "ΜΠΛΕ", en: "BLUE" }, css: "#3b82f6" },
  { name: { el: "ΠΡΑΣΙΝΟ", en: "GREEN" }, css: "#22c55e" },
  { name: { el: "ΚΙΤΡΙΝΟ", en: "YELLOW" }, css: "#eab308" },
  { name: { el: "ΜΩΒ", en: "PURPLE" }, css: "#a855f7" },
];

function genQ(lang) {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { wordLabel: word.name[lang], color };
}

const DURATION = 30;

export default function ColorMatchPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => genQ(lang));
  const [time, setTime] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("colorMatchBest") || 0));
  const interval = useRef(null);

  useEffect(() => () => clearInterval(interval.current), []);

  const start = () => {
    setScore(0); setTime(DURATION); setRunning(true); setQ(genQ(lang));
    clearInterval(interval.current);
    interval.current = setInterval(() => setTime((t) => {
      if (t <= 1) {
        clearInterval(interval.current); setRunning(false);
        setBest((prev) => { const n = Math.max(prev, scoreRef.current); localStorage.setItem("colorMatchBest", String(n)); return n; });
        return 0;
      }
      return t - 1;
    }), 1000);
  };

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const choose = (c) => {
    if (!running) return;
    if (c.name[lang] === q.wordLabel) {
      setScore((s) => s + 1);
    } else {
      setTime((t) => Math.max(0, t - 2));
    }
    setQ(genQ(lang));
  };

  return (
    <GameShell title={isEl ? "Ταίριαξε Χρώμα" : "Color Match"} description={isEl ? "Πάτα το ΟΝΟΜΑ της λέξης (όχι το χρώμα της!)" : "Tap the WORD (not the color!)"} emoji="🌈" canonical="/games/color-match" back="/games">
      <div className="text-center mb-2 text-sm">⏱️ <b>{time}s</b> · 🏆 <b>{score}</b> · 👑 {best}</div>
      {!running && (
        <div className="text-center my-6"><button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα" : "Start"}</button></div>
      )}
      {running && (
        <>
          <div className="text-center my-6 text-5xl font-extrabold" style={{ color: q.color.css }}>{q.wordLabel}</div>
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
            {COLORS.map((c) => (
              <button key={c.name.en} onClick={() => choose(c)} className="px-2 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-bold rounded-lg">{c.name[lang]}</button>
            ))}
          </div>
        </>
      )}
    </GameShell>
  );
}
