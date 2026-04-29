import React, { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProfileService } from "../services/ProfileService";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import { StorageService } from "../services/StorageService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const FAMILY_QUESTIONS = [
  { q: { el: "Ποιος πλανήτης είναι ο πιο μεγάλος;", en: "Largest planet?" }, options: [{ el: "Άρης", en: "Mars" }, { el: "Δίας", en: "Jupiter" }, { el: "Γη", en: "Earth" }, { el: "Κρόνος", en: "Saturn" }], correct: 1 },
  { q: { el: "Πόσο είναι 12 × 8;", en: "What is 12 × 8?" }, options: ["86", "96", "108", "112"], correct: 1 },
  { q: { el: "Ποια είναι η πρωτεύουσα της Ισπανίας;", en: "Capital of Spain?" }, options: [{ el: "Λισαβόνα", en: "Lisbon" }, { el: "Μαδρίτη", en: "Madrid" }, { el: "Ρώμη", en: "Rome" }, { el: "Παρίσι", en: "Paris" }], correct: 1 },
  { q: { el: "Πόσα οστά έχει ο άνθρωπος;", en: "Bones in human body?" }, options: ["106", "206", "306", "406"], correct: 1 },
  { q: { el: "Σε τι θερμοκρασία βράζει το νερό;", en: "Boiling point of water?" }, options: ["50°C", "75°C", "100°C", "150°C"], correct: 2 },
  { q: { el: "Ποιος έγραψε την Οδύσσεια;", en: "Who wrote the Odyssey?" }, options: [{ el: "Σοφοκλής", en: "Sophocles" }, { el: "Πλάτων", en: "Plato" }, { el: "Όμηρος", en: "Homer" }, { el: "Αριστοτέλης", en: "Aristotle" }], correct: 2 },
  { q: { el: "Πόσες ηπείρους έχει η Γη;", en: "How many continents?" }, options: ["5", "6", "7", "8"], correct: 2 },
  { q: { el: "9² = ?", en: "9² = ?" }, options: ["72", "81", "89", "99"], correct: 1 },
  { q: { el: "Ποιο είναι το πιο γρήγορο ζώο;", en: "Fastest animal?" }, options: [{ el: "Λιοντάρι", en: "Lion" }, { el: "Τσίτα", en: "Cheetah" }, { el: "Άλογο", en: "Horse" }, { el: "Λύκος", en: "Wolf" }], correct: 1 },
  { q: { el: "1 km = πόσα μέτρα;", en: "1 km = how many meters?" }, options: ["100", "500", "1000", "10000"], correct: 2 },
  { q: { el: "Ποιο είναι το χρώμα του ήλιου;", en: "Sun's color?" }, options: [{ el: "Κόκκινο", en: "Red" }, { el: "Κίτρινο", en: "Yellow" }, { el: "Πράσινο", en: "Green" }, { el: "Μπλε", en: "Blue" }], correct: 1 },
  { q: { el: "Πόσο είναι 144 ÷ 12;", en: "144 ÷ 12?" }, options: ["10", "12", "14", "16"], correct: 1 },
];

const T = {
  el: {
    title: "Οικογενειακή Πρόκληση",
    subtitle: "Παίξε quiz μαζί με το παιδί σου - ποιος θα κερδίσει;",
    intro: "Τρία γύροι ερωτήσεων. Ο γονέας απαντάει, μετά το παιδί. Ποιος θα κάνει περισσότερες σωστές;",
    chooseChild: "Διάλεξε παιδί",
    parentName: "Όνομα γονέα",
    parentDefault: "Γονέας",
    rounds: "Γύροι",
    start: "🚀 Ξεκίνα την Πρόκληση!",
    parentTurn: "Σειρά Γονέα",
    childTurn: "Σειρά Παιδιού",
    passDevice: "📱 Δώσε το κινητό στον/στην",
    iAmReady: "Είμαι έτοιμος/η!",
    question: "Ερώτηση",
    of: "από",
    correct: "✓ Σωστά!",
    wrong: "✗ Λάθος",
    next: "Επόμενο",
    finished: "Ολοκληρώθηκε!",
    score: "Σκορ",
    winner: "🏆 Νικητής:",
    tie: "🤝 Ισοπαλία!",
    playAgain: "🔁 Ξανά",
    backDash: "← Πίσω",
    rewardEarned: "Κέρδισες +20 XP & +5 coins!",
    needChild: "Χρειάζεται τουλάχιστον ένα παιδικό προφίλ.",
    goCreate: "Δημιουργία προφίλ",
  },
  en: {
    title: "Family Challenge",
    subtitle: "Play a quiz with your child - who will win?",
    intro: "Three rounds of questions. Parent answers first, then child. Who gets more correct?",
    chooseChild: "Choose child",
    parentName: "Parent name",
    parentDefault: "Parent",
    rounds: "Rounds",
    start: "🚀 Start Challenge!",
    parentTurn: "Parent's Turn",
    childTurn: "Child's Turn",
    passDevice: "📱 Pass the device to",
    iAmReady: "I'm ready!",
    question: "Question",
    of: "of",
    correct: "✓ Correct!",
    wrong: "✗ Wrong",
    next: "Next",
    finished: "Finished!",
    score: "Score",
    winner: "🏆 Winner:",
    tie: "🤝 It's a tie!",
    playAgain: "🔁 Play again",
    backDash: "← Back",
    rewardEarned: "Earned +20 XP & +5 coins!",
    needChild: "At least one child profile required.",
    goCreate: "Create profile",
  },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOpt(opt, lang) {
  if (typeof opt === "string") return opt;
  return lang === "el" ? opt.el : opt.en;
}

export default function FamilyChallengePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const navigate = useNavigate();
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const children = useMemo(() => ProfileService.getAll(), []);
  const [stage, setStage] = useState("intro"); // intro | passParent | parentPlay | passChild | childPlay | result
  const [parentName, setParentName] = useState(l.parentDefault);
  const [childId, setChildId] = useState(children[0]?.id || "");
  const [rounds, setRounds] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [parentScore, setParentScore] = useState(0);
  const [childScore, setChildScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => { setParentName(l.parentDefault); }, [lang]); // eslint-disable-line

  const child = children.find(c => c.id === childId);

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-24 max-w-md mx-auto px-4 text-center">
          <SEO title={l.title} />
          <span className="text-6xl block mb-4">👨‍👩‍👧</span>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{l.title}</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">{l.needChild}</p>
          <button onClick={() => navigate("/profile")} className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold">
            {l.goCreate}
          </button>
        </div>
      </div>
    );
  }

  const startGame = () => {
    if (!childId) return;
    const picked = shuffle(FAMILY_QUESTIONS).slice(0, rounds);
    setQuestions(picked);
    setParentScore(0);
    setChildScore(0);
    setCurrentIdx(0);
    setFeedback(null);
    setStage("passParent");
  };

  const handleAnswer = (idx) => {
    if (feedback) return;
    const isCorrect = idx === questions[currentIdx].correct;
    setFeedback({ correct: isCorrect, picked: idx });
    if (stage === "parentPlay" && isCorrect) setParentScore(s => s + 1);
    if (stage === "childPlay" && isCorrect) setChildScore(s => s + 1);
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else if (stage === "parentPlay") {
      setCurrentIdx(0);
      setStage("passChild");
    } else {
      setStage("result");
      if (!rewardClaimed) {
        try {
          const prevScope = StorageService.getScope();
          StorageService.setScope(childId);
          ProgressService.addXP(20);
          CoinService.earn(5, "family_challenge");
          if (prevScope) StorageService.setScope(prevScope.replace("profile:", "").replace(/:$/, ""));
          else StorageService.setScope(null);
        } catch {}
        setRewardClaimed(true);
      }
    }
  };

  const isParent = stage === "parentPlay";
  const isChild = stage === "childPlay";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          <button onClick={() => navigate(-1)} className="mb-4 text-sm text-slate-500 hover:text-purple-700">
            {l.backDash}
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 text-white mb-6 text-center">
            <span className="text-5xl block mb-2">👨‍👩‍👧</span>
            <h1 className="text-2xl font-bold">{l.title}</h1>
            <p className="text-pink-200 text-sm mt-1">{l.subtitle}</p>
          </div>

          {stage === "intro" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md space-y-4">
              <p className="text-slate-600 dark:text-slate-300 text-sm">{l.intro}</p>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.parentName}</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.chooseChild}</label>
                <div className="flex flex-wrap gap-2">
                  {children.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setChildId(c.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${childId === c.id ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
                    >
                      <span>{c.avatar || "👤"}</span> {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.rounds}</label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setRounds(n)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold ${rounds === n ? "bg-purple-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={!childId}
                className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 text-white font-extrabold text-lg shadow-md hover:shadow-xl disabled:opacity-50"
              >
                {l.start}
              </button>
            </div>
          )}

          {(stage === "passParent" || stage === "passChild") && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md text-center">
              <span className="text-7xl block mb-4 animate-bounce">📱</span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {l.passDevice} <span className="text-purple-600">{stage === "passParent" ? parentName : child.name} {child.avatar}</span>
              </h2>
              <button
                onClick={() => setStage(stage === "passParent" ? "parentPlay" : "childPlay")}
                className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md"
              >
                {l.iAmReady}
              </button>
            </div>
          )}

          {(isParent || isChild) && questions[currentIdx] && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isParent ? "bg-blue-500" : "bg-pink-500"}`}>
                  {isParent ? `${parentName} - ${l.parentTurn}` : `${child.avatar} ${child.name} - ${l.childTurn}`}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {l.question} {currentIdx + 1} {l.of} {questions.length}
                </span>
              </div>

              {/* Live scores */}
              <div className="flex items-center justify-around bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
                <div>
                  <div className="text-xs text-slate-500">{parentName}</div>
                  <div className="text-2xl font-extrabold text-blue-600">{parentScore}</div>
                </div>
                <span className="text-xl">VS</span>
                <div>
                  <div className="text-xs text-slate-500">{child.name}</div>
                  <div className="text-2xl font-extrabold text-pink-600">{childScore}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center py-2">
                {getOpt(questions[currentIdx].q, lang)}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {questions[currentIdx].options.map((opt, idx) => {
                  let style = "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/30";
                  if (feedback) {
                    if (idx === questions[currentIdx].correct) style = "bg-emerald-500 text-white";
                    else if (idx === feedback.picked) style = "bg-red-500 text-white";
                    else style = "bg-slate-100 dark:bg-slate-700 text-slate-400 opacity-60";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={!!feedback}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${style}`}
                    >
                      {getOpt(opt, lang)}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className="text-center space-y-2">
                  <div className={`text-lg font-bold ${feedback.correct ? "text-emerald-500" : "text-red-500"}`}>
                    {feedback.correct ? l.correct : l.wrong}
                  </div>
                  <button onClick={nextQuestion} className="px-6 py-2.5 rounded-xl bg-purple-500 text-white font-bold">
                    {l.next} →
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === "result" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md text-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{l.finished}</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                  <div className="text-3xl mb-1">👨‍🦰</div>
                  <div className="text-xs text-slate-500">{parentName}</div>
                  <div className="text-3xl font-extrabold text-blue-600">{parentScore}</div>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-4">
                  <div className="text-3xl mb-1">{child.avatar || "👶"}</div>
                  <div className="text-xs text-slate-500">{child.name}</div>
                  <div className="text-3xl font-extrabold text-pink-600">{childScore}</div>
                </div>
              </div>

              <div className="text-2xl font-extrabold mb-3">
                {parentScore > childScore && (
                  <span className="text-blue-600">{l.winner} {parentName} 🎉</span>
                )}
                {childScore > parentScore && (
                  <span className="text-pink-600">{l.winner} {child.name} {child.avatar} 🎉</span>
                )}
                {parentScore === childScore && (
                  <span className="text-purple-600">{l.tie}</span>
                )}
              </div>

              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-4">
                💝 {child.name}: {l.rewardEarned}
              </p>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => { setStage("intro"); setRewardClaimed(false); }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                >
                  {l.playAgain}
                </button>
                <button
                  onClick={() => navigate("/parent-dashboard")}
                  className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
                >
                  {l.backDash}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
