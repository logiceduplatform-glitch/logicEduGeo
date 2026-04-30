import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LearningPathService } from "../services/LearningPathService";

const T = {
  el: {
    title: "🎯 Προσωπική Διαδρομή Μάθησης",
    subtitle: "Το AI αναλύει την πρόοδό σου και σου προτείνει τι να μελετήσεις στη συνέχεια.",
    generate: "✨ Δημιούργησε Διαδρομή",
    regenerate: "🔄 Νέα Διαδρομή",
    summary: "Σύνοψη",
    yourSteps: "Τα Βήματά σου",
    yourStrengths: "✅ Τα Δυνατά σου σημεία",
    yourWeaknesses: "📈 Σημεία προς Βελτίωση",
    noWeaknesses: "Παίξε περισσότερα για να εντοπιστούν αδυναμίες.",
    noStrengths: "Παίξε περισσότερα για να φανούν τα δυνατά σου.",
    accuracy: "Ακρίβεια",
    games: "παιχνίδια",
    age: "Ηλικία",
    addGoal: "+ Πρόσθεσε στόχο",
    goalPh: "π.χ. Μάθε προπαίδεια του 7",
    save: "Αποθήκευση",
    cancel: "Άκυρο",
    markDone: "✓ Τέλειωσε",
    markUndone: "Επανέφερε",
    playRelated: "Παίξε σχετικά",
    high: "Υψηλή",
    medium: "Μεσαία",
    low: "Χαμηλή",
    priority: "Προτεραιότητα",
    autoUpdate: "🔄 Αυτόματη ενημέρωση προόδου",
    refresh: "Ανανέωση προόδου",
    completedAll: "🎉 Συγχαρητήρια! Ολοκλήρωσες όλα τα βήματα.",
    progress: "Πρόοδος",
    generating: "Δημιουργία...",
    backHome: "← Αρχική",
    proficiency: {
      "new": "Νέο",
      "needs-work": "Χρειάζεται δουλειά",
      "developing": "Αναπτύσσεται",
      "strong": "Δυνατό",
      "mastered": "Άριστο",
    },
    aboutTitle: "Πώς λειτουργεί;",
    aboutText: "Η AI αναλύει τα παιχνίδια που έπαιξες, εντοπίζει τα θέματα όπου κάνεις λάθη και σου φτιάχνει 5-8 βήματα μάθησης. Όσο παίζεις, η διαδρομή ενημερώνεται αυτόματα.",
  },
  en: {
    title: "🎯 Personalized Learning Path",
    subtitle: "AI analyzes your progress and suggests what to learn next.",
    generate: "✨ Generate Path",
    regenerate: "🔄 New Path",
    summary: "Summary",
    yourSteps: "Your Steps",
    yourStrengths: "✅ Your Strengths",
    yourWeaknesses: "📈 Areas to Improve",
    noWeaknesses: "Play more to identify weaknesses.",
    noStrengths: "Play more to surface strengths.",
    accuracy: "Accuracy",
    games: "games",
    age: "Age",
    addGoal: "+ Add a goal",
    goalPh: "e.g. Master times tables of 7",
    save: "Save",
    cancel: "Cancel",
    markDone: "✓ Done",
    markUndone: "Undo",
    playRelated: "Play related",
    high: "High",
    medium: "Medium",
    low: "Low",
    priority: "Priority",
    autoUpdate: "🔄 Auto progress update",
    refresh: "Refresh",
    completedAll: "🎉 Congrats! You've completed all steps.",
    progress: "Progress",
    generating: "Generating...",
    backHome: "← Home",
    proficiency: {
      "new": "New",
      "needs-work": "Needs work",
      "developing": "Developing",
      "strong": "Strong",
      "mastered": "Mastered",
    },
    aboutTitle: "How does it work?",
    aboutText: "AI analyzes the games you've played, finds where you struggle, and builds 5-8 personalized steps. As you play, the path auto-updates.",
  },
};

const PRIORITY_COLORS = {
  high: "from-rose-500 to-orange-500",
  medium: "from-amber-400 to-yellow-500",
  low: "from-cyan-400 to-blue-500",
};

const PROFICIENCY_COLORS = {
  "new": "bg-slate-200 text-slate-600",
  "needs-work": "bg-rose-200 text-rose-700",
  "developing": "bg-amber-200 text-amber-800",
  "strong": "bg-emerald-200 text-emerald-800",
  "mastered": "bg-violet-200 text-violet-800",
};

export default function LearningPathPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  const [path, setPath] = useState(() => LearningPathService.loadPath());
  const [perf, setPerf] = useState(() => LearningPathService.analyzePerformance());
  const [busy, setBusy] = useState(false);
  const [ageGroup, setAgeGroup] = useState(localStorage.getItem("geo:learning-age") || "9-12");
  const [goal, setGoal] = useState("");
  const [showGoal, setShowGoal] = useState(false);

  // Auto-refresh progress on mount
  useEffect(() => {
    const updated = LearningPathService.updateProgressFromStats();
    if (updated) setPath(updated);
    setPerf(LearningPathService.analyzePerformance());
  }, []);

  const handleGenerate = async () => {
    setBusy(true);
    try {
      localStorage.setItem("geo:learning-age", ageGroup);
      const goals = goal.trim() ? [goal.trim()] : [];
      const newPath = await LearningPathService.generatePath({ ageGroup, lang, goals });
      LearningPathService.savePath(newPath);
      setPath(newPath);
      setPerf(newPath.analysis);
      setGoal("");
      setShowGoal(false);
    } catch (e) {
      // ignore
    }
    setBusy(false);
  };

  const handleToggleStep = (stepId) => {
    const updated = LearningPathService.toggleStepDone(stepId);
    if (updated) setPath({ ...updated });
  };

  const handleRefresh = () => {
    const updated = LearningPathService.updateProgressFromStats();
    if (updated) setPath({ ...updated });
    setPerf(LearningPathService.analyzePerformance());
  };

  const completedCount = path?.steps?.filter((s) => s.done).length || 0;
  const totalCount = path?.steps?.length || 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <button onClick={() => navigate("/")} className="text-sm text-slate-500 hover:underline">{l.backHome}</button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Performance summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">{l.yourStrengths}</h3>
              {perf.strongest.length === 0 ? (
                <p className="text-sm text-slate-500">{l.noStrengths}</p>
              ) : (
                <ul className="space-y-1">
                  {perf.strongest.map((t) => (
                    <li key={t.topic} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-200">{LearningPathService.topicLabel(t.topic, lang)}</span>
                      <span className="font-bold text-emerald-600">{t.accuracy}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">{l.yourWeaknesses}</h3>
              {perf.weakest.length === 0 ? (
                <p className="text-sm text-slate-500">{l.noWeaknesses}</p>
              ) : (
                <ul className="space-y-1">
                  {perf.weakest.map((t) => (
                    <li key={t.topic} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-200">{LearningPathService.topicLabel(t.topic, lang)}</span>
                      <span className="font-bold text-rose-500">{t.accuracy}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Generate / regenerate */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">{l.age}:</label>
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
                <option value="2-3">2-3</option>
                <option value="4-5">4-5</option>
                <option value="6-8">6-8</option>
                <option value="9-12">9-12</option>
                <option value="13-15">13-15</option>
                <option value="16-18">16-18</option>
              </select>

              {!showGoal && (
                <button onClick={() => setShowGoal(true)} className="text-sm text-emerald-600 hover:underline font-bold">{l.addGoal}</button>
              )}
            </div>

            {showGoal && (
              <div className="flex gap-2">
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={l.goalPh}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none"
                />
                <button onClick={() => setShowGoal(false)} className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold">{l.cancel}</button>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold shadow-lg disabled:opacity-50"
            >
              {busy ? l.generating : path ? l.regenerate : l.generate}
            </button>
          </div>

          {/* Path */}
          {path && (
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{path.title}</h2>
                {path.summary && <p className="text-sm text-slate-500 mt-1">{path.summary}</p>}
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{l.progress}</span>
                  <span>{completedCount}/{totalCount}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all" style={{ width: `${totalCount ? Math.round((completedCount / totalCount) * 100) : 0}%` }} />
                </div>
                <button onClick={handleRefresh} className="text-xs text-cyan-600 hover:underline mt-1">🔄 {l.refresh}</button>
              </div>

              {allDone && (
                <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl p-3 text-center font-bold text-emerald-700 dark:text-emerald-300">
                  {l.completedAll}
                </div>
              )}

              {/* Steps */}
              <ol className="space-y-3">
                {path.steps.map((step, i) => (
                  <li key={step.id} className={`relative pl-12 pr-4 py-3 rounded-xl border-2 transition ${step.done ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-600"}`}>
                    <div className={`absolute left-3 top-3 w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-white text-sm bg-gradient-to-br ${PRIORITY_COLORS[step.priority || "medium"]}`}>
                      {step.done ? "✓" : i + 1}
                    </div>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <p className={`font-bold ${step.done ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>{step.title}</p>
                        {step.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.description}</p>}
                        {step.priority && (
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {l.priority}: {l[step.priority] || step.priority}
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleToggleStep(step.id)} className={`text-xs px-3 py-1.5 rounded-lg font-bold ${step.done ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-emerald-500 text-white"}`}>
                        {step.done ? l.markUndone : l.markDone}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* About */}
          <section className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-2xl p-4 text-sm text-cyan-800 dark:text-cyan-200">
            <p className="font-bold mb-1">{l.aboutTitle}</p>
            <p>{l.aboutText}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
