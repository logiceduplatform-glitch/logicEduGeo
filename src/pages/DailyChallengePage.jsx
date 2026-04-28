import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const DAILY_QUESTIONS = [
  { q: { el: "Πόσο είναι το 15% του 200;", en: "What is 15% of 200?" }, opts: ["25", "30", "35", "40"], correct: 1, cat: "math" },
  { q: { el: "Ποιο ζώο είναι το πιο γρήγορο στη στεριά;", en: "What is the fastest land animal?" }, opts: [{ el: "Λιοντάρι", en: "Lion" }, { el: "Τσίτα", en: "Cheetah" }, { el: "Άλογο", en: "Horse" }, { el: "Στρουθοκάμηλος", en: "Ostrich" }], correct: 1, cat: "nature" },
  { q: { el: "Ποιο είναι το μεγαλύτερο πλανήτη του ηλιακού μας;", en: "What is the largest planet in our solar system?" }, opts: [{ el: "Κρόνος", en: "Saturn" }, { el: "Δίας", en: "Jupiter" }, { el: "Ουρανός", en: "Uranus" }, { el: "Ποσειδώνας", en: "Neptune" }], correct: 1, cat: "science" },
  { q: { el: "Πόσες πλευρές έχει ένα οκτάγωνο;", en: "How many sides does an octagon have?" }, opts: ["6", "7", "8", "9"], correct: 2, cat: "math" },
  { q: { el: "Ποιος έγραψε την Οδύσσεια;", en: "Who wrote the Odyssey?" }, opts: [{ el: "Σοφοκλής", en: "Sophocles" }, { el: "Όμηρος", en: "Homer" }, { el: "Πλάτων", en: "Plato" }, { el: "Αριστοτέλης", en: "Aristotle" }], correct: 1, cat: "history" },
  { q: { el: "Ποιο χημικό στοιχείο συμβολίζεται με 'O';", en: "Which chemical element is symbolized by 'O'?" }, opts: [{ el: "Χρυσός", en: "Gold" }, { el: "Οξυγόνο", en: "Oxygen" }, { el: "Οσμιο", en: "Osmium" }, { el: "Όσμιο", en: "Oganesson" }], correct: 1, cat: "science" },
  { q: { el: "5 × 7 + 3 = ?", en: "5 × 7 + 3 = ?" }, opts: ["35", "36", "38", "53"], correct: 2, cat: "math" },
  { q: { el: "Ποια είναι η πρωτεύουσα της Ιταλίας;", en: "What is the capital of Italy?" }, opts: [{ el: "Μιλάνο", en: "Milan" }, { el: "Ρώμη", en: "Rome" }, { el: "Βενετία", en: "Venice" }, { el: "Νάπολη", en: "Naples" }], correct: 1, cat: "geography" },
  { q: { el: "Τι σημαίνει η λέξη 'φιλοσοφία';", en: "What does the word 'philosophy' mean?" }, opts: [{ el: "Αγάπη σοφίας", en: "Love of wisdom" }, { el: "Αγάπη τέχνης", en: "Love of art" }, { el: "Αγάπη φύσης", en: "Love of nature" }, { el: "Αγάπη δύναμης", en: "Love of power" }], correct: 0, cat: "language" },
  { q: { el: "Ποιο σχήμα έχει 3 πλευρές;", en: "Which shape has 3 sides?" }, opts: [{ el: "Τετράγωνο", en: "Square" }, { el: "Τρίγωνο", en: "Triangle" }, { el: "Πεντάγωνο", en: "Pentagon" }, { el: "Κύκλος", en: "Circle" }], correct: 1, cat: "math" },
  { q: { el: "Ποιο πλανήτης λέγεται «Κόκκινος Πλανήτης»;", en: "Which planet is called the 'Red Planet'?" }, opts: [{ el: "Αφροδίτη", en: "Venus" }, { el: "Άρης", en: "Mars" }, { el: "Δίας", en: "Jupiter" }, { el: "Ερμής", en: "Mercury" }], correct: 1, cat: "science" },
  { q: { el: "Ποιο είναι το μεγαλύτερο ωκεανό;", en: "What is the largest ocean?" }, opts: [{ el: "Ατλαντικός", en: "Atlantic" }, { el: "Ινδικός", en: "Indian" }, { el: "Ειρηνικός", en: "Pacific" }, { el: "Αρκτικός", en: "Arctic" }], correct: 2, cat: "geography" },
  { q: { el: "√49 = ?", en: "√49 = ?" }, opts: ["5", "6", "7", "8"], correct: 2, cat: "math" },
  { q: { el: "Πόσα χρώματα έχει το ουράνιο τόξο;", en: "How many colors does a rainbow have?" }, opts: ["5", "6", "7", "8"], correct: 2, cat: "science" },
  { q: { el: "Ποιο ζώο κάνει μετάξι;", en: "Which animal makes silk?" }, opts: [{ el: "Αράχνη", en: "Spider" }, { el: "Μεταξοσκώληκας", en: "Silkworm" }, { el: "Μέλισσα", en: "Bee" }, { el: "Κάμπια", en: "Caterpillar" }], correct: 1, cat: "nature" },
  { q: { el: "Ποιος ανακάλυψε τη βαρύτητα;", en: "Who discovered gravity?" }, opts: [{ el: "Αϊνστάιν", en: "Einstein" }, { el: "Νεύτων", en: "Newton" }, { el: "Γαλιλαίος", en: "Galileo" }, { el: "Κοπέρνικος", en: "Copernicus" }], correct: 1, cat: "science" },
  { q: { el: "12 × 12 = ?", en: "12 × 12 = ?" }, opts: ["124", "132", "144", "156"], correct: 2, cat: "math" },
  { q: { el: "Ποιο είναι το μικρότερο ήπειρο;", en: "What is the smallest continent?" }, opts: [{ el: "Ευρώπη", en: "Europe" }, { el: "Ωκεανία", en: "Oceania" }, { el: "Ανταρκτική", en: "Antarctica" }, { el: "Αφρική", en: "Africa" }], correct: 1, cat: "geography" },
  { q: { el: "Πόσα οστά έχει ο ενήλικος άνθρωπος;", en: "How many bones does an adult human have?" }, opts: ["186", "206", "226", "256"], correct: 1, cat: "science" },
  { q: { el: "Ποια γλώσσα μιλιέται από τους περισσότερους ανθρώπους;", en: "Which language is spoken by the most people?" }, opts: [{ el: "Αγγλικά", en: "English" }, { el: "Κινεζικά", en: "Mandarin" }, { el: "Ισπανικά", en: "Spanish" }, { el: "Χίντι", en: "Hindi" }], correct: 1, cat: "language" },
  { q: { el: "100 − 37 = ?", en: "100 − 37 = ?" }, opts: ["53", "63", "67", "73"], correct: 1, cat: "math" },
  { q: { el: "Ποιο μέταλλο είναι υγρό σε θερμοκρασία δωματίου;", en: "Which metal is liquid at room temperature?" }, opts: [{ el: "Σίδηρος", en: "Iron" }, { el: "Υδράργυρος", en: "Mercury" }, { el: "Αλουμίνιο", en: "Aluminum" }, { el: "Χαλκός", en: "Copper" }], correct: 1, cat: "science" },
  { q: { el: "Ποιο ζώο έχει τα περισσότερα πόδια;", en: "Which animal has the most legs?" }, opts: [{ el: "Αράχνη", en: "Spider" }, { el: "Σαρανταποδαρούσα", en: "Centipede" }, { el: "Χταπόδι", en: "Octopus" }, { el: "Χιλιοποδαρούσα", en: "Millipede" }], correct: 3, cat: "nature" },
  { q: { el: "Ποιος ζωγράφισε τη Μόνα Λίζα;", en: "Who painted the Mona Lisa?" }, opts: [{ el: "Πικάσο", en: "Picasso" }, { el: "Ντα Βίντσι", en: "Da Vinci" }, { el: "Βαν Γκογκ", en: "Van Gogh" }, { el: "Μιχαήλ Άγγελος", en: "Michelangelo" }], correct: 1, cat: "history" },
  { q: { el: "2³ = ?", en: "2³ = ?" }, opts: ["4", "6", "8", "16"], correct: 2, cat: "math" },
  { q: { el: "Ποια χώρα έχει σχήμα μπότας;", en: "Which country is shaped like a boot?" }, opts: [{ el: "Ισπανία", en: "Spain" }, { el: "Ιταλία", en: "Italy" }, { el: "Πορτογαλία", en: "Portugal" }, { el: "Ελλάδα", en: "Greece" }], correct: 1, cat: "geography" },
  { q: { el: "Πόσα λεπτά έχει μια ώρα;", en: "How many minutes are in an hour?" }, opts: ["30", "45", "60", "90"], correct: 2, cat: "math" },
  { q: { el: "Ποιο είναι το πιο κοινό στοιχείο στο σύμπαν;", en: "What is the most common element in the universe?" }, opts: [{ el: "Ήλιο", en: "Helium" }, { el: "Υδρογόνο", en: "Hydrogen" }, { el: "Οξυγόνο", en: "Oxygen" }, { el: "Άνθρακας", en: "Carbon" }], correct: 1, cat: "science" },
  { q: { el: "Πόσες ημέρες έχει ο Φεβρουάριος σε δίσεκτο έτος;", en: "How many days does February have in a leap year?" }, opts: ["27", "28", "29", "30"], correct: 2, cat: "math" },
  { q: { el: "Ποιο φρούτο περιέχει περισσότερη βιταμίνη C;", en: "Which fruit has the most vitamin C?" }, opts: [{ el: "Μήλο", en: "Apple" }, { el: "Πορτοκάλι", en: "Orange" }, { el: "Ακτινίδιο", en: "Kiwi" }, { el: "Μπανάνα", en: "Banana" }], correct: 2, cat: "nature" },
];

function seedRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDailyQuestions(dateKey) {
  const seed = dateKey.split("-").reduce((a, b) => a + parseInt(b), 0) * 7919;
  const rng = seedRandom(seed);
  const indices = [];
  const pool = [...Array(DAILY_QUESTIONS.length).keys()];
  for (let i = 0; i < 5 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    indices.push(pool.splice(idx, 1)[0]);
  }
  return indices.map(i => DAILY_QUESTIONS[i]);
}

function getResult(dateKey) {
  try { return JSON.parse(localStorage.getItem(`geo:dailyChallenge:${dateKey}`)); } catch { return null; }
}
function saveResult(dateKey, result) {
  localStorage.setItem(`geo:dailyChallenge:${dateKey}`, JSON.stringify(result));
}
function getDailyStreak() {
  try { return JSON.parse(localStorage.getItem("geo:dailyChallengeStreak")) || { current: 0, best: 0, lastDate: "" }; } catch { return { current: 0, best: 0, lastDate: "" }; }
}
function saveDailyStreak(s) { localStorage.setItem("geo:dailyChallengeStreak", JSON.stringify(s)); }

const CAT_ICONS = { math: "🧮", science: "🔬", nature: "🌿", geography: "🌍", history: "📜", language: "📖" };

const T = {
  el: {
    title: "Ημερήσια Πρόκληση",
    subtitle: "5 ερωτήσεις — Μία ευκαιρία — Κάθε μέρα!",
    start: "Ξεκίνα!",
    question: "Ερώτηση",
    of: "από",
    correct: "Σωστό!",
    wrong: "Λάθος!",
    next: "Επόμενη",
    streak: "Σερί",
    bestStreak: "Καλύτερο",
    days: "ημέρες",
    completed: "Σήμερα ολοκληρώθηκε!",
    score: "Σκορ",
    bonus: "Bonus",
    xpEarned: "XP",
    coinsEarned: "coins",
    share: "Μοιράσου",
    shareText: "Ημερήσια Πρόκληση GeoLearn",
    playAgain: "Αύριο ξανά!",
    back: "Πίσω",
    alreadyPlayed: "Έχεις ήδη ολοκληρώσει τη σημερινή πρόκληση!",
    yourScore: "Το σκορ σου",
    perfect: "Τέλειο!",
    great: "Μπράβο!",
    good: "Καλά!",
    tryAgain: "Δοκίμασε αύριο!",
    tomorrow: "Νέα πρόκληση αύριο!",
  },
  en: {
    title: "Daily Challenge",
    subtitle: "5 questions — One chance — Every day!",
    start: "Start!",
    question: "Question",
    of: "of",
    correct: "Correct!",
    wrong: "Wrong!",
    next: "Next",
    streak: "Streak",
    bestStreak: "Best",
    days: "days",
    completed: "Today's challenge done!",
    score: "Score",
    bonus: "Bonus",
    xpEarned: "XP",
    coinsEarned: "coins",
    share: "Share",
    shareText: "GeoLearn Daily Challenge",
    playAgain: "Come back tomorrow!",
    back: "Back",
    alreadyPlayed: "You've already completed today's challenge!",
    yourScore: "Your score",
    perfect: "Perfect!",
    great: "Great job!",
    good: "Good!",
    tryAgain: "Try again tomorrow!",
    tomorrow: "New challenge tomorrow!",
  },
};

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";
  const todayKey = getTodayKey();
  const questions = useMemo(() => getDailyQuestions(todayKey), [todayKey]);

  const [existingResult] = useState(() => getResult(todayKey));
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(!!existingResult);
  const [finalScore, setFinalScore] = useState(existingResult?.score || 0);
  const [streak, setStreak] = useState(() => getDailyStreak());
  const [rewarded, setRewarded] = useState(!!existingResult);

  const getOptLabel = (opt) => {
    if (typeof opt === "string") return opt;
    return isEl ? opt.el : opt.en;
  };

  const handleSelect = (idx) => {
    if (feedback !== null) return;
    setSelected(idx);
    const isCorrect = idx === questions[qIdx].correct;
    setFeedback(isCorrect);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (qIdx >= 4) {
      const finalS = score + (feedback ? 0 : 0);
      const s = feedback ? score : score;
      setFinalScore(s);
      setFinished(true);
      saveResult(todayKey, { score: s, total: 5, date: todayKey });

      const streakData = getDailyStreak();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      if (streakData.lastDate === yKey) {
        streakData.current += 1;
      } else if (streakData.lastDate !== todayKey) {
        streakData.current = 1;
      }
      streakData.best = Math.max(streakData.best, streakData.current);
      streakData.lastDate = todayKey;
      saveDailyStreak(streakData);
      setStreak(streakData);

      if (!rewarded) {
        ProgressService.addXP(s * 3, 2);
        CoinService.earn(s >= 4 ? 5 : s >= 2 ? 3 : 1);
        setRewarded(true);
      }
    } else {
      setQIdx(prev => prev + 1);
      setSelected(null);
      setFeedback(null);
    }
  };

  const handleShare = () => {
    const grid = questions.map((_, i) => {
      const res = getResult(todayKey);
      return "🟩";
    }).join("");
    const text = `${l.shareText} ${todayKey}\n${finalScore}/5 ${"⭐".repeat(finalScore)}${"☆".repeat(5 - finalScore)}\n\nhttps://geoloplatform.com/daily`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const getMessage = () => {
    if (finalScore === 5) return l.perfect;
    if (finalScore >= 4) return l.great;
    if (finalScore >= 2) return l.good;
    return l.tryAgain;
  };

  if (finished || existingResult) {
    const s = existingResult?.score ?? finalScore;
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-7xl mb-2">{s === 5 ? "🏆" : s >= 3 ? "🌟" : "💪"}</div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.completed}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">{getMessage()}</p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                {s}/5
              </div>
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map(i => <span key={i} className="text-2xl">{i < s ? "⭐" : "☆"}</span>)}
              </div>

              {!existingResult && (
                <div className="flex justify-center gap-6 text-sm">
                  <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-xl">
                    <span className="font-bold text-purple-600 dark:text-purple-400">+{s * 30} {l.xpEarned}</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-xl">
                    <span className="font-bold text-amber-600 dark:text-amber-400">+{s >= 4 ? 5 : s >= 2 ? 3 : 1} 🪙</span>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">🔥 {streak.current}</div>
                  <div>{l.streak}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">🏅 {streak.best}</div>
                  <div>{l.bestStreak}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={handleShare} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-md hover:shadow-lg transition-all">
                {l.share}
              </button>
              <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                {l.back}
              </button>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">{l.tomorrow}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-7xl mb-2 animate-bounce">🎯</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">🔥 {streak.current}</div>
                  <div>{l.streak}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">🏅 {streak.best}</div>
                  <div>{l.bestStreak}</div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {questions.map((q, i) => (
                  <span key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-sm">{CAT_ICONS[q.cat] || "❓"}</span>
                ))}
              </div>
              <div className="text-xs text-slate-400 mb-1">{isEl ? "3x XP + Bonus coins" : "3x XP + Bonus coins"}</div>
            </div>

            <button onClick={() => setStarted(true)} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              {l.start}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  const progress = ((qIdx + 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{l.question} {qIdx + 1} {l.of} 5</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{score}/{qIdx + (feedback !== null ? 1 : 0)}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 dark:border-slate-700 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{CAT_ICONS[q.cat] || "❓"}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">{q.cat}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-snug">
              {isEl ? q.q.el : q.q.en}
            </h2>

            <div className="space-y-3">
              {q.opts.map((opt, i) => {
                let cls = "border-slate-200 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500";
                if (feedback !== null) {
                  if (i === q.correct) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30";
                  else if (i === selected && !feedback) cls = "border-red-500 bg-red-50 dark:bg-red-900/30";
                }
                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={feedback !== null} className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-slate-700 dark:text-slate-200 transition-all ${cls} disabled:cursor-default`}>
                    <span className="text-slate-400 mr-3 font-bold">{String.fromCharCode(65 + i)}</span>
                    {getOptLabel(opt)}
                  </button>
                );
              })}
            </div>

            {feedback !== null && (
              <div className="flex items-center justify-between pt-2">
                <span className={`text-sm font-bold ${feedback ? "text-emerald-600" : "text-red-500"}`}>
                  {feedback ? `✅ ${l.correct}` : `❌ ${l.wrong}`}
                </span>
                <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md hover:shadow-lg transition-all">
                  {qIdx >= 4 ? (isEl ? "Αποτέλεσμα" : "Result") : `${l.next} →`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
