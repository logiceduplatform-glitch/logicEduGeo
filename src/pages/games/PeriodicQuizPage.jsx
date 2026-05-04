import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const ITEMS = [
  { sym: "H",  el: "Υδρογόνο",  en: "Hydrogen" },
  { sym: "He", el: "Ήλιο",      en: "Helium" },
  { sym: "Li", el: "Λίθιο",     en: "Lithium" },
  { sym: "C",  el: "Άνθρακας",  en: "Carbon" },
  { sym: "N",  el: "Άζωτο",     en: "Nitrogen" },
  { sym: "O",  el: "Οξυγόνο",   en: "Oxygen" },
  { sym: "F",  el: "Φθόριο",    en: "Fluorine" },
  { sym: "Ne", el: "Νέον",      en: "Neon" },
  { sym: "Na", el: "Νάτριο",    en: "Sodium" },
  { sym: "Mg", el: "Μαγνήσιο",  en: "Magnesium" },
  { sym: "Al", el: "Αλουμίνιο", en: "Aluminum" },
  { sym: "Si", el: "Πυρίτιο",   en: "Silicon" },
  { sym: "P",  el: "Φωσφόρος",  en: "Phosphorus" },
  { sym: "S",  el: "Θείο",      en: "Sulfur" },
  { sym: "Cl", el: "Χλώριο",    en: "Chlorine" },
  { sym: "K",  el: "Κάλιο",     en: "Potassium" },
  { sym: "Ca", el: "Ασβέστιο",  en: "Calcium" },
  { sym: "Fe", el: "Σίδηρος",   en: "Iron" },
  { sym: "Cu", el: "Χαλκός",    en: "Copper" },
  { sym: "Au", el: "Χρυσός",    en: "Gold" },
  { sym: "Ag", el: "Άργυρος",   en: "Silver" },
  { sym: "Hg", el: "Υδράργυρος",en: "Mercury" },
];

function pickQ() {
  const correct = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const opts = new Set([correct]);
  while (opts.size < 4) opts.add(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
  return { correct, opts: Array.from(opts).sort(() => Math.random() - 0.5) };
}

export default function PeriodicQuizPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => pickQ());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const choose = (o) => {
    if (o.sym === q.correct.sym) {
      setScore((s) => s + 1);
      setFeedback("✅");
      setTimeout(() => { setQ(pickQ()); setFeedback(""); }, 500);
    } else setFeedback("❌");
  };

  return (
    <GameShell title={isEl ? "Quiz Στοιχείων" : "Periodic Quiz"} description={isEl ? "Ποιο σύμβολο είναι;" : "What's the symbol?"} emoji="⚛️" canonical="/games/periodic-quiz" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-3">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <div className="bg-purple-500 text-white w-32 h-32 mx-auto rounded-2xl flex items-center justify-center text-5xl font-extrabold mb-4">
          {q.correct.sym}
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          {q.opts.map((o) => (
            <button key={o.sym} onClick={() => choose(o)} className="px-3 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl">
              {isEl ? o.el : o.en}
            </button>
          ))}
        </div>
        {feedback && <div className="mt-3 text-2xl">{feedback}</div>}
      </div>
    </GameShell>
  );
}
