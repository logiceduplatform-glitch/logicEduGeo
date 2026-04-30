import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { COPLAY_CATEGORIES } from "../config/coPlayQuestions";
import { CoinService } from "../services/CoinService";
import { ProgressService } from "../services/ProgressService";

const T = {
  el: {
    title: "👨‍👩‍👧 Παίξε με τους Γονείς",
    subtitle: "Παιχνίδι trivia για γονιό & παιδί στην ίδια συσκευή. Ο καθένας απαντά τη δική του ερώτηση!",
    pickCat: "Διάλεξε κατηγορία:",
    setupTitle: "Ποιοι παίζουν;",
    parentName: "Όνομα γονιού",
    childName: "Όνομα παιδιού",
    rounds: "Πόσοι γύροι;",
    start: "🚀 Έναρξη",
    parentTurn: "🧑‍🦱 Σειρά Γονιού",
    childTurn: "🧒 Σειρά Παιδιού",
    pass: "→ Πέρνα τη συσκευή",
    passTo: "Δώσε τη συσκευή στον/στην",
    ready: "Είμαι έτοιμος/η!",
    correct: "✅ Σωστό!",
    wrong: "❌ Λάθος",
    correctAnswer: "Σωστή απάντηση:",
    next: "Επόμενο →",
    finished: "🏆 Τέλος Παιχνιδιού!",
    winner: "Νικητής:",
    tie: "🤝 Ισοπαλία!",
    parentScore: "Γονιός",
    childScore: "Παιδί",
    againChip: "🎮 Ξανά",
    backChip: "🏠 Αρχική",
    bondingTip: "💡 Tip: Παίζετε μαζί 15' την ημέρα — δυναμώνει την οικογενειακή σχέση!",
    round: "Γύρος",
    of: "από",
    back: "← Πίσω",
    quickStart: "Γρήγορη έναρξη",
  },
  en: {
    title: "👨‍👩‍👧 Co-Play with Parent",
    subtitle: "Trivia game for parent & child on the same device. Each answers their own question!",
    pickCat: "Pick a category:",
    setupTitle: "Who's playing?",
    parentName: "Parent name",
    childName: "Child name",
    rounds: "How many rounds?",
    start: "🚀 Start",
    parentTurn: "🧑‍🦱 Parent's Turn",
    childTurn: "🧒 Child's Turn",
    pass: "→ Pass the device",
    passTo: "Pass the device to",
    ready: "I'm ready!",
    correct: "✅ Correct!",
    wrong: "❌ Wrong",
    correctAnswer: "Correct answer:",
    next: "Next →",
    finished: "🏆 Game Over!",
    winner: "Winner:",
    tie: "🤝 It's a tie!",
    parentScore: "Parent",
    childScore: "Child",
    againChip: "🎮 Again",
    backChip: "🏠 Home",
    bondingTip: "💡 Tip: Play together 15' a day — strengthens family bonds!",
    round: "Round",
    of: "of",
    back: "← Back",
    quickStart: "Quick start",
  },
};

export default function CoPlayPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  // Phases: setup → playing → finished
  const [phase, setPhase] = useState("setup");
  const [parentName, setParentName] = useState(lang === "el" ? "Μαμά" : "Mom");
  const [childName, setChildName] = useState(lang === "el" ? "Παιδί" : "Kid");
  const [category, setCategory] = useState(null);
  const [rounds, setRounds] = useState(3);

  const [round, setRound] = useState(0);
  const [turn, setTurn] = useState("child"); // who plays first → child
  const [scores, setScores] = useState({ parent: 0, child: 0 });
  const [passing, setPassing] = useState(true);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  // Pick which questions to play this game (random sampling from category)
  const playList = useMemo(() => {
    if (!category) return [];
    const arr = [...category.questions];
    arr.sort(() => 0.5 - Math.random());
    return arr.slice(0, rounds);
  }, [category, rounds]);

  const start = () => {
    if (!category) return;
    setPhase("playing");
    setRound(0);
    setTurn("child");
    setScores({ parent: 0, child: 0 });
    setPassing(true);
    setSelected(null);
    setAnswered(false);
  };

  const currentQ = playList[round]?.[turn === "parent" ? "parent" : "kid"];

  const handleAnswer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (currentQ && i === currentQ.correct) {
      setScores((s) => ({ ...s, [turn]: s[turn] + 1 }));
    }
  };

  const handleNext = () => {
    setSelected(null);
    setAnswered(false);
    if (turn === "child") {
      setTurn("parent");
      setPassing(true);
    } else {
      // Parent finished → next round, hand to child
      if (round + 1 >= playList.length) {
        finish();
        return;
      }
      setRound(round + 1);
      setTurn("child");
      setPassing(true);
    }
  };

  const finish = () => {
    setPhase("finished");
    // Reward both: child gets coins, parent gets nothing (it's symbolic)
    try {
      const childCoins = scores.child * 10 + 5;
      CoinService.earn(childCoins, "co_play");
      ProgressService.addXP?.(scores.child * 15);
    } catch {}
  };

  // ----- Render -----
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-2xl space-y-5">
            <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">{l.back}</button>

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">{l.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 space-y-4 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">{l.setupTitle}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">{l.parentName}</label>
                  <input value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">{l.childName}</label>
                  <input value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">{l.rounds}</label>
                <div className="flex gap-2 mt-1">
                  {[3, 5, 7].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRounds(n)}
                      className={`flex-1 py-2 rounded-lg font-bold ${rounds === n ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}
                    >{n}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 space-y-3 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">{l.pickCat}</h2>
              <div className="grid grid-cols-2 gap-3">
                {COPLAY_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c)}
                    className={`bg-gradient-to-br ${c.color} p-4 rounded-2xl text-white shadow-md hover:scale-105 transition text-left ${category?.id === c.id ? "ring-4 ring-white ring-offset-2 ring-offset-rose-100" : ""}`}
                  >
                    <div className="text-xl font-extrabold">{c.title[lang] || c.title.en}</div>
                    <p className="text-xs opacity-90">{c.questions.length} ερωτήσεις</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={start}
              disabled={!category || !parentName || !childName}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-lg shadow-xl disabled:opacity-50"
            >
              {l.start}
            </button>

            <p className="text-center text-sm text-slate-500">{l.bondingTip}</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    const turnName = turn === "parent" ? parentName : childName;
    const turnLabel = turn === "parent" ? l.parentTurn : l.childTurn;
    const turnEmoji = turn === "parent" ? "🧑‍🦱" : "🧒";

    return (
      <div className={`min-h-screen bg-gradient-to-br ${turn === "parent" ? "from-blue-100 to-indigo-200" : "from-amber-100 to-rose-200"} dark:from-slate-900 dark:to-slate-800`}>
        <Navbar />
        <SEO title={`${turnLabel} – ${l.title}`} />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-2xl space-y-5">

            <div className="grid grid-cols-2 gap-3">
              <div className={`bg-white dark:bg-slate-800 rounded-xl p-3 text-center border-2 ${turn === "parent" ? "border-blue-500" : "border-transparent"}`}>
                <p className="text-xs font-bold text-slate-500">🧑‍🦱 {parentName}</p>
                <p className="text-2xl font-extrabold text-blue-600">{scores.parent}</p>
              </div>
              <div className={`bg-white dark:bg-slate-800 rounded-xl p-3 text-center border-2 ${turn === "child" ? "border-rose-500" : "border-transparent"}`}>
                <p className="text-xs font-bold text-slate-500">🧒 {childName}</p>
                <p className="text-2xl font-extrabold text-rose-600">{scores.child}</p>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-slate-300 font-bold">
              {l.round} {round + 1} {l.of} {playList.length}
            </p>

            {passing ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-xl">
                <div className="text-7xl mb-4 animate-pulse">{turnEmoji}</div>
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{l.passTo} {turnName}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{turnLabel}</p>
                <button
                  onClick={() => setPassing(false)}
                  className="mt-6 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg"
                >
                  {l.ready}
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-500">{turnLabel}</span>
                  <span className="text-2xl">{turnEmoji}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-4">
                  {currentQ?.q[lang] || currentQ?.q?.en}
                </h3>

                <div className="space-y-2">
                  {(currentQ?.options[lang] || currentQ?.options?.en || []).map((opt, i) => {
                    const isCorrect = answered && i === currentQ.correct;
                    const isWrong = answered && i === selected && i !== currentQ.correct;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={answered}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${
                          isCorrect ? "bg-emerald-500 text-white" :
                          isWrong ? "bg-rose-500 text-white" :
                          answered ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 opacity-60" :
                          "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <p className="font-extrabold">
                      {selected === currentQ.correct ? l.correct : l.wrong}
                    </p>
                    {selected !== currentQ.correct && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {l.correctAnswer} <span className="font-bold text-emerald-600">{currentQ.options[lang][currentQ.correct] || currentQ.options.en[currentQ.correct]}</span>
                      </p>
                    )}
                    <button
                      onClick={handleNext}
                      className="mt-3 w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold"
                    >
                      {l.next}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Finished
  const winner =
    scores.parent > scores.child ? parentName :
    scores.child > scores.parent ? childName : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-rose-100 to-pink-200 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <SEO title={l.finished} />
      <div className="pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4">
          <div className="text-7xl">{winner ? "🏆" : "🤝"}</div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.finished}</h2>

          {winner ? (
            <p className="text-xl font-bold text-emerald-600">{l.winner} {winner}!</p>
          ) : (
            <p className="text-xl font-bold text-slate-600 dark:text-slate-300">{l.tie}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4">
              <p className="text-xs text-slate-500 font-bold">🧑‍🦱 {parentName}</p>
              <p className="text-3xl font-extrabold text-blue-600">{scores.parent}</p>
            </div>
            <div className="bg-rose-100 dark:bg-rose-900/30 rounded-xl p-4">
              <p className="text-xs text-slate-500 font-bold">🧒 {childName}</p>
              <p className="text-3xl font-extrabold text-rose-600">{scores.child}</p>
            </div>
          </div>

          <p className="text-sm text-slate-500">{l.bondingTip}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={() => setPhase("setup")} className="py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold">
              {l.againChip}
            </button>
            <button onClick={() => navigate("/")} className="py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
              {l.backChip}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
