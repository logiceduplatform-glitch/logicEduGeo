import React, { useContext, useMemo, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const NOTES = [
  { name: "C", el: "Ντο", freq: 261.63, line: 5.5 },
  { name: "D", el: "Ρε", freq: 293.66, line: 5 },
  { name: "E", el: "Μι", freq: 329.63, line: 4.5 },
  { name: "F", el: "Φα", freq: 349.23, line: 4 },
  { name: "G", el: "Σολ", freq: 392.00, line: 3.5 },
  { name: "A", el: "Λα", freq: 440.00, line: 3 },
  { name: "B", el: "Σι", freq: 493.88, line: 2.5 },
  { name: "C5", el: "Ντο'", freq: 523.25, line: 2 },
];

function play(freq, ctxRef) {
  if (!ctxRef.current) {
    try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  }
  const ctx = ctxRef.current;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
  osc.start();
  osc.stop(ctx.currentTime + 0.75);
}

function Staff({ note }) {
  const lines = [1, 2, 3, 4, 5];
  const lineY = (l) => 30 + l * 20;
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-md mx-auto">
      {lines.map((l) => (
        <line key={l} x1="20" x2="260" y1={lineY(l)} y2={lineY(l)} stroke="#1e293b" strokeWidth="1.5" />
      ))}
      <text x="30" y="100" fontSize="50" fill="#7c3aed">𝄞</text>
      {note && (
        <ellipse cx="180" cy={lineY(note.line)} rx="11" ry="8" fill="#0f172a" />
      )}
    </svg>
  );
}

function pickQ() {
  return NOTES[Math.floor(Math.random() * NOTES.length)];
}

export default function MusicNotesPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => pickQ());
  const ctxRef = useRef(null);
  const opts = useMemo(() => {
    const set = new Set([q]);
    while (set.size < 4) set.add(NOTES[Math.floor(Math.random() * NOTES.length)]);
    return Array.from(set).sort(() => Math.random() - 0.5);
  }, [q]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const choose = (n) => {
    if (n.name === q.name) {
      setScore((s) => s + 1);
      setFeedback("✅");
      play(n.freq, ctxRef);
      setTimeout(() => { setQ(pickQ()); setFeedback(""); }, 700);
    } else {
      setFeedback("❌");
    }
  };

  return (
    <GameShell title={isEl ? "Μουσικές Νότες" : "Music Notes"} description={isEl ? "Ποια νότα είναι;" : "What note is this?"} emoji="🎵" canonical="/games/music-notes" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-2">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <Staff note={q} />
        <button onClick={() => play(q.freq, ctxRef)} className="my-3 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg">
          🔊 {isEl ? "Άκου" : "Listen"}
        </button>
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          {opts.map((o) => (
            <button key={o.name} onClick={() => choose(o)} className="px-3 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl">
              {isEl ? o.el : o.name}
            </button>
          ))}
        </div>
        {feedback && <div className="mt-3 text-2xl">{feedback}</div>}
      </div>
    </GameShell>
  );
}
