import React, { useContext, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const PALETTE = ["#000000", "#ffffff", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#a16207", "#94a3b8"];
const SIZES = [16, 24, 32];

export default function PixelArtPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [size, setSize] = useState(16);
  const [grid, setGrid] = useState(() => Array.from({ length: 16 * 16 }, () => "transparent"));
  const [color, setColor] = useState("#000000");
  const [erase, setErase] = useState(false);
  const dragRef = useRef(false);

  const reset = (s) => { setSize(s); setGrid(Array.from({ length: s * s }, () => "transparent")); };
  const paint = (i) => setGrid((g) => g.map((c, j) => j === i ? (erase ? "transparent" : color) : c));

  const exportPng = () => {
    const cell = 16;
    const canvas = document.createElement("canvas");
    canvas.width = size * cell; canvas.height = size * cell;
    const ctx = canvas.getContext("2d");
    grid.forEach((c, i) => {
      if (c === "transparent") return;
      ctx.fillStyle = c;
      ctx.fillRect((i % size) * cell, Math.floor(i / size) * cell, cell, cell);
    });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `pixel-art-${Date.now()}.png`;
    a.click();
  };

  return (
    <GameShell title={isEl ? "Pixel Art" : "Pixel Art"} description={isEl ? "Ζωγράφισε pixel-pixel" : "Paint pixel by pixel"} emoji="🟦" canonical="/games/pixel-art" back="/games">
      <div className="flex justify-center gap-2 mb-3">
        {SIZES.map((s) => (
          <button key={s} onClick={() => reset(s)} className={`px-3 py-1 text-xs rounded ${size === s ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>
            {s}×{s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-3 justify-center">
        {PALETTE.map((c) => (
          <button key={c} onClick={() => { setColor(c); setErase(false); }} className={`w-7 h-7 rounded border-2 ${!erase && color === c ? "border-purple-600 scale-110" : "border-slate-300"}`} style={{ background: c }} />
        ))}
        <button onClick={() => setErase(!erase)} className={`px-3 py-1 text-xs rounded ${erase ? "bg-rose-500 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>🧹</button>
      </div>
      <div
        className="inline-grid mx-auto border-2 border-slate-700 bg-checkered select-none"
        style={{ gridTemplateColumns: `repeat(${size}, ${size === 32 ? 14 : size === 24 ? 18 : 24}px)`, backgroundImage: "linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px" }}
        onMouseLeave={() => { dragRef.current = false; }}
      >
        {grid.map((c, i) => (
          <div
            key={i}
            onMouseDown={() => { dragRef.current = true; paint(i); }}
            onMouseEnter={() => dragRef.current && paint(i)}
            onMouseUp={() => { dragRef.current = false; }}
            onTouchStart={() => paint(i)}
            className="cursor-pointer"
            style={{ width: size === 32 ? 14 : size === 24 ? 18 : 24, height: size === 32 ? 14 : size === 24 ? 18 : 24, background: c }}
          />
        ))}
      </div>
      <div className="mt-3 text-center flex gap-2 justify-center flex-wrap">
        <button onClick={() => reset(size)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">{isEl ? "Καθαρισμός" : "Clear"}</button>
        <button onClick={exportPng} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg">⬇ PNG</button>
      </div>
    </GameShell>
  );
}
