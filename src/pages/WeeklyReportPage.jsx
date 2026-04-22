import React, { useState, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { ProgressService } from "../services/ProgressService";
import { ProfileService } from "../services/ProfileService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Εβδομαδιαία Αναφορά",
    subtitle: "Σύνοψη προόδου τελευταίων 7 ημερών",
    back: "Πίσω",
    print: "Εκτύπωση",
    gamesPlayed: "Παιχνίδια",
    correctAnswers: "Σωστές",
    accuracy: "Ακρίβεια",
    minutesPlayed: "Λεπτά",
    streak: "Σερί",
    bestStreak: "Ρεκόρ σερί",
    dailyBreakdown: "Ημερήσια ανάλυση",
    topGames: "Κορυφαία παιχνίδια",
    noData: "Δεν υπάρχουν δεδομένα αυτή την εβδομάδα",
    played: "παίχτηκε",
    times: "φορές",
    worksheetTitle: "Φύλλο εξάσκησης",
    worksheetDesc: "Εκτύπωσε ερωτήσεις για offline εξάσκηση",
    generateWorksheet: "Δημιουργία φύλλου",
    printWorksheet: "Εκτύπωση φύλλου",
    questions: "ερωτήσεις",
    day: ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"],
    improvement: "Βελτίωση",
    consistent: "Σταθερή πορεία",
    needsPractice: "Χρειάζεται εξάσκηση",
    great: "Εξαιρετική εβδομάδα!",
    good: "Καλή εβδομάδα!",
    okay: "Μπορείς καλύτερα!",
    recommendation: "Πρόταση",
  },
  en: {
    title: "Weekly Report",
    subtitle: "Progress summary for the last 7 days",
    back: "Back",
    print: "Print",
    gamesPlayed: "Games",
    correctAnswers: "Correct",
    accuracy: "Accuracy",
    minutesPlayed: "Minutes",
    streak: "Streak",
    bestStreak: "Best streak",
    dailyBreakdown: "Daily breakdown",
    topGames: "Top games",
    noData: "No data this week",
    played: "played",
    times: "times",
    worksheetTitle: "Practice Worksheet",
    worksheetDesc: "Print questions for offline practice",
    generateWorksheet: "Generate worksheet",
    printWorksheet: "Print worksheet",
    questions: "questions",
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    improvement: "Improvement",
    consistent: "Consistent progress",
    needsPractice: "Needs practice",
    great: "Great week!",
    good: "Good week!",
    okay: "You can do better!",
    recommendation: "Recommendation",
  },
};

function getWeekDates() {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function WeeklyReportPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest, userProfile } = useContext(AuthContext);
  const progress = useProgress();
  const isEl = lang === "el";
  const l = T[lang] || T.en;
  const reportRef = useRef(null);

  const [worksheetQuestions, setWorksheetQuestions] = useState(null);
  const [loadingWorksheet, setLoadingWorksheet] = useState(false);

  const activeChild = ProfileService.getActive();
  const name = activeChild?.name || userProfile?.name || user?.displayName || (guest ? (isEl ? "Επισκέπτης" : "Guest") : "");

  const weekData = useMemo(() => {
    const dates = getWeekDates();
    const daily = dates.map((date) => {
      const dayStats = ProgressService.getDailyStats(date);
      return {
        date,
        dayLabel: l.day[new Date(date + "T12:00:00").getDay() === 0 ? 6 : new Date(date + "T12:00:00").getDay() - 1],
        gamesPlayed: dayStats?.gamesPlayed || 0,
        totalCorrect: dayStats?.totalCorrect || 0,
        minutesPlayed: dayStats?.minutesPlayed || 0,
      };
    });

    const totalGames = daily.reduce((s, d) => s + d.gamesPlayed, 0);
    const totalCorrect = daily.reduce((s, d) => s + d.totalCorrect, 0);
    const totalMinutes = daily.reduce((s, d) => s + d.minutesPlayed, 0);
    const activeDays = daily.filter((d) => d.gamesPlayed > 0).length;

    const allProgress = ProgressService.getAllGameProgress();
    const weekStart = dates[0];
    const topGames = [];
    if (allProgress) {
      for (const [gameId, gp] of Object.entries(allProgress)) {
        const weekHistory = (gp.history || []).filter((h) => h.date >= weekStart);
        if (weekHistory.length > 0) {
          const correct = weekHistory.reduce((s, h) => s + (h.score || 0), 0);
          const total = weekHistory.reduce((s, h) => s + (h.total || 0), 0);
          topGames.push({
            gameId,
            title: gp.title || gameId,
            played: weekHistory.length,
            correct,
            total,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
            bestScore: gp.bestScore || 0,
          });
        }
      }
    }
    topGames.sort((a, b) => b.played - a.played);

    const streak = ProgressService.getStreak();
    const xp = ProgressService.getXP();

    return { daily, totalGames, totalCorrect, totalMinutes, activeDays, topGames: topGames.slice(0, 8), streak, xp };
  }, [l.day]);

  const accuracy = weekData.totalGames > 0
    ? Math.min(100, Math.round((weekData.totalCorrect / Math.max(1, weekData.totalGames)) * 100))
    : 0;

  const handlePrint = () => {
    window.print();
  };

  const handlePDF = async () => {
    const { exportToPDF } = await import("../utils/pdfExport");
    await exportToPDF("weekly-report-content", `weekly-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleGenerateWorksheet = async () => {
    setLoadingWorksheet(true);
    try {
      const loaders = [
        () => import("../components/quiz/data/questionsLogicMath").then((m) => m.questionsLogicMath),
        () => import("../components/quiz/data/questionsNaturalWorld").then((m) => m.questionsNaturalWorld),
        () => import("../components/quiz/data/questionsBrainTeasers").then((m) => m.questionsBrainTeasers),
      ];
      const allQ = [];
      for (const loader of loaders) {
        try {
          const qs = await loader();
          if (Array.isArray(qs)) allQ.push(...qs);
        } catch {}
      }
      const shuffled = allQ.sort(() => Math.random() - 0.5).slice(0, 20);
      setWorksheetQuestions(shuffled);
    } catch {
      setWorksheetQuestions([]);
    }
    setLoadingWorksheet(false);
  };

  const pickText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] ?? obj.el ?? obj.en ?? "";
  };

  const maxGames = Math.max(...weekData.daily.map((d) => d.gamesPlayed), 1);

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl">
          {/* Back + Print */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {l.back}
            </button>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {l.print}
              </button>
              <button
                onClick={handlePDF}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
            </div>
          </div>

          <div ref={reportRef} id="weekly-report-content">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h1 className="text-2xl font-bold">{l.title}</h1>
                    <p className="text-purple-200 text-sm">{name} — {l.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-purple-200 mt-2">
                  {weekData.daily[0]?.date} → {weekData.daily[6]?.date}
                </p>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: l.gamesPlayed, value: weekData.totalGames, icon: "🎮", color: "from-purple-500 to-indigo-500" },
                { label: l.correctAnswers, value: weekData.totalCorrect, icon: "✅", color: "from-emerald-500 to-teal-500" },
                { label: l.accuracy, value: `${accuracy}%`, icon: "🎯", color: "from-amber-500 to-orange-500" },
                { label: l.minutesPlayed, value: weekData.totalMinutes, icon: "⏱️", color: "from-cyan-500 to-blue-500" },
              ].map((card) => (
                <div key={card.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{card.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</span>
                  </div>
                  <p className={`text-2xl font-extrabold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Streak + verdict */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl text-white shadow-lg">
                  🔥
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{l.streak}</p>
                  <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{weekData.streak?.current || 0}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{l.bestStreak}: {weekData.streak?.best || 0}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{weekData.activeDays >= 5 ? "🏆" : weekData.activeDays >= 3 ? "👏" : "💪"}</span>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {weekData.activeDays >= 5 ? l.great : weekData.activeDays >= 3 ? l.good : l.okay}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {weekData.activeDays}/7 {isEl ? "ενεργές ημέρες" : "active days"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {l.recommendation}: {weekData.activeDays < 3
                    ? (isEl ? "Παίξε τουλάχιστον 10 λεπτά κάθε μέρα!" : "Play at least 10 minutes every day!")
                    : (isEl ? "Συνέχισε έτσι!" : "Keep it up!")}
                </p>
              </div>
            </div>

            {/* Daily chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <span>📅</span> {l.dailyBreakdown}
              </h3>
              <div className="flex items-end gap-2 h-32">
                {weekData.daily.map((d) => {
                  const pct = maxGames > 0 ? (d.gamesPlayed / maxGames) * 100 : 0;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{d.gamesPlayed}</span>
                      <div className="w-full rounded-t-lg bg-slate-100 dark:bg-slate-700 relative" style={{ height: "100px" }}>
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-purple-500 to-indigo-400 transition-all"
                          style={{ height: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{d.dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top games */}
            {weekData.topGames.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <span>🏅</span> {l.topGames}
                </h3>
                <div className="space-y-3">
                  {weekData.topGames.map((g, i) => (
                    <div key={g.gameId} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{g.title}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {l.played} {g.played} {l.times} — {g.accuracy}% {l.accuracy.toLowerCase()}
                        </p>
                      </div>
                      <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                          style={{ width: `${g.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {weekData.totalGames === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 shadow-sm text-center mb-6">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{l.noData}</p>
              </div>
            )}
          </div>

          {/* Worksheet section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm print:hidden">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <span>📝</span> {l.worksheetTitle}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{l.worksheetDesc}</p>

            {!worksheetQuestions ? (
              <button
                onClick={handleGenerateWorksheet}
                disabled={loadingWorksheet}
                className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loadingWorksheet ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {l.generateWorksheet} (20 {l.questions})
              </button>
            ) : (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {l.printWorksheet}
                  </button>
                  <button
                    onClick={() => setWorksheetQuestions(null)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {isEl ? "Κλείσιμο" : "Close"}
                  </button>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {worksheetQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        <span className="text-slate-400 dark:text-slate-500 mr-2">#{idx + 1}</span>
                        {pickText(q.question)}
                      </p>
                      {q.options && (
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {(Array.isArray(q.options) ? q.options : q.options[lang] || q.options.el || []).map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span>{typeof opt === "string" ? opt : pickText(opt)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
