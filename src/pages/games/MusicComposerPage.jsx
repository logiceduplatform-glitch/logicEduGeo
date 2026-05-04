import React, { useContext, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const NOTES = [
  { n: "C", el: "Ντο", f: 261.63, color: "bg-red-400" },
  { n: "D", el: "Ρε", f: 293.66, color: "bg-orange-400" },
  { n: "E", el: "Μι", f: 329.63, color: "bg-yellow-400" },
  { n: "F", el: "Φα", f: 349.23, color: "bg-green-400" },
  { n: "G", el: "Σολ", f: 392.00, color: "bg-cyan-400" },
  { n: "A", el: "Λα", f: 440.00, color: "bg-blue-400" },
  { n: "B", el: "Σι", f: 493.88, color: "bg-purple-400" },
  { n: "C5", el: "Ντο'", f: 523.25, color: "bg-pink-400" },
];

const STEPS = 16;

function playNote(freq, ctxRef, dur = 0.25) {
  if (!ctxRef.current) {
    try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  }
  const ctx = ctxRef.current;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

export default function MusicComposerPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [grid, setGrid] = useState(() => Array.from({ length: NOTES.length }, () => Array(STEPS).fill(false)));
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const ctxRef = useRef(null);
  const stopRef = useRef(false);

  const toggle = (r, c) => {
    setGrid((g) => g.map((row, i) => i === r ? row.map((v, j) => j === c ? !v : v) : row));
    if (!grid[r][c]) playNote(NOTES[r].f, ctxRef);
  };

  const play = async () => {
    setPlaying(true); stopRef.current = false;
    const stepMs = 60000 / bpm / 2;
    for (let s = 0; s < STEPS; s++) {
      if (stopRef.current) break;
      setStep(s);
      grid.forEach((row, r) => { if (row[s]) playNote(NOTES[r].f, ctxRef); });
      await new Promise((r) => setTimeout(r, stepMs));
    }
    setPlaying(false);
    setStep(-1);
  };

  const stop = () => { stopRef.current = true; setPlaying(false); setStep(-1); };
  const clear = () => setGrid(Array.from({ length: NOTES.length }, () => Array(STEPS).fill(false)));

  return (
    <GameShell title={isEl ? "Συνθέτης Μουσικής" : "Music Composer"} description={isEl ? "Πάτα κελιά για να φτιάξεις μελωδία" : "Tap cells to compose a melody"} emoji="🎼" canonical="/games/music-composer" back="/games">
      <div className="overflow-x-auto">
        <div className="inline-block">
          {NOTES.map((note, r) => (
            <div key={note.n} className="flex items-center gap-1 mb-1">
              <div className={`${note.color} w-12 text-white text-xs font-bold text-center py-1 rounded`}>{isEl ? note.el : note.n}</div>
              {grid[r].map((on, c) => (
                <button key={c} onClick={() => toggle(r, c)}
                  className={`w-7 h-7 rounded transition-colors ${on ? `${note.color}` : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"} ${step === c ? "ring-2 ring-yellow-400" : ""}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center items-center">
        <button onClick={playing ? stop : play} className={`px-5 py-2 ${playing ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white font-bold rounded-lg`}>
          {playing ? "■ " + (isEl ? "Στοπ" : "Stop") : "▶ " + (isEl ? "Παίξε" : "Play")}
        </button>
        <button onClick={clear} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
          {isEl ? "Καθαρισμός" : "Clear"}
        </button>
        <label className="flex items-center gap-2 text-sm">
          BPM: <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
          <span className="font-mono w-10">{bpm}</span>
        </label>
      </div>
    </GameShell>
  );
}
