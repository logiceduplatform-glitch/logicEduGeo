import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Παιχνίδια Δράσης", subtitle: "Δοκίμασε αντανακλαστικά & ταχύτητα!" },
  en: { title: "Action & Reflex Games", subtitle: "Test reflexes & speed!" },
};

const GAMES = [
  { path: "/games/reaction",       emoji: "⚡", color: "from-emerald-500 to-teal-600",  el: "Χρόνος Αντίδρασης", en: "Reaction Time", descEl: "Πάτα μόλις πρασινίσει", descEn: "Tap when it goes green" },
  { path: "/games/color-match",    emoji: "🌈", color: "from-fuchsia-500 to-pink-600",  el: "Ταίριαξε Χρώμα",    en: "Color Match",    descEl: "Λέξη vs χρώμα (Stroop)", descEn: "Word vs color (Stroop)" },
  { path: "/games/falling-letters", emoji: "🔡", color: "from-blue-500 to-indigo-600",  el: "Πέφτουν Γράμματα",  en: "Falling Letters", descEl: "Πληκτρολόγησε γρήγορα", descEn: "Type fast" },
  { path: "/games/bubble-pop",     emoji: "🫧", color: "from-cyan-400 to-blue-500",     el: "Σκάσε Φούσκες",     en: "Bubble Pop",     descEl: "30'' σκάσιμο", descEn: "30s popping" },
  { path: "/games/memory-sequence", emoji: "🧠", color: "from-purple-500 to-violet-700", el: "Memory Sequence",  en: "Memory Sequence", descEl: "Simon Says", descEn: "Simon Says" },
  { path: "/games/quick-math",     emoji: "🧮", color: "from-orange-500 to-red-500",    el: "Quick Math",        en: "Quick Math",     descEl: "Σωστό/Λάθος", descEn: "True/False" },
  { path: "/games/speed-reading",  emoji: "📚", color: "from-amber-500 to-yellow-600",  el: "Γρήγορη Ανάγνωση",  en: "Speed Reading",  descEl: "Λέξη-λέξη + κατανόηση", descEn: "Word-by-word + comprehension" },
  { path: "/games/tap-dance",      emoji: "🎮", color: "from-pink-500 to-rose-600",     el: "Tap Dance",         en: "Tap Dance",      descEl: "Ρυθμικό παιχνίδι", descEn: "Rhythm game" },
];

export default function ActionGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/action" />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">⚡</div>
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
