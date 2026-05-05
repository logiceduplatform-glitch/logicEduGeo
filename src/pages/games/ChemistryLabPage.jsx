import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import FirstTimeTip from "../../components/games/FirstTimeTip";
import { LanguageContext } from "../../i18n/LanguageContext";

const ELEMENTS = [
  { sym: "H",  el: "Υδρογόνο",  en: "Hydrogen", color: "bg-cyan-400" },
  { sym: "O",  el: "Οξυγόνο",   en: "Oxygen",   color: "bg-blue-500" },
  { sym: "C",  el: "Άνθρακας",  en: "Carbon",   color: "bg-slate-700" },
  { sym: "N",  el: "Άζωτο",     en: "Nitrogen", color: "bg-indigo-500" },
  { sym: "Na", el: "Νάτριο",    en: "Sodium",   color: "bg-amber-500" },
  { sym: "Cl", el: "Χλώριο",    en: "Chlorine", color: "bg-emerald-500" },
  { sym: "Fe", el: "Σίδηρος",   en: "Iron",     color: "bg-rose-700" },
  { sym: "Cu", el: "Χαλκός",    en: "Copper",   color: "bg-orange-600" },
];

// formula key = sorted "sym:count,sym:count..."
const REACTIONS = {
  "H:2,O:1": { el: "Νερό", en: "Water", formula: "H₂O", emoji: "💧" },
  "C:1,O:2": { el: "Διοξείδιο Άνθρακα", en: "Carbon Dioxide", formula: "CO₂", emoji: "🫧" },
  "Cl:1,Na:1": { el: "Αλάτι", en: "Salt", formula: "NaCl", emoji: "🧂" },
  "H:1,N:3": { el: "Αμμωνία", en: "Ammonia", formula: "NH₃", emoji: "💨" },
  "H:2,O:2": { el: "Υπεροξείδιο", en: "Hydrogen Peroxide", formula: "H₂O₂", emoji: "🧪" },
  "H:2,C:1,O:1": { el: "Φορμαλδεΰδη", en: "Formaldehyde", formula: "CH₂O", emoji: "🌫️" },
  "C:1,H:4": { el: "Μεθάνιο", en: "Methane", formula: "CH₄", emoji: "🔥" },
  "Cu:1,O:1": { el: "Οξείδιο Χαλκού", en: "Copper Oxide", formula: "CuO", emoji: "🟫" },
  "Fe:2,O:3": { el: "Σκουριά", en: "Rust", formula: "Fe₂O₃", emoji: "🟤" },
};

function key(items) {
  const counts = {};
  items.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
  return Object.keys(counts).sort().map((k) => `${k}:${counts[k]}`).join(",");
}

export default function ChemistryLabPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [beaker, setBeaker] = useState([]);
  const [discovered, setDiscovered] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chemDiscovered") || "[]"); } catch { return []; }
  });

  const result = useMemo(() => REACTIONS[key(beaker)] || null, [beaker]);

  React.useEffect(() => {
    if (result && !discovered.includes(result.formula)) {
      const next = [...discovered, result.formula];
      setDiscovered(next);
      localStorage.setItem("chemDiscovered", JSON.stringify(next));
    }
  }, [result]); // eslint-disable-line

  const add = (sym) => { if (beaker.length < 6) setBeaker((b) => [...b, sym]); };
  const reset = () => setBeaker([]);

  return (
    <GameShell title={isEl ? "Χημικό Εργαστήριο" : "Chemistry Lab"} description={isEl ? "Συνδύασε στοιχεία και δες τι θα φτιάξεις!" : "Mix elements and discover compounds!"} emoji="🧪" canonical="/games/chemistry" back="/games">
      <FirstTimeTip
        id="chemistry"
        title={isEl ? "🧪 Πώς παίζεται" : "🧪 How to play"}
        body={isEl
          ? "Πάτα στοιχεία για να τα προσθέσεις στο μπεκερ. Δοκίμασε π.χ. 2 H + 1 O = Νερό! Ψάξε όλες τις 9 ενώσεις."
          : "Tap elements to add them to the beaker. Try e.g. 2 H + 1 O = Water! Discover all 9 compounds."}
      />
      <div className="text-center mb-3">
        <div className="text-xs text-slate-500 mb-2">{isEl ? "Πάτα στοιχεία για να τα προσθέσεις (μέχρι 6)" : "Tap elements to add (max 6)"}</div>
        <div className="grid grid-cols-4 gap-2">
          {ELEMENTS.map((e) => (
            <button key={e.sym} onClick={() => add(e.sym)}
              className={`${e.color} text-white rounded-lg p-2 font-bold hover:scale-105 active:scale-95 transition-transform`}>
              <div className="text-xl">{e.sym}</div>
              <div className="text-[10px] opacity-90">{isEl ? e.el : e.en}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-100 to-blue-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 mb-3 min-h-[120px] flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {beaker.length === 0 && <span className="text-slate-400 italic text-sm">{isEl ? "Άδειο μπεκερ" : "Empty beaker"}</span>}
          {beaker.map((s, i) => (
            <span key={i} className="bg-white/80 px-2 py-1 rounded font-bold text-slate-800 text-sm">{s}</span>
          ))}
        </div>
        {result && (
          <div className="text-center mt-2">
            <div className="text-4xl">{result.emoji}</div>
            <div className="font-extrabold text-lg">{isEl ? result.el : result.en}</div>
            <div className="font-mono text-xl">{result.formula}</div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mb-3">
        <button onClick={reset} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">↺ {isEl ? "Άδειασμα" : "Empty"}</button>
      </div>

      <div className="text-xs">
        <div className="font-bold text-slate-500 mb-1">🔬 {isEl ? "Ανακαλύφθηκαν" : "Discovered"}: {discovered.length}/{Object.keys(REACTIONS).length}</div>
        <div className="flex flex-wrap gap-1">
          {Object.values(REACTIONS).map((r) => (
            <span key={r.formula} className={`px-2 py-1 rounded font-mono text-xs ${discovered.includes(r.formula) ? "bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
              {discovered.includes(r.formula) ? r.formula : "?".repeat(r.formula.length)}
            </span>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
