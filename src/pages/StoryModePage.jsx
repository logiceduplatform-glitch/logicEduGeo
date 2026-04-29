import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import { STORIES, getStoryProgress, saveStoryProgress } from "../config/storyConfig";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Ιστορίες Περιπέτειας",
    subtitle: "Διάλεξε ιστορία και πάρε αποφάσεις!",
    minutes: "λεπτά",
    completed: "Ολοκληρώθηκε",
    play: "Παίξε",
    again: "Ξαναπαίξε",
    back: "Πίσω",
    correct: "Σωστά!",
    wrong: "Λάθος!",
    next: "Συνέχισε",
    answer: "Απάντηση",
    yourChoice: "Επέλεξε",
    greatEnding: "ΤΕΛΕΙΟ ΤΕΛΟΣ! 🌟",
    smallEnding: "Δοκίμασε ξανά! 💪",
    storyEnded: "Η ιστορία τελείωσε!",
    rewards: "Ανταμοιβές",
  },
  en: {
    title: "Adventure Stories",
    subtitle: "Pick a story and make choices!",
    minutes: "min",
    completed: "Completed",
    play: "Play",
    again: "Replay",
    back: "Back",
    correct: "Correct!",
    wrong: "Wrong!",
    next: "Continue",
    answer: "Answer",
    yourChoice: "Choose",
    greatEnding: "PERFECT ENDING! 🌟",
    smallEnding: "Try again! 💪",
    storyEnded: "Story complete!",
    rewards: "Rewards",
  },
};

export default function StoryModePage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [currentStory, setCurrentStory] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState("start");
  const [feedback, setFeedback] = useState(null); // null | "correct" | "wrong"
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [progress, setProgress] = useState(() => getStoryProgress());
  const [endingType, setEndingType] = useState(null);

  const startStory = (story) => {
    setCurrentStory(story);
    setCurrentSceneId("start");
    setFeedback(null);
    setSelectedAnswer(null);
    setEndingType(null);
  };

  const exitStory = () => {
    setCurrentStory(null);
    setCurrentSceneId("start");
    setFeedback(null);
    setEndingType(null);
    setProgress(getStoryProgress());
  };

  const handleChoice = (next) => {
    setCurrentSceneId(next);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const handleQuizAnswer = (idx, scene) => {
    if (feedback) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === scene.quiz.correct;
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      const nextScene = isCorrect ? scene.onCorrect : scene.onWrong;
      setCurrentSceneId(nextScene);
      setFeedback(null);
      setSelectedAnswer(null);
    }, 1500);
  };

  const handleEnding = (type) => {
    if (endingType) return;
    setEndingType(type);
    saveStoryProgress(currentStory.id, type);
    if (type === "great") {
      ProgressService.addXP(20, 2);
      CoinService.earn(5);
    } else {
      ProgressService.addXP(5, 1);
    }
  };

  // Story selection screen
  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
                📖 {l.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {STORIES.map(story => {
                const isDone = progress[story.id]?.completed;
                const ending = progress[story.id]?.ending;
                return (
                  <button
                    key={story.id}
                    onClick={() => startStory(story)}
                    className={`relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border-2 ${isDone ? "border-emerald-300 dark:border-emerald-700" : "border-slate-100 dark:border-slate-700"} hover:scale-[1.02] hover:shadow-xl transition-all text-left overflow-hidden`}
                  >
                    <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${story.color} opacity-20 blur-2xl`} />
                    <div className="relative">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-4xl">{story.cover}</span>
                        <div className="flex-1">
                          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">{isEl ? story.title.el : story.title.en}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">⏱️ {story.estimatedMinutes} {l.minutes}</p>
                        </div>
                        {isDone && <span className="text-lg">{ending === "great" ? "🌟" : "✓"}</span>}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{isEl ? story.description.el : story.description.en}</p>
                      <div className={`mt-4 inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${story.color} text-white text-sm font-bold`}>
                        {isDone ? `🔄 ${l.again}` : `▶️ ${l.play}`}
                      </div>
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

  // Inside a story
  const scene = currentStory.scenes[currentSceneId];
  if (!scene) return null;

  // Ending screen
  if (scene.ending) {
    if (!endingType) handleEnding(scene.ending);
    const isGreat = scene.ending === "great";

    return (
      <div className={`min-h-screen ${currentStory.bgColor}`}>
        <Navbar />
        <SEO title={isEl ? currentStory.title.el : currentStory.title.en} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-7xl">{scene.emoji}</div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{isGreat ? l.greatEnding : l.smallEnding}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">{isEl ? scene.text.el : scene.text.en}</p>

            {endingType && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-400 mb-2">{l.rewards}:</p>
                <div className="flex justify-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-sm">+{isGreat ? 20 : 5} XP</span>
                  {isGreat && <span className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold text-sm">+5 🪙</span>}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={() => startStory(currentStory)} className={`px-6 py-3 rounded-xl bg-gradient-to-r ${currentStory.color} text-white font-bold shadow-md`}>
                🔄 {l.again}
              </button>
              <button onClick={exitStory} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                {l.back}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentStory.bgColor}`}>
      <Navbar />
      <SEO title={isEl ? currentStory.title.el : currentStory.title.en} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-lg">
          <button onClick={exitStory} className="mb-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">← {l.back}</button>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-5">
            <div className="text-center">
              <div className="text-6xl mb-3">{scene.emoji}</div>
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">{isEl ? scene.text.el : scene.text.en}</p>
            </div>

            {/* Choices (path branching) */}
            {scene.choices && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">{l.yourChoice}</p>
                {scene.choices.map((c, i) => (
                  <button key={i} onClick={() => handleChoice(c.next)} className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r ${currentStory.color} text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all`}>
                    {isEl ? c.text.el : c.text.en}
                  </button>
                ))}
              </div>
            )}

            {/* Quiz */}
            {scene.quiz && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">{l.answer}</p>
                <p className="text-center text-slate-600 dark:text-slate-300 font-semibold">
                  {isEl ? scene.quiz.question.el : scene.quiz.question.en}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {scene.quiz.options.map((opt, i) => {
                    let cls = "border-slate-200 dark:border-slate-600 hover:border-purple-400";
                    if (feedback) {
                      if (i === scene.quiz.correct) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30";
                      else if (i === selectedAnswer && feedback === "wrong") cls = "border-red-500 bg-red-50 dark:bg-red-900/30";
                    }
                    const label = typeof opt === "string" ? opt : (isEl ? opt.el : opt.en);
                    return (
                      <button key={i} onClick={() => handleQuizAnswer(i, scene)} disabled={!!feedback} className={`px-4 py-3 rounded-xl border-2 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all ${cls}`}>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {feedback && (
                  <p className={`text-center font-bold ${feedback === "correct" ? "text-emerald-600" : "text-red-500"}`}>
                    {feedback === "correct" ? `✅ ${l.correct}` : `❌ ${l.wrong}`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
