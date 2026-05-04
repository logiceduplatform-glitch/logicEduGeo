import React, { useContext, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COUNTRIES = [
  { flag: "🇬🇷", el: "Ελλάδα",      en: "Greece",        cap_el: "Αθήνα",       cap_en: "Athens" },
  { flag: "🇫🇷", el: "Γαλλία",      en: "France",        cap_el: "Παρίσι",      cap_en: "Paris" },
  { flag: "🇩🇪", el: "Γερμανία",    en: "Germany",       cap_el: "Βερολίνο",    cap_en: "Berlin" },
  { flag: "🇮🇹", el: "Ιταλία",      en: "Italy",         cap_el: "Ρώμη",         cap_en: "Rome" },
  { flag: "🇪🇸", el: "Ισπανία",     en: "Spain",         cap_el: "Μαδρίτη",      cap_en: "Madrid" },
  { flag: "🇬🇧", el: "Αγγλία",      en: "UK",            cap_el: "Λονδίνο",      cap_en: "London" },
  { flag: "🇵🇹", el: "Πορτογαλία",  en: "Portugal",      cap_el: "Λισαβόνα",     cap_en: "Lisbon" },
  { flag: "🇳🇱", el: "Ολλανδία",    en: "Netherlands",   cap_el: "Άμστερνταμ",   cap_en: "Amsterdam" },
  { flag: "🇧🇪", el: "Βέλγιο",      en: "Belgium",       cap_el: "Βρυξέλλες",   cap_en: "Brussels" },
  { flag: "🇸🇪", el: "Σουηδία",     en: "Sweden",        cap_el: "Στοκχόλμη",   cap_en: "Stockholm" },
  { flag: "🇳🇴", el: "Νορβηγία",    en: "Norway",        cap_el: "Όσλο",         cap_en: "Oslo" },
  { flag: "🇫🇮", el: "Φινλανδία",   en: "Finland",       cap_el: "Ελσίνκι",     cap_en: "Helsinki" },
  { flag: "🇩🇰", el: "Δανία",       en: "Denmark",       cap_el: "Κοπεγχάγη",   cap_en: "Copenhagen" },
  { flag: "🇵🇱", el: "Πολωνία",     en: "Poland",        cap_el: "Βαρσοβία",    cap_en: "Warsaw" },
  { flag: "🇨🇿", el: "Τσεχία",      en: "Czechia",       cap_el: "Πράγα",        cap_en: "Prague" },
  { flag: "🇦🇹", el: "Αυστρία",     en: "Austria",       cap_el: "Βιέννη",       cap_en: "Vienna" },
  { flag: "🇨🇭", el: "Ελβετία",     en: "Switzerland",   cap_el: "Βέρνη",        cap_en: "Bern" },
  { flag: "🇮🇪", el: "Ιρλανδία",    en: "Ireland",       cap_el: "Δουβλίνο",     cap_en: "Dublin" },
  { flag: "🇺🇸", el: "ΗΠΑ",         en: "USA",           cap_el: "Ουάσιγκτον",  cap_en: "Washington" },
  { flag: "🇨🇦", el: "Καναδάς",     en: "Canada",        cap_el: "Οτάβα",        cap_en: "Ottawa" },
  { flag: "🇲🇽", el: "Μεξικό",      en: "Mexico",        cap_el: "Μέξικο Σίτι",  cap_en: "Mexico City" },
  { flag: "🇧🇷", el: "Βραζιλία",    en: "Brazil",        cap_el: "Μπραζίλια",   cap_en: "Brasília" },
  { flag: "🇦🇷", el: "Αργεντινή",   en: "Argentina",     cap_el: "Μπουένος Άιρες", cap_en: "Buenos Aires" },
  { flag: "🇯🇵", el: "Ιαπωνία",     en: "Japan",         cap_el: "Τόκιο",        cap_en: "Tokyo" },
  { flag: "🇨🇳", el: "Κίνα",        en: "China",         cap_el: "Πεκίνο",       cap_en: "Beijing" },
  { flag: "🇮🇳", el: "Ινδία",       en: "India",         cap_el: "Νέο Δελχί",    cap_en: "New Delhi" },
  { flag: "🇦🇺", el: "Αυστραλία",   en: "Australia",     cap_el: "Καμπέρα",     cap_en: "Canberra" },
  { flag: "🇪🇬", el: "Αίγυπτος",    en: "Egypt",         cap_el: "Κάιρο",        cap_en: "Cairo" },
];

function pick() {
  const correct = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const set = new Set([correct]);
  while (set.size < 4) set.add(COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]);
  return { correct, opts: Array.from(set).sort(() => Math.random() - 0.5) };
}

export default function CapitalsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => pick());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const choose = (o) => {
    if (o === q.correct) {
      setScore((s) => s + 1);
      setFeedback("✅");
      setTimeout(() => { setQ(pick()); setFeedback(""); }, 500);
    } else setFeedback("❌");
  };

  return (
    <GameShell title={isEl ? "Πρωτεύουσες" : "Capitals"} description={isEl ? "Ποια είναι η πρωτεύουσα;" : "What's the capital?"} emoji="🌍" canonical="/games/capitals" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-2">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <div className="text-7xl mb-2">{q.correct.flag}</div>
        <div className="text-2xl font-bold mb-4">{isEl ? q.correct.el : q.correct.en}</div>
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          {q.opts.map((o) => (
            <button key={o.cap_en} onClick={() => choose(o)} className="px-3 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl">
              {isEl ? o.cap_el : o.cap_en}
            </button>
          ))}
        </div>
        {feedback && <div className="mt-3 text-2xl">{feedback}</div>}
      </div>
    </GameShell>
  );
}
