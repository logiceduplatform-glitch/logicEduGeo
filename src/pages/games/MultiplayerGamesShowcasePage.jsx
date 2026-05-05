import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Παιχνίδια Πολλαπλών", subtitle: "Παίξε με φίλο στην ίδια συσκευή!" },
  en: { title: "Multiplayer Games", subtitle: "Play with a friend on the same device!" },
};

const GAMES = [
  { path: "/games/battle-quiz",  emoji: "⚔️", color: "from-rose-500 to-purple-600",  el: "Battle Quiz",   en: "Battle Quiz",   descEl: "1v1 ερωτήσεις", descEn: "1v1 quiz" },
  { path: "/games/coop-maze",    emoji: "🧭", color: "from-emerald-500 to-blue-600", el: "Co-op Λαβύρινθος", en: "Co-op Maze",  descEl: "Συνεργασία WASD/Βέλη", descEn: "Co-op WASD/Arrows" },
  { path: "/games/word-battle",  emoji: "🔤", color: "from-amber-500 to-orange-600", el: "Word Battle",   en: "Word Battle",   descEl: "Φτιάξτε λέξεις", descEn: "Build words" },
  { path: "/games/math-duel",    emoji: "➗", color: "from-blue-500 to-cyan-500",    el: "Math Duel",     en: "Math Duel",     descEl: "Πρώτος στο 5", descEn: "First to 5" },
  { path: "/games/pictionary",   emoji: "🖌️", color: "from-pink-500 to-rose-600",   el: "Pictionary",     en: "Pictionary",    descEl: "Ζωγραφική & μαντεψιά", descEn: "Draw & guess" },
  { path: "/games/tic-tac-toe",  emoji: "❌", color: "from-purple-500 to-indigo-600", el: "Τρίλιζα Online", en: "Tic-Tac-Toe Online", descEl: "Με κωδικό", descEn: "With code" },
  { path: "/challenge",          emoji: "👫", color: "from-violet-500 to-purple-700", el: "Πρόκληση Φίλου", en: "Challenge Friend", descEl: "Async 1v1", descEn: "Async 1v1" },
  { path: "/online-multiplayer", emoji: "🌐", color: "from-cyan-500 to-blue-700",    el: "Online Multiplayer", en: "Online Multiplayer", descEl: "Με άλλους online", descEn: "With others online" },
];

export default function MultiplayerGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/multiplayer" />
      <main className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🤝</div>
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
