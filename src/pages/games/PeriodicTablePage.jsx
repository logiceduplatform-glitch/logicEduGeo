import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const ELEMENTS = [
  { z: 1, sym: "H",  el: "Υδρογόνο", en: "Hydrogen", g: "nonmetal", row: 1, col: 1 },
  { z: 2, sym: "He", el: "Ήλιο", en: "Helium", g: "noble", row: 1, col: 18 },
  { z: 3, sym: "Li", el: "Λίθιο", en: "Lithium", g: "alkali", row: 2, col: 1 },
  { z: 4, sym: "Be", el: "Βηρύλλιο", en: "Beryllium", g: "alkaline", row: 2, col: 2 },
  { z: 5, sym: "B",  el: "Βόριο", en: "Boron", g: "metalloid", row: 2, col: 13 },
  { z: 6, sym: "C",  el: "Άνθρακας", en: "Carbon", g: "nonmetal", row: 2, col: 14 },
  { z: 7, sym: "N",  el: "Άζωτο", en: "Nitrogen", g: "nonmetal", row: 2, col: 15 },
  { z: 8, sym: "O",  el: "Οξυγόνο", en: "Oxygen", g: "nonmetal", row: 2, col: 16 },
  { z: 9, sym: "F",  el: "Φθόριο", en: "Fluorine", g: "halogen", row: 2, col: 17 },
  { z: 10, sym: "Ne", el: "Νέον", en: "Neon", g: "noble", row: 2, col: 18 },
  { z: 11, sym: "Na", el: "Νάτριο", en: "Sodium", g: "alkali", row: 3, col: 1 },
  { z: 12, sym: "Mg", el: "Μαγνήσιο", en: "Magnesium", g: "alkaline", row: 3, col: 2 },
  { z: 13, sym: "Al", el: "Αλουμίνιο", en: "Aluminum", g: "metal", row: 3, col: 13 },
  { z: 14, sym: "Si", el: "Πυρίτιο", en: "Silicon", g: "metalloid", row: 3, col: 14 },
  { z: 15, sym: "P",  el: "Φωσφόρος", en: "Phosphorus", g: "nonmetal", row: 3, col: 15 },
  { z: 16, sym: "S",  el: "Θείο", en: "Sulfur", g: "nonmetal", row: 3, col: 16 },
  { z: 17, sym: "Cl", el: "Χλώριο", en: "Chlorine", g: "halogen", row: 3, col: 17 },
  { z: 18, sym: "Ar", el: "Αργό", en: "Argon", g: "noble", row: 3, col: 18 },
  { z: 19, sym: "K",  el: "Κάλιο", en: "Potassium", g: "alkali", row: 4, col: 1 },
  { z: 20, sym: "Ca", el: "Ασβέστιο", en: "Calcium", g: "alkaline", row: 4, col: 2 },
  { z: 26, sym: "Fe", el: "Σίδηρος", en: "Iron", g: "metal", row: 4, col: 8 },
  { z: 29, sym: "Cu", el: "Χαλκός", en: "Copper", g: "metal", row: 4, col: 11 },
  { z: 30, sym: "Zn", el: "Ψευδάργυρος", en: "Zinc", g: "metal", row: 4, col: 12 },
  { z: 47, sym: "Ag", el: "Άργυρος", en: "Silver", g: "metal", row: 5, col: 11 },
  { z: 53, sym: "I",  el: "Ιώδιο", en: "Iodine", g: "halogen", row: 5, col: 17 },
  { z: 79, sym: "Au", el: "Χρυσός", en: "Gold", g: "metal", row: 6, col: 11 },
  { z: 80, sym: "Hg", el: "Υδράργυρος", en: "Mercury", g: "metal", row: 6, col: 12 },
];

const COLORS = {
  alkali: "bg-rose-400",
  alkaline: "bg-orange-400",
  metal: "bg-slate-400",
  metalloid: "bg-emerald-400",
  nonmetal: "bg-sky-400",
  halogen: "bg-amber-400",
  noble: "bg-purple-400",
};

export default function PeriodicTablePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [sel, setSel] = useState(null);

  return (
    <GameShell title={isEl ? "Περιοδικός Πίνακας" : "Periodic Table"} description={isEl ? "Πάτα ένα στοιχείο για πληροφορίες" : "Tap an element for info"} emoji="🧪" canonical="/games/periodic" back="/games">
      <div className="overflow-x-auto">
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: "repeat(18, minmax(28px, 1fr))", minWidth: 540 }}>
          {ELEMENTS.map((e) => (
            <button
              key={e.z}
              onClick={() => setSel(e)}
              className={`${COLORS[e.g]} hover:scale-110 transition-transform rounded text-white font-bold p-1 text-xs`}
              style={{ gridColumn: e.col, gridRow: e.row }}
              title={isEl ? e.el : e.en}
            >
              <div className="text-[9px] opacity-80">{e.z}</div>
              <div className="text-sm">{e.sym}</div>
            </button>
          ))}
        </div>
      </div>
      {sel && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3">
            <div className={`${COLORS[sel.g]} w-16 h-16 flex flex-col items-center justify-center text-white rounded-lg`}>
              <div className="text-xs">{sel.z}</div>
              <div className="text-2xl font-bold">{sel.sym}</div>
            </div>
            <div>
              <div className="font-extrabold text-xl">{isEl ? sel.el : sel.en}</div>
              <div className="text-sm text-slate-500">{sel.g}</div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {Object.entries(COLORS).map(([k, c]) => (
          <span key={k} className={`${c} text-white px-2 py-1 rounded`}>{k}</span>
        ))}
      </div>
    </GameShell>
  );
}
