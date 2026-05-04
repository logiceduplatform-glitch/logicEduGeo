import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"];
const DURATION = 30;

export default function BubblePopPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem("bubbleBest") || 0));
  const tickRef = useRef(null);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => () => { clearInterval(tickRef.current); clearInterval(spawnRef.current); clearInterval(timerRef.current); }, []);

  const start = () => {
    setBubbles([]); setScore(0); setTime(DURATION); setRunning(true);
    clearInterval(tickRef.current); clearInterval(spawnRef.current); clearInterval(timerRef.current);
    spawnRef.current = setInterval(() => {
      setBubbles((b) => [...b, { id: Date.now() + Math.random(), x: Math.random() * 85, y: 100, color: COLORS[Math.floor(Math.random() * COLORS.length)], size: 24 + Math.random() * 24 }]);
    }, 400);
    tickRef.current = setInterval(() => {
      setBubbles((b) => b.map((x) => ({ ...x, y: x.y - 2 })).filter((x) => x.y > -20));
    }, 50);
    timerRef.current = setInterval(() => setTime((t) => {
      if (t <= 1) {
        clearInterval(timerRef.current); clearInterval(tickRef.current); clearInterval(spawnRef.current); setRunning(false);
        setBest((b) => { const nb = Math.max(b, scoreRef.current); localStorage.setItem("bubbleBest", String(nb)); return nb; });
        return 0;
      }
      return t - 1;
    }), 1000);
  };

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const pop = (id) => {
    setBubbles((b) => b.filter((x) => x.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <GameShell title={isEl ? "Σκάσε Φούσκες" : "Bubble Pop"} description={isEl ? "Σκάσε όσες φούσκες μπορείς σε 30''" : "Pop as many bubbles as you can in 30s"} emoji="🫧" canonical="/games/bubble-pop" back="/games">
      <div className="text-center mb-2 text-sm">⏱️ <b>{time}s</b> · 🏆 <b>{score}</b> · 👑 {best}</div>
      <div className="relative bg-gradient-to-b from-cyan-200 to-blue-400 rounded-xl overflow-hidden" style={{ height: 360 }}>
        {bubbles.map((b) => (
          <button key={b.id} onClick={() => pop(b.id)}
            className="absolute rounded-full border-2 border-white/60 hover:scale-110 active:scale-90 transition-transform"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, background: `radial-gradient(circle at 30% 30%, white, ${b.color})` }} />
        ))}
        {!running && time === DURATION && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα" : "Start"}</button>
          </div>
        )}
        {!running && time === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">↻ {isEl ? "Ξανά" : "Again"}</button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
