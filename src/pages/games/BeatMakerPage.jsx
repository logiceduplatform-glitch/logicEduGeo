import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const TRACKS = [
  { id: "kick",  emoji: "🥁", color: "bg-red-500",    type: "kick" },
  { id: "snare", emoji: "🎯", color: "bg-orange-500", type: "snare" },
  { id: "hat",   emoji: "🎩", color: "bg-yellow-500", type: "hihat" },
  { id: "clap",  emoji: "👏", color: "bg-emerald-500", type: "clap" },
  { id: "bass",  emoji: "🎸", color: "bg-blue-500",   type: "bass" },
];

const STEPS = 16;

function playSound(type, ctxRef) {
  if (!ctxRef.current) {
    try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  }
  const ctx = ctxRef.current;
  const now = ctx.currentTime;

  if (type === "kick") {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.setValueAtTime(150, now); o.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
    g.gain.setValueAtTime(1, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.5);
  } else if (type === "snare") {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    src.connect(g); g.connect(ctx.destination); src.start(now);
  } else if (type === "hihat") {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.3, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    src.connect(hp); hp.connect(g); g.connect(ctx.destination); src.start(now);
  } else if (type === "clap") {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = 0.5;
    src.connect(g); g.connect(ctx.destination); src.start(now);
  } else if (type === "bass") {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sawtooth"; o.frequency.value = 80;
    g.gain.setValueAtTime(0.3, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.3);
  }
}

export default function BeatMakerPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [grid, setGrid] = useState(() => Array.from({ length: TRACKS.length }, () => Array(STEPS).fill(false)));
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const ctxRef = useRef(null);
  const stopRef = useRef(false);

  const toggle = (r, c) => setGrid((g) => g.map((row, i) => i === r ? row.map((v, j) => j === c ? !v : v) : row));

  useEffect(() => {
    if (!playing) { stopRef.current = true; setStep(-1); return; }
    stopRef.current = false;
    let s = 0;
    const stepMs = 60000 / bpm / 4;
    const tick = () => {
      if (stopRef.current) return;
      setStep(s);
      grid.forEach((row, r) => { if (row[s]) playSound(TRACKS[r].type, ctxRef); });
      s = (s + 1) % STEPS;
      setTimeout(tick, stepMs);
    };
    tick();
    return () => { stopRef.current = true; };
  }, [playing, bpm, grid]);

  const clear = () => setGrid(Array.from({ length: TRACKS.length }, () => Array(STEPS).fill(false)));

  return (
    <GameShell title={isEl ? "Beat Maker" : "Beat Maker"} description={isEl ? "Φτιάξε ρυθμό 16 βημάτων" : "Build a 16-step beat"} emoji="🎚️" canonical="/games/beat-maker" back="/games">
      <div className="overflow-x-auto">
        <div className="inline-block">
          {TRACKS.map((tr, r) => (
            <div key={tr.id} className="flex items-center gap-1 mb-1">
              <button onClick={() => playSound(tr.type, ctxRef)} className={`${tr.color} w-12 text-white text-xl text-center py-1 rounded`}>{tr.emoji}</button>
              {grid[r].map((on, c) => (
                <button key={c} onClick={() => toggle(r, c)}
                  className={`w-7 h-7 rounded transition-colors ${on ? `${tr.color}` : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"} ${step === c ? "ring-2 ring-yellow-400" : ""} ${c % 4 === 0 ? "ml-1" : ""}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center items-center">
        <button onClick={() => setPlaying((p) => !p)} className={`px-5 py-2 ${playing ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white font-bold rounded-lg`}>
          {playing ? "■ " + (isEl ? "Στοπ" : "Stop") : "▶ " + (isEl ? "Παίξε" : "Play")}
        </button>
        <button onClick={clear} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">{isEl ? "Καθαρισμός" : "Clear"}</button>
        <label className="flex items-center gap-2 text-sm">BPM <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} /> <span className="font-mono w-10">{bpm}</span></label>
      </div>
    </GameShell>
  );
}
