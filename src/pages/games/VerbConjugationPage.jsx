import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const VERBS = {
  el: [
    { inf: "γράφω", forms: { "εγώ": "γράφω", "εσύ": "γράφεις", "αυτός": "γράφει", "εμείς": "γράφουμε", "εσείς": "γράφετε", "αυτοί": "γράφουν" } },
    { inf: "παίζω", forms: { "εγώ": "παίζω", "εσύ": "παίζεις", "αυτός": "παίζει", "εμείς": "παίζουμε", "εσείς": "παίζετε", "αυτοί": "παίζουν" } },
    { inf: "τρέχω", forms: { "εγώ": "τρέχω", "εσύ": "τρέχεις", "αυτός": "τρέχει", "εμείς": "τρέχουμε", "εσείς": "τρέχετε", "αυτοί": "τρέχουν" } },
    { inf: "διαβάζω", forms: { "εγώ": "διαβάζω", "εσύ": "διαβάζεις", "αυτός": "διαβάζει", "εμείς": "διαβάζουμε", "εσείς": "διαβάζετε", "αυτοί": "διαβάζουν" } },
  ],
  en: [
    { inf: "to be", forms: { "I": "am", "you": "are", "he": "is", "we": "are", "you (pl)": "are", "they": "are" } },
    { inf: "to have", forms: { "I": "have", "you": "have", "he": "has", "we": "have", "you (pl)": "have", "they": "have" } },
    { inf: "to go", forms: { "I": "go", "you": "go", "he": "goes", "we": "go", "you (pl)": "go", "they": "go" } },
    { inf: "to do", forms: { "I": "do", "you": "do", "he": "does", "we": "do", "you (pl)": "do", "they": "do" } },
  ],
};

function pickQ(lang) {
  const list = VERBS[lang] || VERBS.en;
  const v = list[Math.floor(Math.random() * list.length)];
  const persons = Object.keys(v.forms);
  const p = persons[Math.floor(Math.random() * persons.length)];
  return { inf: v.inf, person: p, ans: v.forms[p], allPersons: persons, allForms: v.forms };
}

export default function VerbConjugationPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => pickQ(lang));
  const opts = useMemo(() => {
    const set = new Set([q.ans]);
    Object.values(q.allForms).forEach((v) => { if (set.size < 4) set.add(v); });
    while (set.size < 4) set.add(q.ans + Math.random().toString(36).slice(2, 4));
    return Array.from(set).sort(() => Math.random() - 0.5);
  }, [q]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const choose = (o) => {
    if (o === q.ans) {
      setScore((s) => s + 1);
      setFeedback("✅");
      setTimeout(() => { setQ(pickQ(lang)); setFeedback(""); }, 600);
    } else {
      setFeedback("❌");
    }
  };

  return (
    <GameShell title={isEl ? "Κλίση Ρημάτων" : "Verb Conjugation"} description={isEl ? "Διάλεξε τη σωστή μορφή" : "Pick the correct form"} emoji="📖" canonical="/games/verbs" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-3">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <div className="text-2xl mb-2">
          <span className="text-slate-500">{q.inf}</span>
        </div>
        <div className="text-3xl font-extrabold mb-4 text-blue-600">{q.person} ___</div>
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          {opts.map((o) => (
            <button key={o} onClick={() => choose(o)} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl">
              {o}
            </button>
          ))}
        </div>
        {feedback && <div className="mt-3 text-2xl">{feedback}</div>}
      </div>
    </GameShell>
  );
}
