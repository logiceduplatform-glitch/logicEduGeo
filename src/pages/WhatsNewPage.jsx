import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";

const T = {
  el: {
    title: "Τι Νέο",
    subtitle: "Όλες οι πρόσφατες προσθήκες — 59 παιχνίδια & πολλά άλλα!",
    cta: "Ξεκίνα τώρα",
    catTitle: "6 Νέες Κατηγορίες",
    extras: "Επιπλέον features",
    feat1: { t: "🎁 Coin rewards", d: "Παίρνεις νομίσματα για κάθε νέο παιχνίδι" },
    feat2: { t: "🏅 Achievements", d: "Ξεκλείδωσε εμβλήματα για 5/15/30 παιχνίδια" },
    feat3: { t: "📊 Leaderboard", d: "Δες τα Personal Bests σου" },
    feat4: { t: "🌐 EL/EN", d: "Όλα τα παιχνίδια διγλωσσικά" },
    feat5: { t: "📱 Touch ready", d: "Δουλεύουν σε κινητό & tablet" },
    feat6: { t: "💾 Auto-save", d: "Πρόοδος αποθηκεύεται στη συσκευή" },
  },
  en: {
    title: "What's New",
    subtitle: "All recent additions — 59 games & much more!",
    cta: "Start now",
    catTitle: "6 New Categories",
    extras: "Bonus features",
    feat1: { t: "🎁 Coin rewards", d: "Earn coins for each new game you try" },
    feat2: { t: "🏅 Achievements", d: "Unlock badges at 5/15/30 games played" },
    feat3: { t: "📊 Leaderboard", d: "Track your Personal Bests" },
    feat4: { t: "🌐 EL/EN", d: "All games are bilingual" },
    feat5: { t: "📱 Touch ready", d: "Works on mobile & tablet" },
    feat6: { t: "💾 Auto-save", d: "Progress saved on your device" },
  },
};

const CATEGORIES = [
  { path: "/games", emoji: "🎮", el: "Κλασικά", en: "Classics", n: 10, color: "from-purple-500 to-pink-500", samples: "Wordle, 2048, Snake, Tetris" },
  { path: "/games/educational", emoji: "🎓", el: "Εκπαιδευτικά", en: "Educational", n: 16, color: "from-emerald-500 to-blue-500", samples: "Spelling Bee, Math Sprint, Periodic Table" },
  { path: "/games/creative", emoji: "🎨", el: "Δημιουργικά", en: "Creative", n: 13, color: "from-fuchsia-500 to-purple-600", samples: "Pixel Art, Beat Maker, Stop Motion" },
  { path: "/games/multiplayer", emoji: "🤝", el: "Multiplayer", en: "Multiplayer", n: 5, color: "from-rose-500 to-orange-500", samples: "Battle Quiz, Co-op Maze, Pictionary" },
  { path: "/games/action", emoji: "⚡", el: "Δράσης", en: "Action", n: 8, color: "from-yellow-500 to-red-500", samples: "Reaction Time, Bubble Pop, Tap Dance" },
  { path: "/games/stem", emoji: "🔬", el: "STEM", en: "STEM", n: 7, color: "from-cyan-500 to-indigo-600", samples: "Chemistry Lab, Solar System, DNA Builder" },
];

export default function WhatsNewPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const features = [l.feat1, l.feat2, l.feat3, l.feat4, l.feat5, l.feat6];
  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/whats-new" />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-7xl mb-3">🎉</div>
            <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">{l.subtitle}</p>
            <Link to="/games/all" className="inline-block mt-5 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-xl hover:scale-105 transition-transform">
              {l.cta} →
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold mb-4 text-center">{l.catTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {CATEGORIES.map((c) => (
              <Link key={c.path} to={c.path} className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-5 shadow-lg hover:scale-[1.03] transition-transform`}>
                <div className="flex items-baseline justify-between">
                  <div className="text-5xl">{c.emoji}</div>
                  <div className="text-3xl font-extrabold opacity-90">{c.n}</div>
                </div>
                <div className="font-extrabold text-xl mt-2">{lang === "el" ? c.el : c.en}</div>
                <div className="text-sm opacity-90 mt-1">{c.samples}</div>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold mb-4 text-center">{l.extras}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="font-extrabold">{f.t}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{f.d}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/games/leaderboard" className="inline-block mt-2 mr-2 px-5 py-2 bg-amber-500 text-white font-bold rounded-full hover:scale-105 transition-transform">
              🏆 Personal Bests
            </Link>
            <Link to="/achievements" className="inline-block mt-2 px-5 py-2 bg-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform">
              🎖️ {lang === "el" ? "Επιτυχίες" : "Achievements"}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
