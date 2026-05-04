import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Όλα τα Νέα Παιχνίδια", subtitle: "59 νέα παιχνίδια — 6 κατηγορίες!" },
  en: { title: "All New Games", subtitle: "59 new games — 6 categories!" },
};

const GROUPS = [
  { path: "/games",             emoji: "🎮", color: "from-purple-500 to-pink-600",     el: "Κλασικά",         en: "Classics",       count: 10, desc: { el: "Wordle, 2048, Snake, Tetris...", en: "Wordle, 2048, Snake, Tetris..." } },
  { path: "/games/educational", emoji: "🎓", color: "from-emerald-500 to-blue-600",    el: "Εκπαιδευτικά",    en: "Educational",    count: 16, desc: { el: "Spelling Bee, Math Sprint, Geography...", en: "Spelling Bee, Math Sprint, Geography..." } },
  { path: "/games/creative",    emoji: "🎨", color: "from-pink-600 to-fuchsia-700",    el: "Δημιουργικά",     en: "Creative",       count: 13, desc: { el: "Pixel Art, Beat Maker, Stop Motion...", en: "Pixel Art, Beat Maker, Stop Motion..." } },
  { path: "/games/multiplayer", emoji: "🤝", color: "from-rose-500 to-orange-600",     el: "Πολλαπλών",       en: "Multiplayer",    count: 5,  desc: { el: "Battle Quiz, Co-op Maze, Pictionary...", en: "Battle Quiz, Co-op Maze, Pictionary..." } },
  { path: "/games/action",      emoji: "⚡", color: "from-yellow-500 to-red-500",      el: "Δράσης",          en: "Action",         count: 8,  desc: { el: "Reaction, Bubble Pop, Tap Dance...", en: "Reaction, Bubble Pop, Tap Dance..." } },
  { path: "/games/stem",        emoji: "🔬", color: "from-cyan-500 to-indigo-600",     el: "STEM & Επιστήμη", en: "STEM & Science", count: 7,  desc: { el: "Chemistry, Solar System, DNA...", en: "Chemistry, Solar System, DNA..." } },
];

export default function AllGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/all" />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-2">🎯</div>
            <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">{l.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GROUPS.map((g) => (
              <Link key={g.path} to={g.path} className={`bg-gradient-to-br ${g.color} text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-95 transition-all`}>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-6xl">{g.emoji}</div>
                  <div className="text-4xl font-extrabold opacity-90">{g.count}</div>
                </div>
                <div className="font-extrabold text-2xl">{lang === "el" ? g.el : g.en}</div>
                <div className="text-sm opacity-90 mt-1">{g.desc[lang] || g.desc.en}</div>
                <div className="mt-3 inline-block px-3 py-1 bg-white/20 rounded-full font-bold text-sm">
                  {lang === "el" ? "Δες όλα →" : "See all →"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
