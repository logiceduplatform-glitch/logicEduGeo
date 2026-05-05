import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import FirstTimeTip from "../../components/games/FirstTimeTip";
import { LanguageContext } from "../../i18n/LanguageContext";

const BASES = ["A", "T", "G", "C"];
const PAIR = { A: "T", T: "A", G: "C", C: "G" };
const COLORS = { A: "#ef4444", T: "#3b82f6", G: "#22c55e", C: "#eab308" };

const LENGTH = 10;

function genTemplate() {
  return Array.from({ length: LENGTH }, () => BASES[Math.floor(Math.random() * 4)]);
}

export default function DNABuilderPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [template, setTemplate] = useState(genTemplate());
  const [user, setUser] = useState(Array(LENGTH).fill(""));
  const [solved, setSolved] = useState(0);
  const correct = useMemo(() => template.map((b) => PAIR[b]), [template]);
  const isComplete = user.every((u, i) => u === correct[i]);

  const setBase = (idx, base) => {
    setUser((u) => {
      const next = u.slice(); next[idx] = base; return next;
    });
  };

  React.useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => {
        setSolved((s) => s + 1);
        setTemplate(genTemplate());
        setUser(Array(LENGTH).fill(""));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isComplete]);

  return (
    <GameShell title={isEl ? "DNA Builder" : "DNA Builder"} description={isEl ? "Ταίριαξε τα ζεύγη βάσεων (A-T, G-C)" : "Pair the bases (A-T, G-C)"} emoji="🧬" canonical="/games/dna" back="/games">
      <FirstTimeTip
        id="dna"
        title={isEl ? "🧬 Κανόνες ζεύγους" : "🧬 Pairing rules"}
        body={isEl
          ? "Στο DNA, η Αδενίνη (A) ζευγαρώνει πάντα με τη Θυμίνη (T) και η Γουανίνη (G) με την Κυτοσίνη (C). Χτίσε τη συμπληρωματική κλώνο!"
          : "In DNA, Adenine (A) always pairs with Thymine (T) and Guanine (G) with Cytosine (C). Build the complementary strand!"}
      />
      <div className="text-center text-sm mb-3">{isEl ? "Λυμένα" : "Solved"}: <b>{solved}</b></div>
      <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-3 overflow-x-auto">
        <div className="inline-block">
          <div className="flex gap-1 mb-1">
            {template.map((b, i) => (
              <div key={i} className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-sm" style={{ background: COLORS[b] }}>{b}</div>
            ))}
          </div>
          <div className="flex gap-1 my-1 ml-2">
            {template.map((_, i) => <div key={i} className="w-9 text-center text-slate-400">|</div>)}
          </div>
          <div className="flex gap-1">
            {user.map((b, i) => {
              const wrong = b && b !== correct[i];
              return (
                <div key={i} className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm border-2 ${b ? "" : "border-dashed border-slate-400"} ${wrong ? "ring-2 ring-rose-500" : ""}`}
                  style={{ background: b ? COLORS[b] : "transparent", color: b ? "white" : "transparent" }}>{b || "?"}</div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-slate-500 mb-2 text-center">{isEl ? "Διάλεξε τη θέση και τη βάση" : "Pick a position and a base"}</div>
        <div className="flex justify-center gap-1 mb-2 flex-wrap">
          {BASES.map((b) => (
            <button key={b} onClick={() => {
              const next = user.findIndex((x) => !x);
              if (next !== -1) setBase(next, b);
            }} className="w-12 h-12 rounded-full font-bold text-white text-lg" style={{ background: COLORS[b] }}>{b}</button>
          ))}
          <button onClick={() => setUser(Array(LENGTH).fill(""))} className="px-3 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg font-bold text-sm">↺</button>
        </div>
        {isComplete && <div className="text-center text-2xl font-extrabold text-emerald-600 mt-3">🎉 {isEl ? "Σωστά!" : "Correct!"}</div>}
      </div>

      <div className="mt-4 text-xs text-slate-500 text-center">
        🔴 A · 🔵 T · 🟢 G · 🟡 C
      </div>
    </GameShell>
  );
}
