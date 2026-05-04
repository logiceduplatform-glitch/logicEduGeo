import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const LETTERS = {
  el: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

const DURATION = 60;

function pickLetters(lang) {
  const set = LETTERS[lang] || LETTERS.en;
  const chosen = new Set();
  const vowels = lang === "el" ? "ΑΕΗΙΟΥΩ" : "AEIOU";
  while (chosen.size < 3) chosen.add(vowels[Math.floor(Math.random() * vowels.length)]);
  while (chosen.size < 7) chosen.add(set[Math.floor(Math.random() * set.length)]);
  return Array.from(chosen);
}

export default function WordBattlePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [letters, setLetters] = useState(() => pickLetters(lang));
  const [time, setTime] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState("p1");
  const [words, setWords] = useState({ p1: [], p2: [] });
  const [input, setInput] = useState("");
  const interval = useRef(null);

  useEffect(() => () => clearInterval(interval.current), []);

  const start = () => {
    setLetters(pickLetters(lang));
    setTime(DURATION); setRunning(true);
    setWords({ p1: [], p2: [] }); setInput("");
    clearInterval(interval.current);
    interval.current = setInterval(() => setTime((t) => {
      if (t <= 1) { clearInterval(interval.current); setRunning(false); return 0; }
      return t - 1;
    }), 1000);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!running) return;
    const w = input.trim().toUpperCase();
    if (w.length < 3) { setInput(""); return; }
    const letterSet = letters.join("");
    let ok = true;
    for (const ch of w) if (!letterSet.includes(ch)) { ok = false; break; }
    if (!ok) { setInput(""); return; }
    if (words[active].includes(w)) { setInput(""); return; }
    setWords((s) => ({ ...s, [active]: [...s[active], w] }));
    setInput("");
    setActive((p) => p === "p1" ? "p2" : "p1");
  };

  const score = (list) => list.reduce((s, w) => s + w.length, 0);

  return (
    <GameShell title={isEl ? "Word Battle 1v1" : "Word Battle 1v1"} description={isEl ? "Φτιάξε λέξεις από τα γράμματα — εναλλάξ" : "Make words from the letters — alternating"} emoji="🔤" canonical="/games/word-battle" back="/games">
      <div className="text-center mb-3">
        <div className="text-sm">⏱️ <b>{time}s</b></div>
        <div className="flex flex-wrap justify-center gap-1 my-2">
          {letters.map((l, i) => (
            <div key={i} className="w-10 h-10 bg-amber-400 text-white font-bold text-2xl flex items-center justify-center rounded">{l}</div>
          ))}
        </div>
      </div>
      {!running && time === DURATION && (
        <div className="text-center"><button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα" : "Start"}</button></div>
      )}
      {running && (
        <form onSubmit={submit} className="text-center mb-3">
          <div className="text-sm font-bold mb-1">
            {active === "p1" ? "🔵 P1" : "🔴 P2"} · {isEl ? "Γράψε λέξη" : "Type word"}
          </div>
          <input value={input} onChange={(e) => setInput(e.target.value)} autoFocus
            className="px-4 py-2 text-xl text-center rounded-xl border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
          <button type="submit" className="ml-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg">OK</button>
        </form>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2">
          <div className="font-bold text-blue-700 dark:text-blue-200">🔵 P1: {score(words.p1)} pts</div>
          <div className="text-xs space-y-0.5 mt-1">{words.p1.map((w, i) => <div key={i}>{w} (+{w.length})</div>)}</div>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900/40 rounded-lg p-2">
          <div className="font-bold text-rose-700 dark:text-rose-200">🔴 P2: {score(words.p2)} pts</div>
          <div className="text-xs space-y-0.5 mt-1">{words.p2.map((w, i) => <div key={i}>{w} (+{w.length})</div>)}</div>
        </div>
      </div>
      {!running && time === 0 && (
        <div className="text-center mt-3">
          <div className="text-2xl font-extrabold mb-2">
            {score(words.p1) > score(words.p2) ? "🏆 P1" : score(words.p2) > score(words.p1) ? "🏆 P2" : "🤝"}
          </div>
          <button onClick={start} className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg">{isEl ? "Ξανά" : "Again"}</button>
        </div>
      )}
    </GameShell>
  );
}
