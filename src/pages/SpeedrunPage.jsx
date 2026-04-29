import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { BR_QUESTIONS } from "../config/battleRoyaleConfig";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import { CountryService } from "../config/countries";
import { addDoc, collection, getDocs, query, orderBy, where, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../auth/firebase";

const T = {
  el: {
    title: "⚡ Speedrun Mode",
    subtitle: "Λύσε όσες περισσότερες ερωτήσεις μπορείς πριν τελειώσει ο χρόνος!",
    back: "Πίσω",
    rules: "Κανόνες",
    rule1: "Έχεις 60 δευτερόλεπτα για όσες ερωτήσεις προλάβεις",
    rule2: "+1 πόντος για κάθε σωστή απάντηση",
    rule3: "−2 δευτερόλεπτα για λάθος απάντηση",
    rule4: "Στο τέλος, το σκορ σου ανεβαίνει στο speed leaderboard",
    selectDuration: "Διάρκεια",
    sec30: "30 δευτ.",
    sec60: "60 δευτ.",
    sec120: "2 λεπτά",
    start: "Ξεκίνα!",
    timeLeft: "Χρόνος",
    score: "Σκορ",
    correct: "Σωστό!",
    wrong: "Λάθος!",
    finished: "Τέλος!",
    yourScore: "Το σκορ σου",
    yourTime: "Ταχύτητα",
    accuracy: "Ακρίβεια",
    submit: "Υποβολή στο leaderboard",
    submitted: "Υποβλήθηκε!",
    playAgain: "Ξανά",
    leaderboard: "🏁 Speed Leaderboard",
    you: "Εσύ",
    perSecond: "ανά δευτ.",
    qpm: "ερωτ./λεπτό",
    bestRecord: "🏆 Καλύτερο",
    notEnoughTime: "Δεν πρόλαβες καμία απάντηση!",
    rewards: "🪙 +5 coins, +10 XP",
  },
  en: {
    title: "⚡ Speedrun Mode",
    subtitle: "Answer as many questions as you can before time runs out!",
    back: "Back",
    rules: "Rules",
    rule1: "You have 60 seconds to answer as many questions as possible",
    rule2: "+1 point per correct answer",
    rule3: "−2 seconds per wrong answer",
    rule4: "Your score appears on the speed leaderboard",
    selectDuration: "Duration",
    sec30: "30 sec",
    sec60: "60 sec",
    sec120: "2 min",
    start: "Start!",
    timeLeft: "Time",
    score: "Score",
    correct: "Correct!",
    wrong: "Wrong!",
    finished: "Finished!",
    yourScore: "Your score",
    yourTime: "Speed",
    accuracy: "Accuracy",
    submit: "Submit to leaderboard",
    submitted: "Submitted!",
    playAgain: "Play again",
    leaderboard: "🏁 Speed Leaderboard",
    you: "You",
    perSecond: "per sec",
    qpm: "questions/min",
    bestRecord: "🏆 Best",
    notEnoughTime: "No answers in time!",
    rewards: "🪙 +5 coins, +10 XP",
  },
};

const DURATIONS = [30, 60, 120];
const BEST_KEY = "geo:speedrunBest";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOptText(opt, lang) {
  if (typeof opt === "string") return opt;
  if (opt && typeof opt === "object") return opt[lang] || opt.en || opt.el || "";
  return String(opt);
}

export default function SpeedrunPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [phase, setPhase] = useState("intro"); // intro | playing | finished
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [submitState, setSubmitState] = useState("idle");
  const [board, setBoard] = useState([]);
  const tickRef = useRef(null);

  const bestScore = useMemo(() => {
    try { return parseInt(localStorage.getItem(BEST_KEY) || "0", 10); } catch { return 0; }
  }, [phase]);

  const currentQ = questions[qIdx];

  const start = () => {
    setQuestions(shuffle(BR_QUESTIONS));
    setQIdx(0);
    setScore(0);
    setAttempts(0);
    setFeedback(null);
    setTimeLeft(duration);
    setPhase("playing");
  };

  const finish = useCallback(() => {
    setPhase("finished");
    if (tickRef.current) clearInterval(tickRef.current);
    try {
      const prev = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
      if (score > prev) localStorage.setItem(BEST_KEY, String(score));
    } catch {}
    if (score > 0) {
      try { ProgressService.addXP?.(10); } catch {}
      try { CoinService.earn(5); } catch {}
    }
  }, [score]);

  useEffect(() => {
    if (phase !== "playing") return;
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current);
          finish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [phase, finish]);

  const handleAnswer = (oi) => {
    if (feedback || !currentQ) return;
    const isCorrect = oi === currentQ.correct;
    setFeedback({ correct: isCorrect, selected: oi });
    setAttempts((a) => a + 1);
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setTimeLeft((t) => Math.max(0, t - 2));
    }
    setTimeout(() => {
      setFeedback(null);
      setQIdx((i) => (i + 1) % questions.length);
    }, 500);
  };

  const loadBoard = useCallback(async () => {
    try {
      const ref = collection(db, "globalLeaderboard");
      const q = query(ref, where("category", "==", "speedrun"), orderBy("score", "desc"), limit(15));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setBoard(list);
    } catch (e) {
      console.error("speedrun board", e);
    }
  }, []);

  useEffect(() => { loadBoard(); }, [loadBoard]);

  const submitToBoard = async () => {
    if (!user || score <= 0) return;
    setSubmitState("submitting");
    try {
      await addDoc(collection(db, "globalLeaderboard"), {
        uid: user.uid,
        name: user.displayName || (user.email || "").split("@")[0] || "Player",
        avatar: user.photoURL || null,
        country: CountryService.get(),
        category: "speedrun",
        score,
        meta: { duration, attempts },
        createdAt: serverTimestamp(),
      });
      setSubmitState("submitted");
      loadBoard();
    } catch (e) {
      console.error(e);
      setSubmitState("idle");
    }
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  const qpm = duration > 0 ? Math.round((score / duration) * 60) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={l.title} description={l.subtitle} canonical="/speedrun" />
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-purple-600 mb-4">← {l.back}</button>

        {phase === "intro" && (
          <>
            <header className="text-center mb-8">
              <div className="text-7xl mb-3">⚡</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{l.title}</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{l.subtitle}</p>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{l.rules}</h2>
                <ul className="text-sm space-y-1.5 text-slate-700 dark:text-slate-200">
                  <li>⏱️ {l.rule1}</li>
                  <li>✅ {l.rule2}</li>
                  <li>❌ {l.rule3}</li>
                  <li>🏁 {l.rule4}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{l.selectDuration}</h2>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      role="radio"
                      aria-checked={duration === d}
                      onClick={() => setDuration(d)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 ${duration === d ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}
                    >
                      {d === 30 ? l.sec30 : d === 60 ? l.sec60 : l.sec120}
                    </button>
                  ))}
                </div>
              </div>

              {bestScore > 0 && (
                <div className="text-center text-sm font-bold text-amber-600 dark:text-amber-400">
                  {l.bestRecord}: {bestScore}
                </div>
              )}

              <button
                onClick={start}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-extrabold shadow-lg hover:shadow-xl transition focus:outline-none focus:ring-4 focus:ring-orange-300"
              >
                ⚡ {l.start}
              </button>
            </div>

            {/* Speed leaderboard */}
            <section className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4">{l.leaderboard}</h2>
              {board.length === 0 ? (
                <p className="text-center py-6 text-slate-500 text-sm">—</p>
              ) : (
                <ol className="space-y-1.5">
                  {board.map((r, i) => {
                    const flag = r.country ? CountryService.getInfo(r.country)?.flag : "";
                    return (
                      <li key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                        <span className="text-sm font-bold w-8 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                        <span className="flex-1 text-sm font-semibold truncate"><span className="mr-1">{flag}</span>{r.name || "Player"}</span>
                        <span className="font-extrabold text-orange-600 dark:text-orange-400">{r.score}</span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </>
        )}

        {phase === "playing" && currentQ && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">{l.timeLeft}</div>
                <div className={`text-3xl font-extrabold tabular-nums ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-orange-600"}`}>{timeLeft}s</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">{l.score}</div>
                <div className="text-3xl font-extrabold text-emerald-600 tabular-nums">{score}</div>
              </div>
            </div>

            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
              <div className={`h-full transition-all ${timeLeft <= 10 ? "bg-red-500" : "bg-gradient-to-r from-orange-400 to-red-500"}`} style={{ width: `${(timeLeft / duration) * 100}%` }} />
            </div>

            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-5 min-h-[3rem]">
              {currentQ.q[lang] || currentQ.q.en}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {currentQ.opts.map((opt, oi) => {
                let cls = "px-4 py-4 rounded-xl border-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-400 ";
                if (feedback) {
                  if (oi === currentQ.correct) cls += "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-800";
                  else if (oi === feedback.selected) cls += "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-800";
                  else cls += "opacity-40 bg-slate-100 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700";
                } else {
                  cls += "bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:border-orange-400 cursor-pointer";
                }
                return (
                  <button key={oi} type="button" onClick={() => handleAnswer(oi)} disabled={!!feedback} className={cls}>
                    {getOptText(opt, lang)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "finished" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-2xl text-center">
            <div className="text-7xl mb-3">{score === 0 ? "💪" : score >= 15 ? "🏆" : score >= 8 ? "🎉" : "👏"}</div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.finished}</h2>

            {score === 0 ? (
              <p className="text-slate-500 mt-2">{l.notEnoughTime}</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 my-6">
                  <Stat label={l.yourScore} value={score} icon="✨" color="from-emerald-500 to-teal-500" />
                  <Stat label={l.accuracy} value={`${accuracy}%`} icon="🎯" color="from-blue-500 to-indigo-500" />
                  <Stat label={l.qpm} value={qpm} icon="⚡" color="from-orange-500 to-red-500" />
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mb-4">{l.rewards}</p>

                {user && (
                  <button
                    onClick={submitToBoard}
                    disabled={submitState !== "idle"}
                    className={`w-full py-3 rounded-xl text-white font-bold mb-3 ${submitState === "submitted" ? "bg-emerald-500" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg"}`}
                  >
                    {submitState === "submitted" ? `✅ ${l.submitted}` : `🚀 ${l.submit}`}
                  </button>
                )}
              </>
            )}

            <button onClick={start} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-md">
              ⚡ {l.playAgain}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, icon, color }) {
  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${color} text-white shadow-md`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-[10px] font-bold uppercase opacity-80 tracking-wider">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
    </div>
  );
}
