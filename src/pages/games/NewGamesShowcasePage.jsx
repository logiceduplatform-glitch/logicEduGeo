import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Νέα Παιχνίδια", subtitle: "Κλασικά παιχνίδια που λατρεύουμε όλοι!" },
  en: { title: "New Games", subtitle: "Timeless classics everyone loves!" },
};

const GAMES = [
  { path: "/games/wordle",         emoji: "🟩", color: "from-emerald-500 to-teal-500",  el: "Wordle",            en: "Wordle",            descEl: "Μάντεψε τη λέξη 5 γραμμάτων", descEn: "Guess the 5-letter word" },
  { path: "/games/2048",           emoji: "🔢", color: "from-amber-500 to-orange-500",  el: "2048",              en: "2048",              descEl: "Συγχώνευσε πλακίδια", descEn: "Merge tiles to 2048" },
  { path: "/games/snake",          emoji: "🐍", color: "from-green-500 to-emerald-600", el: "Snake",             en: "Snake",             descEl: "Φάε φρούτα και μεγάλωσε", descEn: "Eat fruit and grow" },
  { path: "/games/tetris",         emoji: "🟦", color: "from-cyan-500 to-blue-600",     el: "Tetris",            en: "Tetris",            descEl: "Στοίβαξε γραμμές", descEn: "Stack lines" },
  { path: "/games/tic-tac-toe",    emoji: "❌", color: "from-rose-500 to-pink-600",     el: "Τρίλιζα Online",    en: "Tic-Tac-Toe Online", descEl: "Παίξε με φίλο", descEn: "Play with a friend" },
  { path: "/games/24",             emoji: "🎯", color: "from-purple-500 to-pink-500",   el: "24 Game",           en: "24 Game",           descEl: "Φτιάξε το 24", descEn: "Make 24" },
  { path: "/games/word-search",    emoji: "🔍", color: "from-indigo-500 to-blue-600",   el: "Κρυπτόλεξο",        en: "Word Search",       descEl: "Βρες λέξεις σε grid", descEn: "Find words in a grid" },
  { path: "/games/whack",          emoji: "🐹", color: "from-amber-600 to-yellow-500",  el: "Whack-a-Mole",      en: "Whack-a-Mole",      descEl: "Χτύπα τα μολύκια", descEn: "Whack the moles" },
  { path: "/games/connect-dots",   emoji: "✏️", color: "from-fuchsia-500 to-purple-500", el: "Ένωσε τις Τελείες", en: "Connect the Dots",  descEl: "Σχέδιο με τη σειρά", descEn: "Draw in order" },
  { path: "/games/drawing",        emoji: "🎨", color: "from-pink-500 to-rose-500",     el: "Καμβάς",            en: "Drawing Pad",       descEl: "Ζωγράφισε ελεύθερα", descEn: "Draw freely" },
];

export default function NewGamesShowcasePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games" />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🎮</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{l.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map((g) => (
              <Link
                key={g.path}
                to={g.path}
                className={`bg-gradient-to-br ${g.color} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}
              >
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
