import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const T = {
  el: {
    title: "Live Quiz",
    subtitle: "Παίξτε quiz σε πραγματικό χρόνο!",
    createSession: "Δημιουργία Session",
    joinSession: "Συμμετοχή",
    enterCode: "Κωδικός session",
    join: "Μπες!",
    selectQuiz: "Επίλεξε quiz",
    noQuizzes: "Δεν έχεις quiz. Δημιούργησε ένα στο Dashboard.",
    waitingForPlayers: "Αναμονή παικτών...",
    players: "Παίκτες",
    startGame: "Ξεκίνα!",
    question: "Ερώτηση",
    of: "από",
    timeLeft: "Χρόνος",
    nextQuestion: "Επόμενη",
    leaderboard: "Κατάταξη",
    score: "Σκορ",
    endSession: "Τέλος",
    waitingForHost: "Αναμονή για τον δάσκαλο...",
    yourName: "Το όνομά σου",
    correct: "Σωστό!",
    wrong: "Λάθος!",
    answered: "Απάντησες",
    waiting: "Αναμονή...",
    sessionEnded: "Το session τελείωσε!",
    finalResults: "Τελικά Αποτελέσματα",
    backHome: "Αρχική",
    copied: "Αντιγράφηκε!",
    shareCode: "Μοιράσου τον κωδικό",
    or: "ή",
  },
  en: {
    title: "Live Quiz",
    subtitle: "Play quiz in real-time!",
    createSession: "Create Session",
    joinSession: "Join Session",
    enterCode: "Session code",
    join: "Join!",
    selectQuiz: "Select quiz",
    noQuizzes: "No quizzes found. Create one in Dashboard.",
    waitingForPlayers: "Waiting for players...",
    players: "Players",
    startGame: "Start!",
    question: "Question",
    of: "of",
    timeLeft: "Time",
    nextQuestion: "Next",
    leaderboard: "Leaderboard",
    score: "Score",
    endSession: "End",
    waitingForHost: "Waiting for the teacher...",
    yourName: "Your name",
    correct: "Correct!",
    wrong: "Wrong!",
    answered: "Answered",
    waiting: "Waiting...",
    sessionEnded: "Session ended!",
    finalResults: "Final Results",
    backHome: "Home",
    copied: "Copied!",
    shareCode: "Share the code",
    or: "or",
  },
};

function getLocalQuizzes() {
  try { return JSON.parse(localStorage.getItem("geo:teacherQuizzes")) || []; } catch { return []; }
}

export default function LiveQuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useContext(LanguageContext);
  const { user, userProfile } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [mode, setMode] = useState(null); // "host" | "player"
  const [joinCode, setJoinCode] = useState(searchParams.get("code") || "");
  const [playerName, setPlayerName] = useState(userProfile?.displayName || user?.displayName || "");
  const [sessionCode, setSessionCode] = useState(null);
  const [session, setSession] = useState(null);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [timer, setTimer] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);

  const quizzes = getLocalQuizzes();

  useEffect(() => {
    if (!sessionCode) return;
    const unsub = onSnapshot(doc(db, "liveQuizSessions", sessionCode), (snap) => {
      if (snap.exists()) setSession(snap.data());
      else setSession(null);
    });
    return () => unsub();
  }, [sessionCode]);

  useEffect(() => {
    if (!session || session.status !== "playing") return;
    if (mode === "host") {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session?.status, session?.currentQuestion, mode]);

  const handleCreateSession = async () => {
    if (quizzes.length === 0) return;
    const code = generateSessionCode();
    const quiz = quizzes[selectedQuizIdx];
    await setDoc(doc(db, "liveQuizSessions", code), {
      code,
      hostUid: user.uid,
      hostName: user.displayName || "Teacher",
      quizTitle: quiz.title,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
      })),
      players: {},
      status: "lobby",
      currentQuestion: 0,
      createdAt: new Date().toISOString(),
    });
    setSessionCode(code);
    setMode("host");
  };

  const handleJoinSession = async () => {
    if (!joinCode.trim()) return;
    const code = joinCode.trim().toUpperCase();
    const snap = await getDoc(doc(db, "liveQuizSessions", code));
    if (!snap.exists()) {
      alert(isEl ? "Δεν βρέθηκε session με αυτόν τον κωδικό" : "Session not found");
      return;
    }
    const sessionData = snap.data();
    const playerId = user?.uid || `guest_${Math.random().toString(36).substring(2, 8)}`;
    const name = playerName.trim() || (isEl ? "Παίκτης" : "Player");
    await updateDoc(doc(db, "liveQuizSessions", code), {
      [`players.${playerId}`]: { name, score: 0, answers: {} },
    });
    setSessionCode(code);
    setMode("player");
  };

  const handleStartGame = async () => {
    if (!sessionCode) return;
    setTimer(15);
    setCurrentQ(0);
    await updateDoc(doc(db, "liveQuizSessions", sessionCode), {
      status: "playing",
      currentQuestion: 0,
    });
  };

  const handleNextQuestion = async () => {
    if (!session) return;
    const nextQ = session.currentQuestion + 1;
    if (nextQ >= session.questions.length) {
      await updateDoc(doc(db, "liveQuizSessions", sessionCode), { status: "finished" });
    } else {
      setTimer(15);
      setSelectedAnswer(null);
      setFeedback(null);
      await updateDoc(doc(db, "liveQuizSessions", sessionCode), {
        currentQuestion: nextQ,
      });
    }
  };

  const handleAnswer = async (answerIdx) => {
    if (feedback !== null || !session) return;
    const q = session.questions[session.currentQuestion];
    const isCorrect = answerIdx === q.correct;
    setSelectedAnswer(answerIdx);
    setFeedback(isCorrect);

    const playerId = user?.uid || Object.keys(session.players).find(k => k.startsWith("guest_")) || "unknown";
    const pointsEarned = isCorrect ? Math.max(5, 10 + timer) : 0;
    const playerData = session.players[playerId] || { name: playerName, score: 0, answers: {} };

    await updateDoc(doc(db, "liveQuizSessions", sessionCode), {
      [`players.${playerId}.score`]: playerData.score + pointsEarned,
      [`players.${playerId}.answers.q${session.currentQuestion}`]: { answer: answerIdx, correct: isCorrect, points: pointsEarned },
    });
  };

  const handleEndSession = async () => {
    if (sessionCode) {
      await updateDoc(doc(db, "liveQuizSessions", sessionCode), { status: "finished" });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync currentQuestion from session
  useEffect(() => {
    if (session && mode === "player") {
      setCurrentQ(session.currentQuestion);
      if (session.status === "playing") {
        const playerId = user?.uid || Object.keys(session.players).find(k => k.startsWith("guest_"));
        const hasAnswered = playerId && session.players[playerId]?.answers?.[`q${session.currentQuestion}`];
        if (!hasAnswered) {
          setSelectedAnswer(null);
          setFeedback(null);
        }
      }
    }
    if (session && mode === "host") {
      setCurrentQ(session.currentQuestion);
    }
  }, [session?.currentQuestion, session?.status]);

  // --- LOBBY VIEW (choose host/player) ---
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="text-6xl mb-2">🎮</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>

            {user && (
              <button onClick={() => setMode("host_setup")} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                📡 {l.createSession}
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-sm text-slate-400">{l.or}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-200">{l.joinSession}</h3>
              <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder={l.yourName} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400" />
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder={l.enterCode} maxLength={6} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400 text-center text-2xl font-mono tracking-widest uppercase" />
              <button onClick={handleJoinSession} disabled={!joinCode.trim()} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                {l.join}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- HOST SETUP (select quiz) ---
  if (mode === "host_setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full space-y-6">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">{l.selectQuiz}</h2>
            {quizzes.length === 0 ? (
              <div className="text-center text-slate-400 py-8">{l.noQuizzes}</div>
            ) : (
              <div className="space-y-3">
                {quizzes.map((q, i) => (
                  <button key={i} onClick={() => setSelectedQuizIdx(i)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedQuizIdx === i ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-slate-600 hover:border-purple-300"}`}>
                    <div className="font-bold text-slate-800 dark:text-white">{q.title}</div>
                    <div className="text-xs text-slate-400">{q.questions?.length || 0} {isEl ? "ερωτήσεις" : "questions"}</div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={handleCreateSession} disabled={quizzes.length === 0} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50">
              {l.createSession}
            </button>
            <button onClick={() => setMode(null)} className="w-full text-sm text-slate-400 hover:text-slate-600">{isEl ? "← Πίσω" : "← Back"}</button>
          </div>
        </div>
      </div>
    );
  }

  // --- GAME SESSION ---
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const playerList = Object.entries(session.players || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => b.score - a.score);
  const totalQuestions = session.questions?.length || 0;

  // --- FINISHED ---
  if (session.status === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl">🏆</div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.finalResults}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-3">
              {playerList.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700" : ""}`}>
                  <span className="text-xl font-bold text-slate-400 w-6">{i + 1}</span>
                  <span className="text-xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "👤"}</span>
                  <span className="flex-1 font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{p.score} pts</span>
                </div>
              ))}
              {playerList.length === 0 && <p className="text-slate-400">{isEl ? "Κανένας παίκτης" : "No players"}</p>}
            </div>
            <button onClick={() => navigate("/")} className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
              {l.backHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOBBY (waiting) ---
  if (session.status === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-5xl animate-pulse">📡</div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {mode === "host" ? l.waitingForPlayers : l.waitingForHost}
            </h2>

            {mode === "host" && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">{l.shareCode}</p>
                  <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 tracking-[0.3em] mb-3">{sessionCode}</div>
                  <button onClick={handleCopyCode} className="px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold">
                    {copied ? `✅ ${l.copied}` : `📋 ${isEl ? "Αντιγραφή" : "Copy"}`}
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow border border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-slate-500 mb-2">{l.players} ({playerList.length})</h3>
                  <div className="space-y-2">
                    {playerList.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                        <span>👤</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                      </div>
                    ))}
                    {playerList.length === 0 && <p className="text-sm text-slate-400 italic">{isEl ? "Αναμονή..." : "Waiting..."}</p>}
                  </div>
                </div>

                <button onClick={handleStartGame} disabled={playerList.length === 0} className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50">
                  🚀 {l.startGame}
                </button>
              </>
            )}

            {mode === "player" && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500">{session.quizTitle}</p>
                <p className="text-sm text-slate-400 mt-2">{l.players}: {playerList.length}</p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING ---
  const q = session.questions[session.currentQuestion];
  const playerId = user?.uid || Object.keys(session.players).find(k => k.startsWith("guest_"));
  const myAnswered = playerId && session.players[playerId]?.answers?.[`q${session.currentQuestion}`];
  const progress = ((session.currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Progress + Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {l.question} {session.currentQuestion + 1} {l.of} {totalQuestions}
            </span>
            {mode === "host" && (
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${timer <= 5 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                ⏱️ {timer}s
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* Question */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 dark:border-slate-700 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-snug">{q.question}</h2>

            {mode === "player" && !myAnswered ? (
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-purple-400 font-medium text-slate-700 dark:text-slate-200 transition-all">
                    <span className="text-slate-400 mr-3 font-bold">{String.fromCharCode(65 + i)}</span>{opt}
                  </button>
                ))}
              </div>
            ) : mode === "player" && myAnswered ? (
              <div className="text-center py-4">
                <span className={`text-lg font-bold ${myAnswered.correct ? "text-emerald-600" : "text-red-500"}`}>
                  {myAnswered.correct ? `✅ ${l.correct}` : `❌ ${l.wrong}`}
                </span>
                <p className="text-sm text-slate-400 mt-2">+{myAnswered.points} pts</p>
              </div>
            ) : (
              /* Host view: show options with correct highlighted */
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const answeredCount = playerList.filter(p => p.answers?.[`q${session.currentQuestion}`]?.answer === i).length;
                  return (
                    <div key={i} className={`px-5 py-4 rounded-xl border-2 font-medium flex items-center justify-between ${i === q.correct ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-200 dark:border-slate-600"}`}>
                      <span className="text-slate-700 dark:text-slate-200">
                        <span className="text-slate-400 mr-3 font-bold">{String.fromCharCode(65 + i)}</span>{opt}
                      </span>
                      {answeredCount > 0 && <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{answeredCount} 👤</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Host controls */}
          {mode === "host" && (
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={handleNextQuestion} className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg transition-all">
                {session.currentQuestion >= totalQuestions - 1 ? (isEl ? "Αποτελέσματα" : "Results") : `${l.nextQuestion} →`}
              </button>
              <button onClick={handleEndSession} className="px-6 py-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold">
                {l.endSession}
              </button>
            </div>
          )}

          {/* Live leaderboard sidebar */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">🏅 {l.leaderboard}</h3>
            <div className="space-y-1.5">
              {playerList.slice(0, 10).map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span className="w-5 text-right font-bold text-slate-400">{i + 1}</span>
                  <span className="flex-1 font-medium text-slate-700 dark:text-slate-200 truncate">{p.name}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
