import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const SIZE = 16;
const PALETTE = ["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "transparent"];

function emptyFrame() { return Array.from({ length: SIZE * SIZE }, () => "transparent"); }

export default function AnimationStudioPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [frames, setFrames] = useState(() => [emptyFrame()]);
  const [idx, setIdx] = useState(0);
  const [color, setColor] = useState("#000000");
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(8);
  const dragRef = useRef(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % frames.length), 1000 / fps);
    return () => clearInterval(t);
  }, [playing, fps, frames.length]);

  const paint = (i) => setFrames((fs) => fs.map((f, j) => j === idx ? f.map((c, k) => k === i ? color : c) : f));

  const addFrame = () => { const dup = frames[idx].slice(); setFrames((fs) => [...fs.slice(0, idx + 1), dup, ...fs.slice(idx + 1)]); setIdx(idx + 1); };
  const delFrame = () => { if (frames.length === 1) return; setFrames((fs) => fs.filter((_, j) => j !== idx)); setIdx(Math.max(0, idx - 1)); };

  return (
    <GameShell title={isEl ? "Στούντιο Animation" : "Animation Studio"} description={isEl ? "Φτιάξε καρέ-καρέ animation" : "Build frame-by-frame animation"} emoji="🎬" canonical="/games/animation" back="/games">
      <div className="flex flex-wrap gap-1 mb-3 justify-center">
        {PALETTE.map((c) => (
          <button key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded border-2 ${color === c ? "border-purple-600 scale-110" : "border-slate-300"}`} style={{ background: c === "transparent" ? "white" : c }}>
            {c === "transparent" ? "✕" : ""}
          </button>
        ))}
      </div>
      <div
        className="inline-grid mx-auto border-2 border-slate-700 select-none"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 18px)` }}
        onMouseLeave={() => { dragRef.current = false; }}
      >
        {frames[idx].map((c, i) => (
          <div key={i}
            onMouseDown={() => { dragRef.current = true; paint(i); }}
            onMouseEnter={() => dragRef.current && paint(i)}
            onMouseUp={() => { dragRef.current = false; }}
            onTouchStart={() => paint(i)}
            className="w-[18px] h-[18px] border border-slate-200 cursor-pointer"
            style={{ background: c === "transparent" ? "white" : c }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 justify-center items-center">
        <button onClick={() => setPlaying((p) => !p)} className={`px-4 py-2 ${playing ? "bg-rose-500" : "bg-emerald-500"} text-white font-bold rounded-lg`}>
          {playing ? "■" : "▶"} {playing ? (isEl ? "Στοπ" : "Stop") : (isEl ? "Παίξε" : "Play")}
        </button>
        <button onClick={addFrame} className="px-3 py-2 bg-blue-500 text-white font-bold rounded-lg">+ {isEl ? "Καρέ" : "Frame"}</button>
        <button onClick={delFrame} className="px-3 py-2 bg-rose-500 text-white font-bold rounded-lg">−</button>
        <label className="text-sm">FPS <input type="range" min="2" max="20" value={fps} onChange={(e) => setFps(Number(e.target.value))} /> {fps}</label>
      </div>
      <div className="mt-2 flex gap-1 overflow-x-auto justify-center">
        {frames.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`px-2 py-1 text-xs rounded ${idx === i ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>{i + 1}</button>
        ))}
      </div>
    </GameShell>
  );
}
