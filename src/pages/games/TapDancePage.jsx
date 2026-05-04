import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const LANES = 4;
const HIT_ZONE = 85; // % of height
const HIT_TOLERANCE = 8;
const KEYS = ["d", "f", "j", "k"];
const COLORS = ["bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-blue-500"];

function tone(freq, ctxRef) {
  if (!ctxRef.current) { try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; } }
  const ctx = ctxRef.current;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "square"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1);
}

export default function TapDancePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [notes, setNotes] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem("tapDanceBest") || 0));
  const tickRef = useRef(null), spawnRef = useRef(null), ctxRef = useRef(null);
  const elapsed = useRef(0);

  useEffect(() => () => { clearInterval(tickRef.current); clearInterval(spawnRef.current); }, []);

  const start = () => {
    setNotes([]); setScore(0); setCombo(0); setRunning(true); elapsed.current = 0;
    clearInterval(tickRef.current); clearInterval(spawnRef.current);
    spawnRef.current = setInterval(() => {
      setNotes((n) => [...n, { id: Date.now() + Math.random(), lane: Math.floor(Math.random() * LANES), y: 0 }]);
    }, 800);
    tickRef.current = setInterval(() => {
      elapsed.current += 30;
      setNotes((n) => {
        const moved = n.map((x) => ({ ...x, y: x.y + 1.5 }));
        const survived = moved.filter((x) => x.y < 100);
        const missed = moved.length - survived.length;
        if (missed > 0) setCombo(0);
        return survived;
      });
      if (elapsed.current >= 30000) {
        clearInterval(tickRef.current); clearInterval(spawnRef.current); setRunning(false);
        setBest((b) => { const nb = Math.max(b, scoreRef.current); localStorage.setItem("tapDanceBest", String(nb)); return nb; });
      }
    }, 30);
  };

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const hit = (lane) => {
    if (!running) return;
    const idx = notes.findIndex((n) => n.lane === lane && Math.abs(n.y - HIT_ZONE) < HIT_TOLERANCE);
    if (idx === -1) { setCombo(0); return; }
    const note = notes[idx];
    setNotes((n) => n.filter((_, i) => i !== idx));
    setScore((s) => s + 10 + combo);
    setCombo((c) => c + 1);
    tone(220 + lane * 80, ctxRef);
  };

  useEffect(() => {
    const onKey = (e) => {
      const i = KEYS.indexOf(e.key.toLowerCase());
      if (i !== -1) hit(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notes, running, combo]); // eslint-disable-line

  return (
    <GameShell title={isEl ? "Tap Dance" : "Tap Dance"} description={isEl ? "Πάτα τη στήλη όταν η νότα φτάσει στη ζώνη!" : "Tap the column when the note hits the zone!"} emoji="🎮" canonical="/games/tap-dance" back="/games">
      <div className="text-center text-sm mb-2">🏆 <b>{score}</b> · 🔥 {combo} · 👑 {best}</div>
      <div className="relative bg-slate-900 rounded-xl overflow-hidden mx-auto" style={{ width: 280, height: 360 }}>
        {Array.from({ length: LANES }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 border-r border-slate-700" style={{ left: `${(i + 1) * (100 / LANES)}%`, width: 0 }} />
        ))}
        <div className="absolute left-0 right-0 border-t-4 border-yellow-400" style={{ top: `${HIT_ZONE}%` }} />
        {notes.map((n) => (
          <div key={n.id} className={`absolute ${COLORS[n.lane]} rounded`} style={{ left: `${n.lane * (100 / LANES) + 1}%`, top: `${n.y}%`, width: `${100 / LANES - 2}%`, height: 20 }} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1 max-w-[280px] mx-auto mt-2">
        {Array.from({ length: LANES }).map((_, i) => (
          <button key={i} onTouchStart={() => hit(i)} onMouseDown={() => hit(i)}
            className={`${COLORS[i]} text-white font-bold py-3 rounded text-sm`}>{KEYS[i].toUpperCase()}</button>
        ))}
      </div>
      {!running && (
        <div className="text-center mt-3"><button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα (30'')" : "Start (30s)"}</button></div>
      )}
    </GameShell>
  );
}
