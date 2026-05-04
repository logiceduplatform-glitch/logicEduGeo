import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const PALETTE = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#000000", "#ffffff"];
const SIZE = 8;

export default function PatternDesignerPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [cells, setCells] = useState(() => Array.from({ length: SIZE * SIZE }, () => "#ffffff"));
  const [color, setColor] = useState(PALETTE[7]);
  const [symmetry, setSymmetry] = useState("h");
  const [drag, setDrag] = useState(false);

  const paint = (i) => {
    const x = i % SIZE, y = Math.floor(i / SIZE);
    setCells((arr) => {
      const next = arr.slice();
      const indices = [i];
      if (symmetry === "h" || symmetry === "both") indices.push(y * SIZE + (SIZE - 1 - x));
      if (symmetry === "v" || symmetry === "both") indices.push((SIZE - 1 - y) * SIZE + x);
      if (symmetry === "both") indices.push((SIZE - 1 - y) * SIZE + (SIZE - 1 - x));
      indices.forEach((j) => { next[j] = color; });
      return next;
    });
  };

  return (
    <GameShell title={isEl ? "Σχέδια & Μοτίβα" : "Pattern Designer"} description={isEl ? "Φτιάξε μαντήλι/πλακάκι με συμμετρία" : "Design tiles with symmetry"} emoji="🎨" canonical="/games/patterns" back="/games">
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {PALETTE.map((c) => (
          <button key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-2 ${color === c ? "border-purple-600 scale-125" : "border-slate-300"}`} style={{ background: c }} />
        ))}
      </div>
      <div className="flex gap-2 justify-center mb-3 text-xs">
        {[["none", isEl ? "Χωρίς" : "None"], ["h", isEl ? "Οριζ." : "Horiz"], ["v", isEl ? "Καθ." : "Vert"], ["both", isEl ? "Και τα 2" : "Both"]].map(([k, l]) => (
          <button key={k} onClick={() => setSymmetry(k)} className={`px-2 py-1 rounded ${symmetry === k ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>{l}</button>
        ))}
      </div>
      <div
        className="inline-grid mx-auto border-2 border-slate-700 select-none"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 32px)` }}
        onMouseLeave={() => setDrag(false)}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            onMouseDown={() => { setDrag(true); paint(i); }}
            onMouseEnter={() => drag && paint(i)}
            onMouseUp={() => setDrag(false)}
            onTouchStart={() => paint(i)}
            className="w-8 h-8 border border-slate-300 cursor-pointer"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="mt-3 text-center">
        <button onClick={() => setCells(Array.from({ length: SIZE * SIZE }, () => "#ffffff"))} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">
          {isEl ? "Καθαρισμός" : "Clear"}
        </button>
      </div>
    </GameShell>
  );
}
