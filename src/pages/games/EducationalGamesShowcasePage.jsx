import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Εκπαιδευτικά Παιχνίδια", subtitle: "Παίξε και μάθε ταυτόχρονα!" },
  en: { title: "Educational Games", subtitle: "Play and learn at the same time!" },
};

const GAMES = [
  { path: "/games/spelling-bee",   emoji: "🐝", color: "from-amber-500 to-orange-500",  el: "Spelling Bee",          en: "Spelling Bee",          descEl: "Άκου & γράψε", descEn: "Listen & spell" },
  { path: "/games/tell-time",      emoji: "🕐", color: "from-blue-500 to-cyan-500",     el: "Πες την Ώρα",           en: "Tell the Time",         descEl: "Διάβασε ρολόι", descEn: "Read the clock" },
  { path: "/games/money",          emoji: "💶", color: "from-emerald-500 to-teal-600",  el: "Μέτρα Χρήματα",         en: "Money Counter",         descEl: "Φτιάξε ποσό", descEn: "Make the amount" },
  { path: "/games/times-tables",   emoji: "✖️", color: "from-purple-500 to-pink-500",   el: "Αγώνας Προπαίδειας",   en: "Times Tables Race",     descEl: "60'' σπριντ", descEn: "60s sprint" },
  { path: "/games/map-greece",     emoji: "🇬🇷", color: "from-blue-600 to-cyan-600",     el: "Χάρτης Ελλάδας",        en: "Map of Greece",         descEl: "Περιφέρειες", descEn: "Regions" },
  { path: "/games/periodic",       emoji: "🧪", color: "from-violet-500 to-purple-600", el: "Περιοδικός Πίνακας",   en: "Periodic Table",        descEl: "Στοιχεία", descEn: "Elements" },
  { path: "/games/anatomy",        emoji: "🫀", color: "from-pink-500 to-rose-500",     el: "Σώμα Ανθρώπου",         en: "Body Parts",            descEl: "Ανατομία", descEn: "Anatomy" },
  { path: "/games/math-sprint",    emoji: "⚡", color: "from-orange-500 to-red-500",    el: "Math Sprint",           en: "Math Sprint",           descEl: "60'' μαθηματικά", descEn: "60s math" },
  { path: "/games/verbs",          emoji: "📖", color: "from-blue-500 to-indigo-600",   el: "Κλίση Ρημάτων",        en: "Verb Conjugation",      descEl: "Γραμματική", descEn: "Grammar" },
  { path: "/games/periodic-quiz",  emoji: "⚛️", color: "from-purple-500 to-fuchsia-500", el: "Quiz Στοιχείων",       en: "Periodic Quiz",         descEl: "Σύμβολα", descEn: "Symbols" },
  { path: "/games/capitals",       emoji: "🌍", color: "from-emerald-500 to-green-600", el: "Πρωτεύουσες",           en: "Capitals",              descEl: "Γεωγραφία", descEn: "Geography" },
  { path: "/games/history-timeline",emoji: "⏳", color: "from-amber-600 to-yellow-500", el: "Χρονογραμμή",           en: "History Timeline",      descEl: "Σειρά γεγονότων", descEn: "Order events" },
  { path: "/games/code-puzzles",   emoji: "🤖", color: "from-cyan-500 to-blue-600",     el: "Παζλ Κώδικα",          en: "Code Puzzles",          descEl: "Προγραμματισμός", descEn: "Coding" },
  { path: "/games/logic-gates",    emoji: "🔌", color: "from-slate-600 to-slate-800",   el: "Λογικές Πύλες",        en: "Logic Gates",           descEl: "AND/OR/XOR", descEn: "AND/OR/XOR" },
  { path: "/games/fraction-pizza", emoji: "🍕", color: "from-orange-500 to-red-600",    el: "Πίτσα Κλασμάτων",      en: "Fraction Pizza",        descEl: "Κλάσματα", descEn: "Fractions" },
  { path: "/games/music-notes",    emoji: "🎵", color: "from-indigo-500 to-purple-600", el: "Μουσικές Νότες",       en: "Music Notes",           descEl: "Πεντάγραμμο", descEn: "Read music" },
];

export default function EducationalGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/educational" />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🎓</div>
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
