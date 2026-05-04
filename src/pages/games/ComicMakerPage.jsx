import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const CHARACTERS = ["🐱", "🐶", "🐰", "🦊", "🐻", "🦁", "🐼", "🦄", "🐸", "🐵", "🤖", "👽", "🧙", "🦸", "🧚"];
const BACKGROUNDS = [
  { id: "forest",  emoji: "🌳", name: { el: "Δάσος", en: "Forest" }, color: "from-green-300 to-green-500" },
  { id: "beach",   emoji: "🏖️", name: { el: "Παραλία", en: "Beach" }, color: "from-yellow-200 to-blue-400" },
  { id: "space",   emoji: "🚀", name: { el: "Διάστημα", en: "Space" }, color: "from-indigo-900 to-purple-900" },
  { id: "city",    emoji: "🏙️", name: { el: "Πόλη", en: "City" }, color: "from-slate-400 to-slate-600" },
  { id: "castle",  emoji: "🏰", name: { el: "Κάστρο", en: "Castle" }, color: "from-purple-300 to-pink-400" },
  { id: "ocean",   emoji: "🌊", name: { el: "Ωκεανός", en: "Ocean" }, color: "from-blue-400 to-cyan-600" },
];

function Panel({ panel, onChange, idx, isEl }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className={`relative bg-gradient-to-br ${panel.bg.color} rounded-xl border-2 border-slate-800 overflow-hidden aspect-square`}>
      <div className="absolute top-1 left-1 bg-white/80 px-1 rounded text-xs font-bold">{idx + 1}</div>
      <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">{panel.bg.emoji}</div>
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-6xl">{panel.char}</div>
      {panel.text && (
        <div className="absolute top-2 right-2 max-w-[60%] bg-white text-slate-900 rounded-2xl p-2 text-xs font-bold shadow-md border border-slate-300">
          {panel.text}
          <div className="absolute -bottom-2 left-4 w-3 h-3 bg-white border-r border-b border-slate-300 transform rotate-45" />
        </div>
      )}
      <button onClick={() => setEditing(!editing)} className="absolute bottom-1 right-1 bg-white/80 px-2 py-0.5 rounded text-xs font-bold">
        ✏️
      </button>
      {editing && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 p-2 overflow-auto z-10">
          <input value={panel.text} onChange={(e) => onChange({ ...panel, text: e.target.value })} placeholder={isEl ? "Λέει..." : "Says..."} className="w-full px-2 py-1 text-xs rounded border mb-1 dark:bg-slate-900" />
          <div className="flex flex-wrap gap-0.5 mb-1">
            {CHARACTERS.map((c) => <button key={c} onClick={() => onChange({ ...panel, char: c })} className={`text-xl ${panel.char === c ? "bg-purple-200 dark:bg-purple-700" : ""} rounded px-0.5`}>{c}</button>)}
          </div>
          <div className="flex flex-wrap gap-0.5">
            {BACKGROUNDS.map((b) => <button key={b.id} onClick={() => onChange({ ...panel, bg: b })} className={`text-xl ${panel.bg.id === b.id ? "bg-purple-200 dark:bg-purple-700" : ""} rounded px-0.5`}>{b.emoji}</button>)}
          </div>
          <button onClick={() => setEditing(false)} className="mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded">OK</button>
        </div>
      )}
    </div>
  );
}

export default function ComicMakerPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [panels, setPanels] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({ char: CHARACTERS[i % CHARACTERS.length], bg: BACKGROUNDS[i % BACKGROUNDS.length], text: "" }))
  );

  const update = (i, p) => setPanels((arr) => arr.map((x, j) => (j === i ? p : x)));

  return (
    <GameShell title={isEl ? "Φτιάξε Κόμικ" : "Comic Maker"} description={isEl ? "Διάλεξε ήρωες, φόντο και κείμενο για κάθε καρέ" : "Pick characters, backgrounds and dialogue"} emoji="💬" canonical="/games/comic-maker" back="/games">
      <div className="grid grid-cols-2 gap-3">
        {panels.map((p, i) => <Panel key={i} idx={i} panel={p} onChange={(np) => update(i, np)} isEl={isEl} />)}
      </div>
      <div className="mt-3 text-center text-xs text-slate-500">{isEl ? "Πάτα ✏️ σε κάθε καρέ για επεξεργασία" : "Tap ✏️ on each panel to edit"}</div>
    </GameShell>
  );
}
