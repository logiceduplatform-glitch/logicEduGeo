import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const ALPHABETS = {
  el: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

export default function FallingLettersPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const alpha = ALPHABETS[lang] || ALPHABETS.en;
  const [letters, setLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem("fallingLettersBest") || 0));
  const tickRef = useRef(null);
  const spawnRef = useRef(null);

  useEffect(() => () => { clearInterval(tickRef.current); clearInterval(spawnRef.current); }, []);

  const start = () => {
    setLetters([]); setScore(0); setMissed(0); setRunning(true);
    clearInterval(tickRef.current); clearInterval(spawnRef.current);
    spawnRef.current = setInterval(() => {
      setLetters((l) => [...l, { id: Date.now() + Math.random(), ch: alpha[Math.floor(Math.random() * alpha.length)], x: Math.random() * 80 + 5, y: 0 }]);
    }, 1000);
    tickRef.current = setInterval(() => {
      setLetters((l) => {
        const moved = l.map((x) => ({ ...x, y: x.y + 2 }));
        const onScreen = moved.filter((x) => x.y < 100);
        const miss = moved.length - onScreen.length;
        if (miss > 0) {
          setMissed((m) => {
            const nm = m + miss;
            if (nm >= 5) {
              clearInterval(tickRef.current); clearInterval(spawnRef.current); setRunning(false);
              setBest((b) => { const nb = Math.max(b, scoreRef.current); localStorage.setItem("fallingLettersBest", String(nb)); return nb; });
            }
            return nm;
          });
        }
        return onScreen;
      });
    }, 100);
  };

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    if (!running) return;
    const onKey = (e) => {
      const ch = e.key.toUpperCase();
      setLetters((l) => {
        const idx = l.findIndex((x) => x.ch === ch);
        if (idx === -1) return l;
        setScore((s) => s + 1);
        return l.filter((_, i) => i !== idx);
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  const tap = (ch) => {
    setLetters((l) => {
      const idx = l.findIndex((x) => x.ch === ch);
      if (idx === -1) return l;
      setScore((s) => s + 1);
      return l.filter((_, i) => i !== idx);
    });
  };

  return (
    <GameShell title={isEl ? "Πέφτουν Γράμματα" : "Falling Letters"} description={isEl ? "Πάτα/πληκτρολόγησε γράμματα πριν φτάσουν κάτω" : "Tap/type letters before they reach the bottom"} emoji="🔡" canonical="/games/falling-letters" back="/games">
      <div className="text-center mb-2 text-sm">🏆 <b>{score}</b> · 💀 {missed}/5 · 👑 {best}</div>
      <div className="relative bg-gradient-to-b from-blue-100 to-blue-300 dark:from-slate-700 dark:to-slate-900 rounded-xl overflow-hidden" style={{ height: 320 }}>
        {letters.map((l) => (
          <div key={l.id} className="absolute text-3xl font-bold text-slate-800 dark:text-white select-none" style={{ left: `${l.x}%`, top: `${l.y}%` }}>{l.ch}</div>
        ))}
      </div>
      {!running ? (
        <div className="text-center mt-3"><button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα" : "Start"}</button></div>
      ) : (
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {alpha.split("").map((ch) => (
            <button key={ch} onClick={() => tap(ch)} className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded text-xs font-bold">{ch}</button>
          ))}
        </div>
      )}
    </GameShell>
  );
}
