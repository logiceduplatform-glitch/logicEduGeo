import React, { useState, useContext, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ProgressService } from "../services/ProgressService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const STORAGE_KEY = "geo:myClassrooms";

function getSavedClassrooms() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveClassrooms(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const T = {
  el: {
    title: "Η Τάξη μου",
    subtitle: "Δες τα quiz και τις ανακοινώσεις από τον δάσκαλό σου",
    enterCode: "Εισάγετε τον κωδικό τάξης",
    placeholder: "π.χ. ABC123",
    enroll: "Εγγραφή",
    enrolling: "Εγγραφή...",
    enterName: "Το όνομά σου",
    teacher: "Δάσκαλος",
    announcements: "Ανακοινώσεις",
    noAnnouncements: "Δεν υπάρχουν ανακοινώσεις",
    quizzes: "Quiz τάξης",
    noQuizzes: "Δεν υπάρχουν quiz ακόμα",
    start: "Ξεκίνα",
    notFound: "Δεν βρέθηκε τάξη με αυτόν τον κωδικό",
    alreadyEnrolled: "Είσαι ήδη εγγεγραμμένος!",
    enrollSuccess: "Εγγραφή επιτυχής!",
    score: "Σκορ",
    playAgain: "Ξανά",
    back: "Πίσω",
    leaveClassroom: "Αποχώρηση",
    confirmLeave: "Σίγουρα θέλεις να αποχωρήσεις από αυτή την τάξη;",
    resultsSaved: "Το αποτέλεσμά σου αποθηκεύτηκε!",
    timesPlayed: "φορές παιχτ.",
    switchClassroom: "Άλλαξε τάξη",
    addClassroom: "Προσθήκη τάξης",
    deadlineLabel: "Προθεσμία",
    deadlineExpired: "Έχει λήξει το quiz.",
    expired: "Έληξε",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    submitAnswer: "Υποβολή",
    fillInPlaceholder: "Η απάντησή σου",
    correctAnswer: "Σωστή απάντηση",
  },
  en: {
    title: "My Classroom",
    subtitle: "See quizzes and announcements from your teacher",
    enterCode: "Enter classroom code",
    placeholder: "e.g. ABC123",
    enroll: "Enroll",
    enrolling: "Enrolling...",
    enterName: "Your name",
    teacher: "Teacher",
    announcements: "Announcements",
    noAnnouncements: "No announcements",
    quizzes: "Classroom quizzes",
    noQuizzes: "No quizzes yet",
    start: "Start",
    notFound: "No classroom found with this code",
    alreadyEnrolled: "You're already enrolled!",
    enrollSuccess: "Enrolled successfully!",
    score: "Score",
    playAgain: "Again",
    back: "Back",
    leaveClassroom: "Leave",
    confirmLeave: "Are you sure you want to leave this classroom?",
    resultsSaved: "Your result has been saved!",
    timesPlayed: "times played",
    switchClassroom: "Switch classroom",
    addClassroom: "Add classroom",
    deadlineLabel: "Deadline",
    deadlineExpired: "This quiz is no longer available.",
    expired: "Expired",
    trueLabel: "True",
    falseLabel: "False",
    submitAnswer: "Submit",
    fillInPlaceholder: "Your answer",
    correctAnswer: "Correct answer",
  },
};

function classroomGetQType(q) {
  if (q?.type === "true_false" || q?.type === "fill_in" || q?.type === "multiple_choice") return q.type;
  return "multiple_choice";
}

function classroomIsCorrect(q, selected) {
  const t = classroomGetQType(q);
  if (t === "fill_in") {
    return (selected || "").trim().toLowerCase() === String(q.correct || "").trim().toLowerCase();
  }
  return selected === q.correct;
}

function classroomDeadlinePast(deadline) {
  if (!deadline) return false;
  const d = String(deadline).length === 10 ? new Date(String(deadline) + "T23:59:59.999") : new Date(deadline);
  return d < new Date();
}

export default function MyClassroomPage() {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [savedClassrooms, setSavedClassrooms] = useState(() => getSavedClassrooms());
  const [activeCode, setActiveCode] = useState(urlCode || savedClassrooms[0]?.code || "");
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [enrollCode, setEnrollCode] = useState("");
  const [studentName, setStudentName] = useState(() => localStorage.getItem("geo:studentName") || "");
  const [enrolling, setEnrolling] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Quiz playing state
  const [playingQuiz, setPlayingQuiz] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [qScore, setQScore] = useState(0);
  const [qFeedback, setQFeedback] = useState(null);
  const [qFinished, setQFinished] = useState(false);
  const [qAnswers, setQAnswers] = useState([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [fillText, setFillText] = useState("");
  const [lastSeenTs, setLastSeenTs] = useState("");

  const loadClassroom = useCallback(async (code) => {
    if (!db || !code) return;
    setLoading(true);
    setError(null);
    const upper = code.trim().toUpperCase();
    try {
      const snap = await getDoc(doc(db, "classrooms", upper));
      if (!snap.exists()) {
        setError(l.notFound);
        setClassroom(null);
        return;
      }
      const data = snap.data();
      setClassroom({ id: snap.id, ...data });
      setActiveCode(upper);

      // Load quizzes assigned to this classroom
      const qQ = query(collection(db, "classroomQuizzes"), where("classroomCode", "==", upper));
      const qSnap = await getDocs(qQ);
      const loadedQ = [];
      qSnap.forEach((d) => loadedQ.push({ id: d.id, ...d.data() }));
      loadedQ.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setQuizzes(loadedQ);

      const lastSeenKey = `geo:classroomLastSeen:${upper}`;
      const prevLastSeen = localStorage.getItem(lastSeenKey) || "1970-01-01";
      setLastSeenTs(prevLastSeen);
      const newCount = loadedQ.filter((q) => q.createdAt > prevLastSeen).length;
      if (newCount > 0) setNotice(`🆕 ${newCount} ${isEl ? "νέα quiz!" : "new quizzes!"}`);
      localStorage.setItem(lastSeenKey, new Date().toISOString());

      // Load announcements
      try {
        const annQ = query(
          collection(db, "classroomAnnouncements"),
          where("classroomCodes", "array-contains", upper),
          orderBy("createdAt", "desc")
        );
        const annSnap = await getDocs(annQ);
        const loadedAnn = [];
        annSnap.forEach((d) => loadedAnn.push({ id: d.id, ...d.data() }));
        setAnnouncements(loadedAnn);
      } catch {
        setAnnouncements([]);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[MyClassroom]", e);
      setError(l.notFound);
    } finally {
      setLoading(false);
    }
  }, [l.notFound]);

  useEffect(() => {
    if (urlCode) {
      loadClassroom(urlCode);
    } else if (savedClassrooms.length > 0) {
      loadClassroom(savedClassrooms[0].code);
    }
  }, [urlCode]);

  const handleEnroll = async () => {
    const code = (enrollCode || urlCode || "").trim().toUpperCase();
    if (!code) return;
    setEnrolling(true);
    setError(null);
    try {
      const snap = await getDoc(doc(db, "classrooms", code));
      if (!snap.exists()) {
        setError(l.notFound);
        setEnrolling(false);
        return;
      }
      const clsData = snap.data();

      // Check if already enrolled
      const existing = savedClassrooms.find((c) => c.code === code);
      if (existing) {
        setNotice(l.alreadyEnrolled);
        setTimeout(() => setNotice(null), 3000);
        setActiveCode(code);
        loadClassroom(code);
        setEnrolling(false);
        return;
      }

      const name = studentName.trim() || user?.displayName || "";
      if (name) localStorage.setItem("geo:studentName", name);

      // Save membership in Firestore
      await addDoc(collection(db, "classroomMembers"), {
        classroomCode: code,
        studentUid: user?.uid || "guest_" + Date.now(),
        studentName: name,
        joinedAt: new Date().toISOString(),
      });

      // Save locally
      const newEntry = { code, name: clsData.name, teacherName: clsData.teacherName || "" };
      const updated = [newEntry, ...savedClassrooms.filter((c) => c.code !== code)];
      setSavedClassrooms(updated);
      saveClassrooms(updated);
      setActiveCode(code);
      loadClassroom(code);
      setEnrollCode("");
      setNotice(l.enrollSuccess);
      setTimeout(() => setNotice(null), 3000);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[MyClassroom] Enroll failed:", e);
      setError(l.notFound);
    } finally {
      setEnrolling(false);
    }
  };

  const handleLeave = (code) => {
    if (!confirm(l.confirmLeave)) return;
    const updated = savedClassrooms.filter((c) => c.code !== code);
    setSavedClassrooms(updated);
    saveClassrooms(updated);
    if (activeCode === code) {
      if (updated.length > 0) {
        setActiveCode(updated[0].code);
        loadClassroom(updated[0].code);
      } else {
        setClassroom(null);
        setQuizzes([]);
        setAnnouncements([]);
        setActiveCode("");
      }
    }
  };

  const startQuiz = async (quiz) => {
    if (classroomDeadlinePast(quiz.deadline)) {
      setNotice(l.deadlineExpired);
      setTimeout(() => setNotice(null), 4000);
      return;
    }
    setPlayingQuiz(quiz);
    setQIdx(0);
    setQScore(0);
    setQFinished(false);
    setQFeedback(null);
    setQAnswers([]);
    setResultSaved(false);
    setFillText("");
    if (db && quiz.code) {
      try { await updateDoc(doc(db, "classroomQuizzes", quiz.code), { timesPlayed: increment(1) }); } catch {}
    }
  };

  const submitResult = async (finalScore, finalAnswers, quiz) => {
    if (!db || !quiz?.code) return;
    try {
      await addDoc(collection(db, "classroomResults"), {
        classroomCode: quiz.code,
        quizTitle: quiz.quizTitle || "",
        teacherUid: quiz.teacherUid || "",
        studentUid: user?.uid || "guest",
        studentName: studentName.trim() || user?.displayName || "",
        score: finalScore,
        total: quiz.questions.length,
        answers: finalAnswers,
        completedAt: new Date().toISOString(),
      });
      setResultSaved(true);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[MyClassroom] Submit failed:", e);
    }
  };

  useEffect(() => {
    setFillText("");
  }, [qIdx, playingQuiz?.code]);

  const handleAnswer = (opt) => {
    if (qFeedback) return;
    const q = playingQuiz.questions[qIdx];
    const isCorrect = classroomIsCorrect(q, opt);
    setQFeedback({ correct: isCorrect, selected: opt });
    const newScore = isCorrect ? qScore + 1 : qScore;
    setQScore(newScore);
    const rec = { question: q.question, selected: opt, correct: q.correct, isCorrect };
    const updAnswers = [...qAnswers, rec];
    setQAnswers(updAnswers);
    setTimeout(() => {
      setQFeedback(null);
      if (qIdx + 1 >= playingQuiz.questions.length) {
        setQFinished(true);
        submitResult(newScore, updAnswers, playingQuiz);
        try { ProgressService.recordGameComplete(`classroom_${playingQuiz.code}`, newScore, playingQuiz.questions.length); } catch {}
      } else {
        setQIdx(qIdx + 1);
      }
    }, 1500);
  };

  const isEnrolled = savedClassrooms.length > 0;
  const showEnrollForm = !isEnrolled && !urlCode;

  // ─── Quiz playing view ───
  if (playingQuiz) {
    if (qFinished) {
      const pct = Math.round((qScore / playingQuiz.questions.length) * 100);
      return (
        <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <Navbar />
          <div className="pt-20 pb-12 px-4">
            <div className="mx-auto max-w-xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center">
              <div className="text-7xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}</div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.score}: {qScore}/{playingQuiz.questions.length}</h2>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">{pct}%</p>
              {resultSaved && (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {l.resultsSaved}
                </div>
              )}
              <div className="flex gap-3 justify-center mt-2">
                <button onClick={() => startQuiz(playingQuiz)} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">{l.playAgain}</button>
                <button onClick={() => setPlayingQuiz(null)} className="px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold">{l.back}</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = playingQuiz.questions[qIdx];
    if (!currentQ) return null;
    const qt = classroomGetQType(currentQ);
    const optionsForDisplay =
      qt === "fill_in"
        ? []
        : qt === "true_false"
          ? (currentQ.options || []).filter(Boolean).length >= 2
            ? (currentQ.options || []).slice(0, 2)
            : [l.trueLabel, l.falseLabel]
          : (currentQ.options || []).filter(Boolean);

    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setPlayingQuiz(null)} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                {l.back}
              </button>
              <span className="text-xs font-semibold text-slate-400 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">{qIdx + 1} / {playingQuiz.questions.length}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              {currentQ.imageUrl && String(currentQ.imageUrl).trim() && (
                <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">
                  <img src={currentQ.imageUrl} alt="" className="w-full max-h-56 object-contain" />
                </div>
              )}
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">{currentQ.question}</p>
              {qt === "fill_in" ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={fillText}
                    onChange={(e) => setFillText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !qFeedback && fillText.trim() && handleAnswer(fillText)}
                    disabled={!!qFeedback}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none"
                    placeholder={l.fillInPlaceholder}
                  />
                  {qFeedback && !qFeedback.correct && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 break-words">✅ {l.correctAnswer}: {currentQ.correct}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAnswer(fillText)}
                    disabled={!!qFeedback || !fillText.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold disabled:opacity-40"
                  >
                    {l.submitAnswer}
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {optionsForDisplay.map((opt, oi) => {
                    let cls = "px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ";
                    if (qFeedback) {
                      if (opt === currentQ.correct) cls += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-800 dark:text-emerald-200";
                      else if (opt === qFeedback.selected) cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200";
                      else cls += "bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 opacity-50 text-slate-400";
                    } else {
                      cls += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 cursor-pointer text-slate-700 dark:text-slate-200";
                    }
                    return (
                      <button key={oi} type="button" onClick={() => handleAnswer(opt)} disabled={!!qFeedback} className={cls}>
                        <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
              {qFeedback && currentQ.explanation && (
                <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">💡 {currentQ.explanation}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main view ───
  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
            <div className="relative">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span>🏫</span> {l.title}
              </h1>
              <p className="text-blue-200 text-sm mt-1">{l.subtitle}</p>
            </div>
          </div>

          {notice && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              {notice}
            </div>
          )}

          {/* Classroom switcher (if enrolled in multiple) */}
          {savedClassrooms.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {savedClassrooms.map((sc) => (
                <button
                  key={sc.code}
                  onClick={() => { setActiveCode(sc.code); loadClassroom(sc.code); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    activeCode === sc.code
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-300"
                  }`}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          )}

          {/* Enroll form (for students not yet enrolled, or to add another classroom) */}
          {(showEnrollForm || (!classroom && !loading)) && !urlCode && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-6">
              <div className="p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 text-center">{l.enterCode}</h2>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={l.enterName}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-sm text-center text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                />
                <input
                  type="text"
                  value={enrollCode}
                  onChange={(e) => setEnrollCode(e.target.value.toUpperCase())}
                  placeholder={l.placeholder}
                  maxLength={6}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-2xl text-center font-mono font-bold tracking-[0.3em] text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 uppercase"
                  onKeyDown={(e) => e.key === "Enter" && enrollCode.trim().length >= 4 && handleEnroll()}
                />
                <button
                  onClick={handleEnroll}
                  disabled={enrollCode.trim().length < 4 || enrolling}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  {enrolling ? l.enrolling : l.enroll}
                </button>
                {error && <p className="text-sm text-red-500 font-semibold text-center">{error}</p>}
              </div>
            </div>
          )}

          {/* URL-based enrollment (arrived via link) */}
          {urlCode && !classroom && !loading && !error && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-6 p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 text-center">{l.enterCode}</h2>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={l.enterName}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-sm text-center text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
              />
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg disabled:opacity-40 hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                {enrolling ? l.enrolling : l.enroll}
              </button>
            </div>
          )}
          {error && urlCode && (
            <div className="text-center mb-6">
              <p className="text-sm text-red-500 font-semibold">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Classroom dashboard */}
          {classroom && !loading && (
            <div className="space-y-5">
              {/* Classroom info */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl shrink-0">🏫</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{classroom.name}</h2>
                  <p className="text-sm text-slate-400 dark:text-slate-500">{l.teacher}: {classroom.teacherName || "—"}</p>
                </div>
                {!savedClassrooms.find((c) => c.code === classroom.code) && (
                  <button
                    onClick={() => { setEnrollCode(classroom.code); handleEnroll(); }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm"
                  >
                    {l.enroll}
                  </button>
                )}
              </div>

              {/* Announcements */}
              {announcements.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 overflow-hidden">
                  <div className="px-5 py-3 bg-amber-100 dark:bg-amber-900/40 flex items-center gap-2">
                    <span>📢</span>
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">{l.announcements}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-100 dark:border-amber-800/50">
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{ann.text}</p>
                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 block">
                          {ann.teacherName && `${ann.teacherName} · `}
                          {new Date(ann.createdAt).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📝</span> {l.quizzes}
                </h3>
                {quizzes.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 border border-slate-100 dark:border-slate-700 text-center">
                    <span className="text-4xl block mb-3">📝</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">{l.noQuizzes}</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {quizzes.map((quiz) => {
                      const exp = classroomDeadlinePast(quiz.deadline);
                      return (
                        <div key={quiz.code} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{quiz.quizTitle}</h4>
                              {quiz.createdAt > lastSeenTs && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500 text-white animate-pulse">NEW</span>
                              )}
                              {quiz.deadline && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                    exp
                                      ? "text-red-600 border-red-200 dark:border-red-800"
                                      : "text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
                                  }`}
                                >
                                  {l.deadlineLabel}{" "}
                                  {new Date(String(quiz.deadline) + "T12:00:00").toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short" })}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                              {quiz.subject && <span>{quiz.subject}</span>}
                              <span>{quiz.questions?.length || 0} {isEl ? "ερωτήσεις" : "questions"}</span>
                              <span>{quiz.timesPlayed || 0} {l.timesPlayed}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => startQuiz(quiz)}
                            disabled={exp}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {exp ? l.expired : `${l.start} →`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add another classroom + leave */}
              <div className="flex gap-3 justify-center pt-4">
                {savedClassrooms.find((c) => c.code === classroom.code) && (
                  <button
                    onClick={() => handleLeave(classroom.code)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {l.leaveClassroom}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
