import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const TEMPLATES = {
  el: [
    { template: "Μια [adj] μέρα, ο/η [name] πήγε στο [place] και βρήκε ένα/μια [noun]. Αμέσως άρχισε να [verb] με χαρά!", slots: ["adj", "name", "place", "noun", "verb"], labels: { adj: "επίθετο", name: "όνομα", place: "μέρος", noun: "ουσιαστικό", verb: "ρήμα" } },
    { template: "Στο [place], ο/η [name] είδε [number] [animal] να [verb] κάτω από ένα [adj] δέντρο.", slots: ["place", "name", "number", "animal", "verb", "adj"], labels: { place: "μέρος", name: "όνομα", number: "αριθμός", animal: "ζώο", verb: "ρήμα", adj: "επίθετο" } },
  ],
  en: [
    { template: "On a [adj] day, [name] went to the [place] and found a [noun]. Then they started to [verb] with joy!", slots: ["adj", "name", "place", "noun", "verb"], labels: { adj: "adjective", name: "name", place: "place", noun: "noun", verb: "verb" } },
    { template: "At the [place], [name] saw [number] [animal] [verb] under a [adj] tree.", slots: ["place", "name", "number", "animal", "verb", "adj"], labels: { place: "place", name: "name", number: "number", animal: "animal", verb: "verb", adj: "adjective" } },
  ],
};

export default function MadLibsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const list = TEMPLATES[lang] || TEMPLATES.en;
  const [tIdx, setTIdx] = useState(0);
  const [vals, setVals] = useState({});
  const [revealed, setRevealed] = useState(false);
  const t = list[tIdx];

  const result = useMemo(() => {
    let r = t.template;
    t.slots.forEach((s, i) => { r = r.replace(`[${s}]`, vals[s + i] || `[${t.labels[s]}]`); });
    return r;
  }, [t, vals]);

  const reset = () => { setVals({}); setRevealed(false); };
  const next = () => { setTIdx((i) => (i + 1) % list.length); reset(); };

  return (
    <GameShell title={isEl ? "Mad Libs" : "Mad Libs"} description={isEl ? "Συμπλήρωσε τις λέξεις και δες τι θα βγει!" : "Fill in words for a silly story!"} emoji="🎭" canonical="/games/mad-libs" back="/games">
      {!revealed && (
        <div className="space-y-2">
          {t.slots.map((s, i) => (
            <div key={i}>
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300 block">{t.labels[s]}</label>
              <input value={vals[s + i] || ""} onChange={(e) => setVals((v) => ({ ...v, [s + i]: e.target.value }))}
                className="w-full px-3 py-2 rounded border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
            </div>
          ))}
          <button onClick={() => setRevealed(true)} disabled={t.slots.some((s, i) => !vals[s + i])}
            className="w-full mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg">
            🎉 {isEl ? "Δες την ιστορία!" : "Show story!"}
          </button>
        </div>
      )}
      {revealed && (
        <>
          <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 rounded-2xl text-lg leading-relaxed border-2 border-yellow-400 dark:border-yellow-700">
            {result}
          </div>
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            <button onClick={reset} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg">↺ {isEl ? "Ξανά" : "Redo"}</button>
            <button onClick={next} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg">→ {isEl ? "Άλλη" : "Next"}</button>
          </div>
        </>
      )}
    </GameShell>
  );
}
