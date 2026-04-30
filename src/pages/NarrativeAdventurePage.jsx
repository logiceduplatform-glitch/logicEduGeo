import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { NARRATIVE_ADVENTURES, NarrativeService } from "../config/narrativeAdventures";
import { CoinService } from "../services/CoinService";
import { ProgressService } from "../services/ProgressService";

const T = {
  el: {
    title: "📖 Διαδραστικές Περιπέτειες",
    subtitle: "Οι αποφάσεις σου αλλάζουν την ιστορία! Πολλαπλά τέλη — δοκίμασέ τα όλα.",
    play: "▶ Παίξε",
    continue: "⏯ Συνέχεια",
    restart: "🔄 Από την αρχή",
    minutes: "λεπτά",
    age: "Ηλικία",
    completed: "✓ Ολοκληρώθηκε",
    bestEnding: "🏆 Καλύτερο τέλος!",
    back: "← Πίσω",
    correct: "✅ Σωστή απάντηση! +{n} συνομίσματα",
    wrong: "❌ Λάθος απάντηση",
    chooseAction: "Διάλεξε:",
    yourQuest: "Η αποστολή σου:",
    finalReward: "Συνολική ανταμοιβή",
    coins: "νομίσματα",
    xp: "XP",
    playAgain: "Παίξε ξανά για άλλο τέλος",
    backToList: "Λίστα Περιπετειών",
    progress: "Πρόοδος",
    nextChapter: "Επόμενο",
  },
  en: {
    title: "📖 Interactive Adventures",
    subtitle: "Your choices change the story! Multiple endings — try them all.",
    play: "▶ Play",
    continue: "⏯ Continue",
    restart: "🔄 Restart",
    minutes: "min",
    age: "Age",
    completed: "✓ Completed",
    bestEnding: "🏆 Best ending!",
    back: "← Back",
    correct: "✅ Correct! +{n} coins",
    wrong: "❌ Wrong answer",
    chooseAction: "Choose:",
    yourQuest: "Your quest:",
    finalReward: "Total reward",
    coins: "coins",
    xp: "XP",
    playAgain: "Play again for another ending",
    backToList: "Back to list",
    progress: "Progress",
    nextChapter: "Next",
  },
};

export default function NarrativeAdventurePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) return <AdventureList lang={lang} l={l} navigate={navigate} />;

  return <AdventurePlayer id={id} lang={lang} l={l} navigate={navigate} />;
}

// ── List View ────────────────────────────────────────────────────────────
function AdventureList({ lang, l, navigate }) {
  const allProgress = NarrativeService.getAllProgress();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NARRATIVE_ADVENTURES.map((a) => {
              const prog = allProgress[a.id] || {};
              const startedNotDone = prog.currentNode && prog.currentNode !== "start" && !prog.completed;
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(`/adventures/${a.id}`)}
                  className="text-left bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-[1.02] hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{a.title[lang] || a.title.en}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">{a.description[lang] || a.description.en}</p>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">{l.age}: {a.age}</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold">~{a.minutes} {l.minutes}</span>
                    {prog.completed && <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">{l.completed}</span>}
                    {startedNotDone && <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">⏯ {l.continue}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Player View ──────────────────────────────────────────────────────────
function AdventurePlayer({ id, lang, l, navigate }) {
  const adventure = useMemo(() => NarrativeService.getAdventure(id), [id]);
  const [state, setState] = useState(() => NarrativeService.loadProgress(id));
  const [feedback, setFeedback] = useState(null); // {ok, msg}

  if (!adventure) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-slate-900 flex items-center justify-center">
        <Navbar />
        <p className="text-slate-500">404</p>
      </div>
    );
  }

  const node = adventure.nodes[state.currentNode] || adventure.nodes.start;
  const totalNodes = Object.keys(adventure.nodes).length;
  const progressPct = Math.min(100, Math.round((state.visited.length / totalNodes) * 100));

  const persist = (next) => {
    NarrativeService.saveProgress(id, next);
    setState(next);
  };

  const goTo = (nextKey, opts = {}) => {
    const next = adventure.nodes[nextKey];
    if (!next) return;
    const visited = state.visited.includes(nextKey) ? state.visited : [...state.visited, nextKey];
    const flags = { ...state.flags };
    if (opts.flag) flags[opts.flag] = true;

    let totalRewards = state.totalRewards || 0;
    if (opts.reward) totalRewards += opts.reward;

    const completed = !!next.ending;
    const ending = next.ending || null;

    // Handle final reward / completion
    if (completed && next.rewards) {
      try {
        if (next.rewards.coins) CoinService.earn(next.rewards.coins);
        if (next.rewards.xp) ProgressService.addXP(next.rewards.xp, 2);
      } catch {}
    }

    persist({
      ...state,
      currentNode: nextKey,
      visited,
      flags,
      totalRewards,
      completed,
      ending,
    });
    setFeedback(null);
  };

  const handleQuiz = (idx) => {
    if (feedback) return;
    const ok = idx === node.correct;
    setFeedback({ ok, msg: ok ? l.correct.replace("{n}", node.onCorrect?.reward || 5) : l.wrong });
    setTimeout(() => {
      const branch = ok ? node.onCorrect : node.onWrong;
      if (branch?.next) goTo(branch.next, branch);
    }, 1100);
  };

  const handleRestart = () => {
    NarrativeService.resetProgress(id);
    persist({ currentNode: "start", flags: {}, visited: [], totalRewards: 0, completed: false, ending: null });
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={adventure.title[lang] || adventure.title.en} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/adventures")} className="text-sm text-slate-500 hover:underline">{l.back}</button>
            <button onClick={handleRestart} className="text-xs text-rose-500 hover:underline">{l.restart}</button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white text-center">
            {adventure.title[lang] || adventure.title.en}
          </h1>

          {/* Progress bar */}
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="h-2 bg-gradient-to-r from-amber-400 to-rose-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Scene */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="text-7xl text-center mb-4">{node.scene || "📖"}</div>
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed text-center">
              {node.text?.[lang] || node.text?.en || ""}
            </p>

            {/* Quiz */}
            {node.type === "quiz" && (
              <div className="mt-6 space-y-2">
                {node.question && (
                  <p className="text-sm font-bold text-slate-500 text-center">{node.question[lang] || node.question.en}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {node.options.map((opt, idx) => {
                    const showResult = feedback != null;
                    const isCorrect = idx === node.correct;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuiz(idx)}
                        disabled={!!feedback}
                        className={`px-4 py-3 rounded-xl font-bold border-2 transition ${
                          showResult && isCorrect
                            ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700"
                            : showResult
                              ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500"
                              : "bg-amber-50 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-slate-600 border-amber-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt[lang] || opt.en}
                      </button>
                    );
                  })}
                </div>
                {feedback && (
                  <p className={`text-center font-bold mt-2 ${feedback.ok ? "text-emerald-600" : "text-rose-500"}`}>{feedback.msg}</p>
                )}
              </div>
            )}

            {/* Choice */}
            {node.type === "choice" && (
              <div className="mt-6">
                <p className="text-sm font-bold text-slate-500 mb-2 text-center">{l.chooseAction}</p>
                <div className="grid grid-cols-1 gap-2">
                  {node.choices.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(ch.next, ch)}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold shadow hover:scale-[1.02] transition"
                    >
                      {ch.label[lang] || ch.label.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            {node.type === "info" && node.choices && (
              <div className="mt-6 grid grid-cols-1 gap-2">
                {node.choices.map((ch, idx) => (
                  <button key={idx} onClick={() => goTo(ch.next, ch)} className="px-4 py-3 rounded-xl bg-violet-500 text-white font-bold shadow">
                    {ch.label[lang] || ch.label.en}
                  </button>
                ))}
              </div>
            )}

            {/* Ending */}
            {node.ending && (
              <div className="mt-6 text-center space-y-3">
                {node.bestEnding && (
                  <div className="text-xl font-extrabold text-amber-600">{l.bestEnding}</div>
                )}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-4">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{l.finalReward}</p>
                  <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">
                    🪙 {node.rewards?.coins || 0} {l.coins} · ⭐ {node.rewards?.xp || 0} {l.xp}
                  </p>
                </div>
                <button onClick={handleRestart} className="px-5 py-2.5 rounded-xl bg-violet-500 text-white font-bold shadow">
                  {l.playAgain}
                </button>
                <button onClick={() => navigate("/adventures")} className="block mx-auto text-sm text-slate-500 hover:underline">
                  {l.backToList}
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-slate-400">{l.progress}: {progressPct}%</p>
        </div>
      </div>
    </div>
  );
}
