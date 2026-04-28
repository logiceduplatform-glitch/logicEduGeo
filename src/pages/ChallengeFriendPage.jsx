import React, { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const CHALLENGE_QUESTIONS = [
  { q: { el: "5 × 8 = ?", en: "5 × 8 = ?" }, opts: ["35", "40", "45", "50"], correct: 1 },
  { q: { el: "Ποια πρωτεύουσα ανήκει στην Αυστραλία;", en: "What is the capital of Australia?" }, opts: [{ el: "Σίδνεϊ", en: "Sydney" }, { el: "Καμπέρα", en: "Canberra" }, { el: "Μελβούρνη", en: "Melbourne" }, { el: "Μπρίσμπεϊν", en: "Brisbane" }], correct: 1 },
  { q: { el: "√81 = ?", en: "√81 = ?" }, opts: ["7", "8", "9", "10"], correct: 2 },
  { q: { el: "Πόσα χρώματα έχει η σημαία της Ελλάδας;", en: "How many colors does the Greek flag have?" }, opts: ["1", "2", "3", "4"], correct: 1 },
  { q: { el: "15 + 27 = ?", en: "15 + 27 = ?" }, opts: ["32", "42", "40", "52"], correct: 1 },
  { q: { el: "Ποιο πλανήτης είναι πιο κοντά στον Ήλιο;", en: "Which planet is closest to the Sun?" }, opts: [{ el: "Αφροδίτη", en: "Venus" }, { el: "Ερμής", en: "Mercury" }, { el: "Γη", en: "Earth" }, { el: "Άρης", en: "Mars" }], correct: 1 },
  { q: { el: "3² + 4² = ?", en: "3² + 4² = ?" }, opts: ["15", "20", "25", "30"], correct: 2 },
  { q: { el: "Ποιο ζώο είναι σύμβολο σοφίας;", en: "Which animal symbolizes wisdom?" }, opts: [{ el: "Αετός", en: "Eagle" }, { el: "Κουκουβάγια", en: "Owl" }, { el: "Λιοντάρι", en: "Lion" }, { el: "Δελφίνι", en: "Dolphin" }], correct: 1 },
  { q: { el: "100 ÷ 4 = ?", en: "100 ÷ 4 = ?" }, opts: ["20", "25", "30", "35"], correct: 1 },
  { q: { el: "Σε ποια ήπειρο βρίσκεται η Βραζιλία;", en: "On which continent is Brazil?" }, opts: [{ el: "Βόρεια Αμερική", en: "North America" }, { el: "Νότια Αμερική", en: "South America" }, { el: "Ευρώπη", en: "Europe" }, { el: "Αφρική", en: "Africa" }], correct: 1 },
];

function pickQuestions(seed, count = 5) {
  const indices = [];
  const pool = [...Array(CHALLENGE_QUESTIONS.length).keys()];
  let s = seed;
  for (let i = 0; i < count && pool.length > 0; i++) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s / 233280) * pool.length);
    indices.push(pool.splice(idx, 1)[0]);
  }
  return indices.map(i => CHALLENGE_QUESTIONS[i]);
}

const T = {
  el: {
    title: "Προκάλεσε Φίλο",
    subtitle: "Στείλε πρόκληση στους φίλους σου!",
    createChallenge: "Δημιουργία Πρόκλησης",
    enterCode: "Κωδικός πρόκλησης",
    join: "Αποδοχή",
    yourName: "Το όνομά σου",
    shareLink: "Μοιράσου",
    copied: "Αντιγράφηκε!",
    waiting: "Αναμονή αποτελέσματος...",
    challengeBy: "Πρόκληση από",
    yourScore: "Το σκορ σου",
    theirScore: "Σκορ αντιπάλου",
    youWin: "Κέρδισες!",
    youLose: "Ο αντίπαλος κέρδισε!",
    tie: "Ισοπαλία!",
    playAgain: "Νέα πρόκληση",
    question: "Ερώτηση",
    of: "από",
    correct: "Σωστό!",
    wrong: "Λάθος!",
    or: "ή",
    back: "Αρχική",
  },
  en: {
    title: "Challenge a Friend",
    subtitle: "Send a challenge to your friends!",
    createChallenge: "Create Challenge",
    enterCode: "Challenge code",
    join: "Accept",
    yourName: "Your name",
    shareLink: "Share",
    copied: "Copied!",
    waiting: "Waiting for result...",
    challengeBy: "Challenge by",
    yourScore: "Your score",
    theirScore: "Opponent's score",
    youWin: "You win!",
    youLose: "Opponent wins!",
    tie: "It's a tie!",
    playAgain: "New challenge",
    question: "Question",
    of: "of",
    correct: "Correct!",
    wrong: "Wrong!",
    or: "or",
    back: "Home",
  },
};

export default function ChallengeFriendPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useContext(LanguageContext);
  const { user, userProfile } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [mode, setMode] = useState(null); // null | "create" | "play" | "result"
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [playerName, setPlayerName] = useState(userProfile?.displayName || user?.displayName || "");
  const [challengeData, setChallengeData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (searchParams.get("code")) {
      handleJoin(searchParams.get("code"));
    }
  }, []);

  const getOptLabel = (opt) => typeof opt === "string" ? opt : (isEl ? opt.el : opt.en);

  const handleCreate = async () => {
    const challengeCode = generateCode();
    const seed = Date.now();
    const qs = pickQuestions(seed);
    const data = {
      code: challengeCode,
      creatorName: playerName || (isEl ? "Παίκτης" : "Player"),
      creatorUid: user?.uid || "guest",
      creatorScore: null,
      challengerName: null,
      challengerScore: null,
      seed,
      questionCount: qs.length,
      createdAt: new Date().toISOString(),
      status: "created",
    };
    await setDoc(doc(db, "friendChallenges", challengeCode), data);
    setChallengeData(data);
    setQuestions(qs);
    setCode(challengeCode);
    setMode("play");
    setQIdx(0);
    setScore(0);
  };

  const handleJoin = async (joinCode) => {
    const c = (joinCode || code).trim().toUpperCase();
    if (!c) return;
    const snap = await getDoc(doc(db, "friendChallenges", c));
    if (!snap.exists()) {
      alert(isEl ? "Δεν βρέθηκε πρόκληση" : "Challenge not found");
      return;
    }
    const data = snap.data();
    setChallengeData(data);
    setQuestions(pickQuestions(data.seed, data.questionCount));
    setCode(c);

    if (data.creatorScore !== null && data.challengerScore !== null) {
      setResult(data);
      setMode("result");
    } else {
      setMode("play");
      setQIdx(0);
      setScore(0);
    }
  };

  const handleSelect = (idx) => {
    if (feedback !== null) return;
    setSelected(idx);
    const isCorrect = idx === questions[qIdx].correct;
    setFeedback(isCorrect);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = async () => {
    if (qIdx >= questions.length - 1) {
      const finalScore = score + (feedback ? 0 : 0);
      const isCreator = challengeData.creatorUid === (user?.uid || "guest") && challengeData.creatorScore === null;

      if (isCreator) {
        await updateDoc(doc(db, "friendChallenges", code), { creatorScore: finalScore });
        const snap = await getDoc(doc(db, "friendChallenges", code));
        const data = snap.data();
        if (data.challengerScore !== null) {
          setResult(data);
          setMode("result");
        } else {
          setChallengeData(data);
          setMode("waiting");
        }
      } else {
        await updateDoc(doc(db, "friendChallenges", code), {
          challengerName: playerName || (isEl ? "Παίκτης" : "Player"),
          challengerScore: finalScore,
          status: "completed",
        });
        const snap = await getDoc(doc(db, "friendChallenges", code));
        setResult(snap.data());
        setMode("result");
      }

      ProgressService.addXP(finalScore * 2, 1);
      CoinService.earn(finalScore >= 4 ? 3 : 1);
    } else {
      setQIdx(prev => prev + 1);
      setSelected(null);
      setFeedback(null);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/challenge?code=${code}`;
    if (navigator.share) {
      navigator.share({ title: l.title, text: `${isEl ? "Σε προκαλώ!" : "I challenge you!"} 🎮`, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- HOME ---
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="text-6xl mb-2">⚔️</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>

            <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder={l.yourName} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-pink-400 text-center" />

            <button onClick={handleCreate} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
              ⚔️ {l.createChallenge}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-sm text-slate-400">{l.or}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="flex gap-2">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder={l.enterCode} maxLength={6} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-pink-400 text-center text-xl font-mono tracking-widest uppercase" />
              <button onClick={() => handleJoin()} disabled={!code.trim()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md disabled:opacity-50">
                {l.join}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- WAITING ---
  if (mode === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-5xl animate-pulse">⏳</div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{l.waiting}</h2>
            <p className="text-slate-500">{l.yourScore}: {score}/{questions.length}</p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-400 mb-2">{l.shareLink}</p>
              <div className="text-2xl font-mono font-bold text-pink-600 dark:text-pink-400 tracking-[0.3em] mb-3">{code}</div>
              <button onClick={handleShare} className="px-6 py-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-bold">
                {copied ? `✅ ${l.copied}` : `📋 ${l.shareLink}`}
              </button>
            </div>

            <button onClick={async () => {
              const snap = await getDoc(doc(db, "friendChallenges", code));
              if (snap.exists() && snap.data().challengerScore !== null) {
                setResult(snap.data());
                setMode("result");
              }
            }} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
              🔄 {isEl ? "Έλεγχος" : "Check"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT ---
  if (mode === "result" && result) {
    const myScore = result.creatorUid === (user?.uid || "guest") ? result.creatorScore : result.challengerScore;
    const theirScore = result.creatorUid === (user?.uid || "guest") ? result.challengerScore : result.creatorScore;
    const theirName = result.creatorUid === (user?.uid || "guest") ? result.challengerName : result.creatorName;
    const won = myScore > theirScore;
    const tied = myScore === theirScore;

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl">{won ? "🏆" : tied ? "🤝" : "😤"}</div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{won ? l.youWin : tied ? l.tie : l.youLose}</h2>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-black text-pink-600">{myScore ?? "?"}</div>
                  <div className="text-xs text-slate-400">{isEl ? "Εσύ" : "You"}</div>
                </div>
                <span className="text-2xl text-slate-300">vs</span>
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-600">{theirScore ?? "?"}</div>
                  <div className="text-xs text-slate-400">{theirName || (isEl ? "Αντίπαλος" : "Opponent")}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={() => { setMode(null); setCode(""); setChallengeData(null); setResult(null); setScore(0); setQIdx(0); }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-md">
                {l.playAgain}
              </button>
              <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                {l.back}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING ---
  const q = questions[qIdx];
  if (!q) return null;
  const progress = ((qIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{l.question} {qIdx + 1} {l.of} {questions.length}</span>
            <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{score}/{qIdx + (feedback !== null ? 1 : 0)}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 dark:border-slate-700 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-snug">
              {isEl ? q.q.el : q.q.en}
            </h2>

            <div className="space-y-3">
              {q.opts.map((opt, i) => {
                let cls = "border-slate-200 dark:border-slate-600 hover:border-pink-400";
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
                <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-md hover:shadow-lg transition-all">
                  {qIdx >= questions.length - 1 ? (isEl ? "Αποτέλεσμα" : "Result") : "→"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
