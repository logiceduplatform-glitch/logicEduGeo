import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "STEM & Επιστήμη", subtitle: "Πειραματίσου σαν επιστήμονας!" },
  en: { title: "STEM & Science", subtitle: "Experiment like a scientist!" },
};

const GAMES = [
  { path: "/games/chemistry", emoji: "🧪", color: "from-purple-500 to-indigo-600", el: "Χημικό Εργαστήριο", en: "Chemistry Lab", descEl: "Συνδύασε στοιχεία", descEn: "Mix elements" },
  { path: "/games/physics",   emoji: "⚙️", color: "from-slate-500 to-slate-700",   el: "Φυσικό Sandbox",   en: "Physics Sandbox", descEl: "Βαρύτητα & μπάλες", descEn: "Gravity & balls" },
  { path: "/games/solar-system", emoji: "🌌", color: "from-indigo-700 to-purple-900", el: "Ηλιακό Σύστημα", en: "Solar System", descEl: "Πλανήτες σε τροχιά", descEn: "Planets in orbit" },
  { path: "/games/dna",       emoji: "🧬", color: "from-emerald-500 to-cyan-600",  el: "DNA Builder",      en: "DNA Builder",   descEl: "Ζεύγη βάσεων", descEn: "Base pairs" },
  { path: "/games/circuit",   emoji: "🔌", color: "from-yellow-500 to-amber-600",  el: "Φτιάξε Κύκλωμα",   en: "Circuit Builder", descEl: "Λάμπες & μοτέρ", descEn: "Bulbs & motors" },
  { path: "/games/weather",   emoji: "🌦️", color: "from-blue-500 to-cyan-600",     el: "Καιρός Σιμουλέισον", en: "Weather Sim", descEl: "Φτιάξε καταιγίδα!", descEn: "Make a storm!" },
  { path: "/games/ecosystem", emoji: "🌳", color: "from-green-500 to-emerald-600", el: "Οικοσύστημα",     en: "Ecosystem",     descEl: "Τροφική αλυσίδα", descEn: "Food chain" },
];

export default function STEMGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/stem" />
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🔬</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{l.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map((g) => (
              <Link key={g.path} to={g.path} className={`bg-gradient-to-br ${g.color} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}>
                <div className="text-5xl mb-2">{g.emoji}</div>
                <div className="font-extrabold text-xl">{lang === "el" ? g.el : g.en}</div>
                <div className="text-sm opacity-90 mt-1">{lang === "el" ? g.descEl : g.descEn}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
