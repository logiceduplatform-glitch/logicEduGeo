import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { MasteryService } from "../services/MasteryService";
import { SpacedRepetitionService } from "../services/SpacedRepetitionService";

const T = {
  el: {
    title: "🔥 Mastery Tracker",
    subtitle: "Δες σε ποια θέματα είσαι δυνατός — και τι χρειάζεται εξάσκηση",
    back: "Πίσω",
    overall: "Συνολική επίδοση",
    correct: "Σωστά",
    total: "Σύνολο",
    accuracy: "Ακρίβεια",
    streakStrong: "💪 Δυνατά σου",
    streakWeak: "⚠️ Χρειάζονται εξάσκηση",
    levelLabels: ["Δεν ξεκίνησες", "Μαθαίνεις", "Ανάπτυξη", "Καλά", "Master 🏆"],
    noData: "Παίξε λίγα κουίζ για να φανεί η πρόοδός σου!",
    questions: "ερωτήσεις",
    review: "Επανάληψη ({n})",
    practice: "Εξάσκηση",
    play: "Παίξε ένα κουίζ",
    masteredOf: "από",
    legend: "Επεξήγηση χρωμάτων",
  },
  en: {
    title: "🔥 Mastery Tracker",
    subtitle: "See where you shine — and what needs more practice",
    back: "Back",
    overall: "Overall performance",
    correct: "Correct",
    total: "Total",
    accuracy: "Accuracy",
    streakStrong: "💪 Strong",
    streakWeak: "⚠️ Needs work",
    levelLabels: ["Not started", "Learning", "Developing", "Good", "Master 🏆"],
    noData: "Play a few quizzes to track your progress!",
    questions: "questions",
    review: "Review ({n})",
    practice: "Practice",
    play: "Play a quiz",
    masteredOf: "of",
    legend: "Color legend",
  },
};

const LEVEL_COLORS = [
  { bg: "bg-slate-100 dark:bg-slate-700/40",                   text: "text-slate-400",                 ring: "border-slate-200 dark:border-slate-700" },
  { bg: "bg-rose-100 dark:bg-rose-900/30",                      text: "text-rose-700 dark:text-rose-300",  ring: "border-rose-300" },
  { bg: "bg-amber-100 dark:bg-amber-900/30",                    text: "text-amber-700 dark:text-amber-300", ring: "border-amber-300" },
  { bg: "bg-lime-100 dark:bg-lime-900/30",                      text: "text-lime-700 dark:text-lime-300",  ring: "border-lime-300" },
  { bg: "bg-emerald-200 dark:bg-emerald-900/50",                text: "text-emerald-800 dark:text-emerald-200", ring: "border-emerald-400" },
];

export default function SubjectMasteryPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [tick] = useState(0); // for force-render after reset (unused for now)

  const subjects = useMemo(() => MasteryService.getAll(), [tick]);
  const due = SpacedRepetitionService.getDueCount();

  const totals = subjects.reduce((acc, s) => {
    acc.correct += s.correct;
    acc.total += s.total;
    return acc;
  }, { correct: 0, total: 0 });
  const overallAcc = totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 0;

  const sortedByLevel = [...subjects].sort((a, b) => b.level - a.level || b.accuracy - a.accuracy);
  const strong = sortedByLevel.filter(s => s.level >= 3 && s.total >= 3).slice(0, 3);
  const weak = [...subjects].filter(s => s.total >= 3 && s.level <= 2).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={l.title} description={l.subtitle} canonical="/mastery" />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-emerald-600 mb-4">← {l.back}</button>

        <header className="text-center mb-8">
          <div className="text-6xl mb-2">🔥</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{l.subtitle}</p>
        </header>

        {/* Overall stats */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{l.overall}</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">{totals.correct}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{l.correct}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600">{totals.total}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{l.total}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-600">{overallAcc}%</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{l.accuracy}</div>
            </div>
          </div>
        </section>

        {/* Heatmap */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
          {totals.total === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-slate-500 mb-4">{l.noData}</p>
              <Link to="/play" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm">{l.play}</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {subjects.map(s => {
                  const c = LEVEL_COLORS[s.level] || LEVEL_COLORS[0];
                  const accPct = Math.round(s.accuracy * 100);
                  return (
                    <div key={s.id} className={`rounded-2xl p-4 border-2 ${c.bg} ${c.ring}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{s.icon}</span>
                        <span className={`font-bold text-sm ${c.text} truncate`}>{s[lang] || s.en}</span>
                      </div>
                      {s.total > 0 ? (
                        <>
                          <div className={`text-2xl font-extrabold ${c.text}`}>{accPct}%</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {s.correct}/{s.total} {l.questions}
                          </div>
                          <div className={`text-[10px] font-bold mt-1 ${c.text}`}>{l.levelLabels[s.level]}</div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 dark:text-slate-500 italic">—</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">{l.legend}</p>
                <div className="flex flex-wrap gap-2">
                  {LEVEL_COLORS.map((c, i) => (
                    <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${c.bg} ${c.ring} border-2`}>
                      <span className={`text-[10px] font-bold ${c.text}`}>{l.levelLabels[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Insights */}
        {totals.total >= 5 && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
              <h3 className="font-extrabold text-emerald-800 dark:text-emerald-200 mb-2">{l.streakStrong}</h3>
              {strong.length === 0 ? (
                <p className="text-xs text-emerald-700 dark:text-emerald-300 opacity-70">—</p>
              ) : (
                <ul className="space-y-1.5">
                  {strong.map(s => (
                    <li key={s.id} className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                      <span>{s.icon}</span>
                      <span className="flex-1 truncate">{s[lang] || s.en}</span>
                      <span className="text-xs">{Math.round(s.accuracy * 100)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-2xl p-5">
              <h3 className="font-extrabold text-rose-800 dark:text-rose-200 mb-2">{l.streakWeak}</h3>
              {weak.length === 0 ? (
                <p className="text-xs text-rose-700 dark:text-rose-300 opacity-70">—</p>
              ) : (
                <ul className="space-y-1.5">
                  {weak.map(s => (
                    <li key={s.id} className="flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-200">
                      <span>{s.icon}</span>
                      <span className="flex-1 truncate">{s[lang] || s.en}</span>
                      <span className="text-xs">{Math.round(s.accuracy * 100)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Spaced Repetition CTA */}
        {due > 0 && (
          <Link to="/study-buddy" className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg">🔁 {l.review.replace("{n}", due)}</h3>
                <p className="text-sm text-white/90">Spaced repetition · 1 / 3 / 7 days</p>
              </div>
              <span className="text-3xl">→</span>
            </div>
          </Link>
        )}
      </main>
    </div>
  );
}
