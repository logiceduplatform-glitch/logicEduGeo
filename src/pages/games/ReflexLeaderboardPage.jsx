import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Personal Bests", subtitle: "Τα καλύτερα ρεκόρ σου στα παιχνίδια ταχύτητας", noScore: "—", play: "Παίξε" },
  en: { title: "Personal Bests", subtitle: "Your top scores in reflex games", noScore: "—", play: "Play" },
};

const ENTRIES = [
  { key: "reactionBest",       lower: true,  unit: "ms",   path: "/games/reaction",        emoji: "⚡", el: "Reaction Time", en: "Reaction Time" },
  { key: "colorMatchBest",     lower: false, unit: "pts",  path: "/games/color-match",     emoji: "🌈", el: "Color Match",   en: "Color Match" },
  { key: "fallingLettersBest", lower: false, unit: "pts",  path: "/games/falling-letters", emoji: "🔡", el: "Falling Letters", en: "Falling Letters" },
  { key: "bubbleBest",         lower: false, unit: "pts",  path: "/games/bubble-pop",      emoji: "🫧", el: "Bubble Pop",    en: "Bubble Pop" },
  { key: "simonBest",          lower: false, unit: "lvl",  path: "/games/memory-sequence", emoji: "🧠", el: "Memory Sequence", en: "Memory Sequence" },
  { key: "quickMathBest",      lower: false, unit: "pts",  path: "/games/quick-math",      emoji: "🧮", el: "Quick Math",    en: "Quick Math" },
  { key: "tapDanceBest",       lower: false, unit: "pts",  path: "/games/tap-dance",       emoji: "🎮", el: "Tap Dance",     en: "Tap Dance" },
  { key: "ttrBest",            lower: false, unit: "pts",  path: "/games/times-tables",    emoji: "✖️", el: "Times Tables Race", en: "Times Tables Race" },
  { key: "mathSprintBest",     lower: false, unit: "pts",  path: "/games/math-sprint",     emoji: "⚡", el: "Math Sprint",   en: "Math Sprint" },
];

function readNum(key) {
  try { const v = Number(localStorage.getItem(key)); return Number.isFinite(v) && v > 0 ? v : null; }
  catch { return null; }
}

export default function ReflexLeaderboardPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const rows = useMemo(() => ENTRIES.map((e) => ({ ...e, score: readNum(e.key) })), []);
  const played = rows.filter((r) => r.score != null).length;

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/games/leaderboard" />
      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🏆</div>
            <h1 className="text-3xl font-extrabold">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
            <div className="text-sm text-slate-500 mt-2">{played}/{rows.length} {lang === "el" ? "παιχνίδια έχουν σκορ" : "games scored"}</div>
          </div>
          <div className="space-y-2">
            {rows.map((r) => (
              <Link key={r.key} to={r.path}
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-[1.01] transition-transform shadow-sm">
                <div className="text-3xl">{r.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold">{lang === "el" ? r.el : r.en}</div>
                  <div className="text-xs text-slate-500">{r.lower ? (lang === "el" ? "Όσο πιο μικρό, τόσο καλύτερα" : "Lower is better") : (lang === "el" ? "Όσο πιο ψηλό, τόσο καλύτερα" : "Higher is better")}</div>
                </div>
                <div className={`font-extrabold text-2xl ${r.score != null ? "text-amber-600" : "text-slate-300"}`}>
                  {r.score != null ? `${r.score}${r.unit}` : l.noScore}
                </div>
                <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">{l.play} →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
