import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const PADS = [
  { id: 0, color: "bg-emerald-500", on: "bg-emerald-200", freq: 261.63 },
  { id: 1, color: "bg-rose-500", on: "bg-rose-200", freq: 329.63 },
  { id: 2, color: "bg-amber-500", on: "bg-amber-200", freq: 392.00 },
  { id: 3, color: "bg-blue-500", on: "bg-blue-200", freq: 523.25 },
];

function tone(freq, ctxRef) {
  if (!ctxRef.current) { try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; } }
  const ctx = ctxRef.current;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "sine"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.3);
}

export default function MemorySequencePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [seq, setSeq] = useState([]);
  const [user, setUser] = useState([]);
  const [showing, setShowing] = useState(-1);
  const [phase, setPhase] = useState("idle"); // idle | show | input | over
  const [best, setBest] = useState(() => Number(localStorage.getItem("simonBest") || 0));
  const ctxRef = useRef(null);

  const start = () => { setSeq([Math.floor(Math.random() * 4)]); setUser([]); setPhase("show"); };

  useEffect(() => {
    if (phase !== "show" || seq.length === 0) return;
    let i = 0;
    const interval = setInterval(() => {
      setShowing(seq[i]);
      tone(PADS[seq[i]].freq, ctxRef);
      setTimeout(() => setShowing(-1), 350);
      i++;
      if (i >= seq.length) { clearInterval(interval); setTimeout(() => setPhase("input"), 500); }
    }, 600);
    return () => clearInterval(interval);
  }, [phase, seq]);

  const press = (id) => {
    if (phase !== "input") return;
    setShowing(id); tone(PADS[id].freq, ctxRef);
    setTimeout(() => setShowing(-1), 200);
    const next = [...user, id];
    if (seq[next.length - 1] !== id) {
      setPhase("over");
      setBest((b) => { const nb = Math.max(b, seq.length - 1); localStorage.setItem("simonBest", String(nb)); return nb; });
      return;
    }
    setUser(next);
    if (next.length === seq.length) {
      setTimeout(() => { setSeq([...seq, Math.floor(Math.random() * 4)]); setUser([]); setPhase("show"); }, 600);
    }
  };

  return (
    <GameShell title={isEl ? "Memory Sequence" : "Memory Sequence"} description={isEl ? "Επανέλαβε την ακολουθία" : "Repeat the sequence"} emoji="🧠" canonical="/games/memory-sequence" back="/games">
      <div className="text-center text-sm mb-2">{isEl ? "Επίπεδο" : "Level"}: <b>{seq.length}</b> · 👑 {best}</div>
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
        {PADS.map((p) => (
          <button key={p.id} onClick={() => press(p.id)} disabled={phase !== "input"}
            className={`aspect-square rounded-2xl transition-colors ${showing === p.id ? p.on : p.color} disabled:opacity-70`} />
        ))}
      </div>
      <div className="text-center mt-3">
        {(phase === "idle" || phase === "over") && (
          <>
            {phase === "over" && <div className="text-xl font-extrabold text-rose-600 mb-2">💥 Game Over (level {seq.length})</div>}
            <button onClick={start} className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg">
              {phase === "over" ? (isEl ? "Ξανά" : "Again") : (isEl ? "▶ Ξεκίνα" : "▶ Start")}
            </button>
          </>
        )}
        {phase === "show" && <div className="text-sm text-slate-500">{isEl ? "Πρόσεξε…" : "Watch…"}</div>}
        {phase === "input" && <div className="text-sm text-emerald-600">{isEl ? "Σειρά σου!" : "Your turn!"}</div>}
      </div>
    </GameShell>
  );
}
