import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { doc, getDoc, updateDoc, increment, collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { ProgressService } from "../services/ProgressService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Είσοδος σε τάξη",
    subtitle: "Εισάγετε τον κωδικό που σας έδωσε ο δάσκαλός σας",
    placeholder: "π.χ. ABC123",
    join: "Μπες τώρα",
    loading: "Αναζήτηση...",
    notFound: "Δεν βρέθηκε quiz με αυτόν τον κωδικό",
    tryAgain: "Δοκίμασε ξανά",
    by: "Από",
    questions: "ερωτήσεις",
    startQuiz: "Ξεκίνα το Quiz",
    score: "Σκορ",
    playAgain: "Ξανά",
    back: "Πίσω",
    announcements: "Ανακοινώσεις δασκάλου",
    resultsSaved: "Το αποτέλεσμά σου αποθηκεύτηκε!",
    enterName: "Το όνομά σου (προαιρετικά)",
    deadlineExpired: "Έχει λήξει αυτό το quiz.",
    expired: "Έληξε",
    correctAnswer: "Σωστή απάντηση",
    submitAnswer: "Υποβολή",
    fillInPlaceholder: "Η απάντησή σου",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
  },
  en: {
    title: "Join Classroom",
    subtitle: "Enter the code your teacher gave you",
    placeholder: "e.g. ABC123",
    join: "Join now",
    loading: "Searching...",
    notFound: "No quiz found with this code",
    tryAgain: "Try again",
    by: "By",
    questions: "questions",
    startQuiz: "Start Quiz",
    score: "Score",
    playAgain: "Again",
    back: "Back",
    announcements: "Teacher announcements",
    resultsSaved: "Your result has been saved!",
    enterName: "Your name (optional)",
    deadlineExpired: "This quiz is no longer available.",
    expired: "Expired",
    correctAnswer: "Correct answer",
    submitAnswer: "Submit",
    fillInPlaceholder: "Your answer",
    trueLabel: "True",
    falseLabel: "False",
  },
};

function joinGetQType(q) {
  if (q?.type === "true_false" || q?.type === "fill_in" || q?.type === "multiple_choice") return q.type;
  return "multiple_choice";
}

function joinIsCorrect(q, selected) {
  const t = joinGetQType(q);
  if (t === "fill_in") {
    return (selected || "").trim().toLowerCase() === String(q.correct || "").trim().toLowerCase();
  }
  return selected === q.correct;
}

function joinDeadlinePast(deadline) {
  if (!deadline) return false;
  const d = String(deadline).length === 10 ? new Date(String(deadline) + "T23:59:59.999") : new Date(deadline);
  return d < new Date();
}

export default function JoinClassroomPage() {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;

  const [code, setCode] = useState(urlCode || "");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [studentName, setStudentName] = useState(() => localStorage.getItem("geo:studentName") || "");
  const [resultSaved, setResultSaved] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [fillText, setFillText] = useState("");
  const isEl = lang === "el";

  const fetchQuiz = async (c) => {
    if (!db || !c.trim()) return;
    setLoading(true);
    setError(null);
    setQuiz(null);
    setAnnouncements([]);
    const upperCode = c.trim().toUpperCase();
    try {
      const snap = await getDoc(doc(db, "classroomQuizzes", upperCode));
      if (snap.exists()) {
        const quizData = snap.data();
        setQuiz(quizData);
        try {
          const annQ = query(
            collection(db, "classroomAnnouncements"),
            where("classroomCodes", "array-contains", upperCode),
            orderBy("createdAt", "desc")
          );
          const annSnap = await getDocs(annQ);
          const loadedAnn = [];
          annSnap.forEach((d) => loadedAnn.push({ id: d.id, ...d.data() }));
          setAnnouncements(loadedAnn);
        } catch {}
      } else {
        setError(l.notFound);
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[JoinClassroom]", e);
      setError(l.notFound);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlCode) fetchQuiz(urlCode);
  }, [urlCode]);

  useEffect(() => {
    setFillText("");
  }, [idx, quiz?.code]);

  const handleJoin = () => fetchQuiz(code);

  const handleStartQuiz = async () => {
    if (quiz && joinDeadlinePast(quiz.deadline)) {
      setError(l.deadlineExpired);
      return;
    }
    setPlaying(true);
    setIdx(0);
    setScore(0);
    setFinished(false);
    setResultSaved(false);
    setAnswers([]);
    setFillText("");
    if (studentName.trim()) localStorage.setItem("geo:studentName", studentName.trim());
    if (db && quiz?.code) {
      try { await updateDoc(doc(db, "classroomQuizzes", quiz.code), { timesPlayed: increment(1) }); } catch {}
    }
  };

  const submitResult = async (finalScore, finalAnswers) => {
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
      if (import.meta.env.DEV) console.warn("[JoinClassroom] Failed to submit result:", e);
    }
  };

  const handleAnswer = (opt) => {
    if (feedback) return;
    const q = quiz.questions[idx];
    const isCorrect = joinIsCorrect(q, opt);
    setFeedback({ correct: isCorrect, selected: opt });
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    const answerRecord = {
      question: q.question,
      selected: opt,
      correct: q.correct,
      isCorrect,
    };
    const updatedAnswers = [...answers, answerRecord];
    setAnswers(updatedAnswers);
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= quiz.questions.length) {
        setFinished(true);
        submitResult(newScore, updatedAnswers);
        try {
          ProgressService.recordGameComplete(`classroom_${quiz.code}`, newScore, quiz.questions.length);
        } catch {}
      } else {
        setIdx(idx + 1);
      }
    }, 1500);
  };

  const q = playing && !finished && quiz?.questions?.[idx];

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-xl">
          {!playing ? (
            <>
              {/* Announcements */}
              {announcements.length > 0 && (
                <div className="mb-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 overflow-hidden">
                  <div className="px-5 py-3 bg-amber-100 dark:bg-amber-900/40 flex items-center gap-2">
                    <span>📢</span>
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">{l.announcements}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-100 dark:border-amber-800/50">
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{ann.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {ann.teacherName && `${ann.teacherName} · `}
                            {new Date(ann.createdAt).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code entry or quiz preview */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 text-white">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span>🏫</span> {l.title}
                  </h1>
                  <p className="text-blue-200 text-sm mt-1">{l.subtitle}</p>
                </div>

                <div className="p-8">
                  {!quiz && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder={l.placeholder}
                        autoFocus
                        maxLength={6}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-2xl text-center font-mono font-bold tracking-[0.3em] text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 uppercase"
                        onKeyDown={(e) => e.key === "Enter" && code.trim().length >= 4 && handleJoin()}
                      />
                      <button
                        onClick={handleJoin}
                        disabled={code.trim().length < 4 || loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all"
                      >
                        {loading ? l.loading : l.join}
                      </button>
                      {error && (
                        <div className="text-center">
                          <p className="text-sm text-red-500 font-semibold mb-2">{error}</p>
                          <button onClick={() => { setError(null); setCode(""); }} className="text-xs text-slate-500 underline">{l.tryAgain}</button>
                        </div>
                      )}
                    </div>
                  )}

                  {quiz && !playing && (
                    <div className="text-center space-y-4">
                      <span className="text-5xl block">📝</span>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{quiz.quizTitle}</h2>
                      {quiz.subject && <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{quiz.subject}</p>}
                      {quiz.teacherName && <p className="text-xs text-slate-400">{l.by}: {quiz.teacherName}</p>}
                      <p className="text-sm text-slate-500">{quiz.questions?.length} {l.questions}</p>
                      {quiz.deadline && (
                        <p className={`text-xs font-semibold ${joinDeadlinePast(quiz.deadline) ? "text-red-500" : "text-indigo-500"}`}>
                          {new Date(String(quiz.deadline) + "T12:00:00").toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder={l.enterName}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-sm text-center text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                      />
                      <button
                        onClick={handleStartQuiz}
                        disabled={joinDeadlinePast(quiz.deadline)}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {joinDeadlinePast(quiz.deadline) ? l.expired : `${l.startQuiz} →`}
                      </button>
                      <button
                        onClick={() => { setQuiz(null); setCode(""); setAnnouncements([]); }}
                        className="text-sm text-slate-500 hover:text-slate-700 underline"
                      >
                        {l.tryAgain}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : finished ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center">
              <div className="text-7xl mb-4">{Math.round((score / quiz.questions.length) * 100) >= 80 ? "🏆" : Math.round((score / quiz.questions.length) * 100) >= 50 ? "👏" : "💪"}</div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.score}: {score}/{quiz.questions.length}</h2>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">{Math.round((score / quiz.questions.length) * 100)}%</p>
              {resultSaved && (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {l.resultsSaved}
                </div>
              )}
              <div className="flex gap-3 justify-center mt-2">
                <button onClick={() => { setIdx(0); setScore(0); setFinished(false); setFeedback(null); setResultSaved(false); }} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">{l.playAgain}</button>
                <button onClick={() => { setPlaying(false); setQuiz(null); setCode(""); setAnnouncements([]); }} className="px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold">{l.back}</button>
              </div>
            </div>
          ) : q ? (
            (() => {
              const qt = joinGetQType(q);
              const optionsForDisplay =
                qt === "fill_in"
                  ? []
                  : qt === "true_false"
                    ? (q.options || []).filter(Boolean).length >= 2
                      ? (q.options || []).slice(0, 2)
                      : [l.trueLabel, l.falseLabel]
                    : (q.options || []).filter(Boolean);
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => { setPlaying(false); }} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      {l.back}
                    </button>
                    <span className="text-xs font-semibold text-slate-400 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">{idx + 1} / {quiz.questions.length}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    {q.imageUrl && String(q.imageUrl).trim() && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
                        <img src={q.imageUrl} alt="" className="w-full max-h-56 object-contain" />
                      </div>
                    )}
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">{q.question}</p>
                    {qt === "fill_in" ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={fillText}
                          onChange={(e) => setFillText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !feedback && fillText.trim() && handleAnswer(fillText)}
                          disabled={!!feedback}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                          placeholder={l.fillInPlaceholder}
                        />
                        {feedback && !feedback.correct && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">✅ {l.correctAnswer}: {q.correct}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAnswer(fillText)}
                          disabled={!!feedback || !fillText.trim()}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold disabled:opacity-40"
                        >
                          {l.submitAnswer}
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {optionsForDisplay.map((opt, oi) => {
                          let cls = "px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ";
                          if (feedback) {
                            if (opt === q.correct) cls += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-800 dark:text-emerald-200";
                            else if (opt === feedback.selected) cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200";
                            else cls += "bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 opacity-50 text-slate-400";
                          } else {
                            cls += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 cursor-pointer text-slate-700 dark:text-slate-200";
                          }
                          return (
                            <button key={oi} type="button" onClick={() => handleAnswer(opt)} disabled={!!feedback} className={cls}>
                              <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {feedback && q.explanation && (
                      <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">💡 {q.explanation}</div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : null}
        </div>
      </div>
    </div>
  );
}
