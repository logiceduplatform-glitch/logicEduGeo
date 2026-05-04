import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const BLOCKS = [
  { id: "fwd",   label: { el: "Μπροστά", en: "Forward" }, color: "bg-blue-500" },
  { id: "left",  label: { el: "Αριστερά", en: "Turn Left" }, color: "bg-purple-500" },
  { id: "right", label: { el: "Δεξιά", en: "Turn Right" }, color: "bg-pink-500" },
  { id: "jump",  label: { el: "Πήδα", en: "Jump" }, color: "bg-orange-500" },
  { id: "say",   label: { el: "Πες Hi", en: "Say Hi" }, color: "bg-emerald-500" },
];

const BLOCK_MAP = Object.fromEntries(BLOCKS.map((b) => [b.id, b]));

const SIZE = 6;

export default function BlockCodingPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [program, setProgram] = useState([]);
  const [pos, setPos] = useState([0, 0]);
  const [dir, setDir] = useState(0); // 0=right, 1=down, 2=left, 3=up
  const [bubble, setBubble] = useState("");
  const [running, setRunning] = useState(false);

  const add = (id) => setProgram((p) => [...p, id]);
  const remove = (i) => setProgram((p) => p.filter((_, j) => j !== i));
  const reset = () => { setProgram([]); setPos([0, 0]); setDir(0); setBubble(""); };

  const run = async () => {
    setRunning(true);
    let p = [0, 0], d = 0;
    setPos(p); setDir(d); setBubble("");
    for (const id of program) {
      await new Promise((r) => setTimeout(r, 400));
      if (id === "fwd") {
        const [x, y] = p;
        let nx = x, ny = y;
        if (d === 0) nx = Math.min(SIZE - 1, x + 1);
        if (d === 1) ny = Math.min(SIZE - 1, y + 1);
        if (d === 2) nx = Math.max(0, x - 1);
        if (d === 3) ny = Math.max(0, y - 1);
        p = [nx, ny];
        setPos(p);
      }
      if (id === "left")  { d = (d + 3) % 4; setDir(d); }
      if (id === "right") { d = (d + 1) % 4; setDir(d); }
      if (id === "jump")  { setPos((q) => [q[0], q[1]]); }
      if (id === "say")   { setBubble(isEl ? "Γεια!" : "Hi!"); setTimeout(() => setBubble(""), 800); }
    }
    setRunning(false);
  };

  const cells = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) cells.push([x, y]);
  const arrow = ["➡️", "⬇️", "⬅️", "⬆️"][dir];

  return (
    <GameShell title={isEl ? "Block Coding" : "Block Coding"} description={isEl ? "Σύρε μπλοκ για να κινήσεις τον ήρωα" : "Stack blocks to move the hero"} emoji="🧩" canonical="/games/block-coding" back="/games">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">{isEl ? "Μπλοκ" : "Blocks"}</div>
          <div className="space-y-1">
            {BLOCKS.map((b) => (
              <button key={b.id} onClick={() => add(b.id)} className={`${b.color} hover:opacity-90 text-white font-bold rounded-lg px-3 py-2 text-sm w-full text-left`}>
                {b.label[lang] || b.label.en}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase mb-2">{isEl ? "Πρόγραμμα" : "Program"}</div>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 min-h-[180px] space-y-1 max-h-[240px] overflow-y-auto">
            {program.length === 0 && <div className="text-xs text-slate-400 text-center">{isEl ? "Πάτα μπλοκ ←" : "Tap blocks ←"}</div>}
            {program.map((id, i) => (
              <button key={i} onClick={() => remove(i)} className={`${BLOCK_MAP[id].color} text-white text-xs font-bold rounded px-2 py-1 w-full text-left`}>
                {i + 1}. {BLOCK_MAP[id].label[lang] || BLOCK_MAP[id].label.en} ✕
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="inline-grid mx-auto mt-4 border-2 border-slate-700 bg-emerald-100 dark:bg-emerald-900/20" style={{ gridTemplateColumns: `repeat(${SIZE}, 40px)` }}>
        {cells.map(([x, y]) => (
          <div key={`${x},${y}`} className="w-10 h-10 border border-slate-300 flex items-center justify-center text-2xl">
            {pos[0] === x && pos[1] === y && (
              <span className="relative">
                🤖
                <span className="absolute -top-2 -right-3 text-xs">{arrow}</span>
                {bubble && <span className="absolute -top-6 left-0 bg-white text-xs px-1 rounded">{bubble}</span>}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2 justify-center flex-wrap">
        <button onClick={run} disabled={running || program.length === 0} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg">▶ {isEl ? "Τρέξε" : "Run"}</button>
        <button onClick={reset} disabled={running} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">↺</button>
      </div>
    </GameShell>
  );
}
