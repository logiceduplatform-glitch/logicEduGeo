import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

export default function ReactionTimePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [phase, setPhase] = useState("idle"); // idle | wait | go | done | tooSoon
  const [delta, setDelta] = useState(0);
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(() => Number(localStorage.getItem("reactionBest") || 0));
  const startedAt = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const start = () => {
    setPhase("wait"); setDelta(0);
    const wait = 1000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => { startedAt.current = performance.now(); setPhase("go"); }, wait);
  };

  const click = () => {
    if (phase === "idle" || phase === "done" || phase === "tooSoon") { start(); return; }
    if (phase === "wait") { clearTimeout(timeoutRef.current); setPhase("tooSoon"); return; }
    if (phase === "go") {
      const d = Math.round(performance.now() - startedAt.current);
      setDelta(d);
      setHistory((h) => [d, ...h].slice(0, 5));
      if (best === 0 || d < best) { setBest(d); localStorage.setItem("reactionBest", String(d)); }
      setPhase("done");
    }
  };

  const bg = phase === "go" ? "bg-emerald-500" : phase === "wait" ? "bg-rose-500" : phase === "tooSoon" ? "bg-amber-500" : "bg-slate-400";
  const label = {
    idle: isEl ? "Πάτα για να ξεκινήσεις" : "Tap to start",
    wait: isEl ? "Περίμενε…" : "Wait…",
    go: isEl ? "ΤΩΡΑ!" : "GO!",
    done: `${delta} ms`,
    tooSoon: isEl ? "Πρόωρα! Πάτα ξανά" : "Too soon! Tap again",
  }[phase];

  return (
    <GameShell title={isEl ? "Χρόνος Αντίδρασης" : "Reaction Time"} description={isEl ? "Πάτα μόλις γίνει πράσινο" : "Tap as soon as it goes green"} emoji="⚡" canonical="/games/reaction" back="/games">
      <div className="text-center text-sm mb-2">👑 {best ? `${best}ms` : "—"}</div>
      <button onClick={click} className={`${bg} w-full h-64 rounded-xl text-white font-extrabold text-3xl transition-colors`}>{label}</button>
      <div className="mt-3 text-center text-xs text-slate-500">{history.length > 0 && (isEl ? "Τελευταία:" : "Recent:")} {history.join("ms · ")}{history.length > 0 && "ms"}</div>
    </GameShell>
  );
}
