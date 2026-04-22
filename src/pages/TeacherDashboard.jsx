import React, { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db, auth } from "../auth/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const STORAGE_KEY = "geo:teacherQuizzes";
const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

function getLocalQuizzes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveLocalQuizzes(q) { localStorage.setItem(STORAGE_KEY, JSON.stringify(q)); }

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function emptyQuestion() {
  return {
    id: "q_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    question: "",
    options: ["", "", "", ""],
    correct: "",
    difficulty: "medium",
    explanation: "",
  };
}

const T = {
  el: {
    title: "Πίνακας Δασκάλου",
    subtitle: "Δημιούργησε quiz και μοίρασέ τα στους μαθητές σου",
    back: "Πίσω",
    tabQuizzes: "Τα Quiz μου",
    tabClassroom: "Η Τάξη μου",
    tabResources: "Πόροι",
    createNew: "Νέο Quiz",
    noQuizzes: "Δεν έχεις δημιουργήσει quiz ακόμα",
    quizTitle: "Τίτλος quiz",
    subject: "Μάθημα (π.χ. Μαθηματικά)",
    gradeLevel: "Βαθμίδα",
    question: "Ερώτηση",
    options: "Επιλογές",
    correct: "Σωστή απάντηση",
    difficulty: "Δυσκολία",
    explanation: "Εξήγηση (προαιρετικά)",
    addQuestion: "Προσθήκη ερώτησης",
    removeQuestion: "Αφαίρεση",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε!",
    cancel: "Ακύρωση",
    edit: "Επεξεργασία",
    delete: "Διαγραφή",
    play: "Δοκιμή",
    questions: "ερωτήσεις",
    option: "Επιλογή",
    easy: "Εύκολο",
    medium: "Μέτριο",
    hard: "Δύσκολο",
    confirmDelete: "Σίγουρα θέλεις να διαγράψεις αυτό το quiz;",
    titleRequired: "Ο τίτλος είναι υποχρεωτικός",
    minQuestions: "Χρειάζονται τουλάχιστον 2 ερωτήσεις",
    generateCode: "Δημιουργία κωδικού τάξης",
    codeGenerated: "Ο κωδικός δημιουργήθηκε!",
    codeCopied: "Αντιγράφηκε!",
    codeUnavailableOffline: "Η δημιουργία κωδικού τάξης χρειάζεται σύνδεση λογαριασμού.",
    codeGenerationFailed: "Αποτυχία δημιουργίας κωδικού. Δοκίμασε ξανά.",
    shareHint: "Μοίρασε αυτόν τον κωδικό στους μαθητές σου",
    classroomCode: "Κωδικός τάξης",
    noCodesYet: "Δεν έχεις δημιουργήσει ακόμα κωδικούς τάξης",
    timesPlayed: "φορές παιχτ.",
    resourcesTitle: "Εκπαιδευτικοί Πόροι",
    resourcesDesc: "Συμβουλές και πόροι για τη χρήση της πλατφόρμας στην τάξη σας.",
    tip1Title: "Πώς να χρησιμοποιήσεις τα quiz στην τάξη",
    tip1Desc: "Δημιούργησε ένα quiz, πάρε τον κωδικό και μοίρασέ τον στους μαθητές. Μπορούν να μπουν από τη σελίδα «Είσοδος σε τάξη».",
    tip2Title: "Ιδέες για δραστηριότητες",
    tip2Desc: "Χρησιμοποίησε τα έτοιμα παιχνίδια ανά ηλικία ή δημιούργησε δικά σου quiz προσαρμοσμένα στο μάθημά σου.",
    tip3Title: "Παρακολούθηση προόδου",
    tip3Desc: "Σύντομα θα μπορείς να βλέπεις πόσοι μαθητές έκαναν κάθε quiz και τα σκορ τους.",
    elem: "Δημοτικό",
    middle: "Γυμνάσιο",
    high: "Λύκειο",
    all: "Όλες",
    finishScore: "Σκορ",
    playAgain: "Ξανά",
    backToEditor: "Πίσω στον editor",
  },
  en: {
    title: "Teacher Dashboard",
    subtitle: "Create quizzes and share them with your students",
    back: "Back",
    tabQuizzes: "My Quizzes",
    tabClassroom: "My Classroom",
    tabResources: "Resources",
    createNew: "New Quiz",
    noQuizzes: "You haven't created any quizzes yet",
    quizTitle: "Quiz title",
    subject: "Subject (e.g. Math)",
    gradeLevel: "Grade level",
    question: "Question",
    options: "Options",
    correct: "Correct answer",
    difficulty: "Difficulty",
    explanation: "Explanation (optional)",
    addQuestion: "Add question",
    removeQuestion: "Remove",
    save: "Save",
    saved: "Saved!",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    play: "Preview",
    questions: "questions",
    option: "Option",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    confirmDelete: "Are you sure you want to delete this quiz?",
    titleRequired: "Title is required",
    minQuestions: "At least 2 questions required",
    generateCode: "Generate classroom code",
    codeGenerated: "Code generated!",
    codeCopied: "Copied!",
    codeUnavailableOffline: "Generating classroom code requires a signed-in account.",
    codeGenerationFailed: "Failed to generate code. Please try again.",
    shareHint: "Share this code with your students",
    classroomCode: "Classroom code",
    noCodesYet: "No classroom codes created yet",
    timesPlayed: "times played",
    resourcesTitle: "Educational Resources",
    resourcesDesc: "Tips and resources for using the platform in your classroom.",
    tip1Title: "How to use quizzes in class",
    tip1Desc: "Create a quiz, get the code, and share it with your students. They can join from the 'Join classroom' page.",
    tip2Title: "Activity ideas",
    tip2Desc: "Use the ready-made games by age group or create custom quizzes tailored to your subject.",
    tip3Title: "Progress monitoring",
    tip3Desc: "Soon you'll be able to see how many students completed each quiz and their scores.",
    elem: "Elementary",
    middle: "Middle",
    high: "High",
    all: "All",
    finishScore: "Score",
    playAgain: "Again",
    backToEditor: "Back to editor",
  },
};

function QuizPlayer({ quiz, lang, onBack }) {
  const l = T[lang] || T.en;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const q = quiz.questions[idx];
  if (!q && !finished) return null;

  const handleAnswer = (opt) => {
    if (feedback) return;
    const isCorrect = opt === q.correct;
    setFeedback({ correct: isCorrect, selected: opt });
    setScore(isCorrect ? score + 1 : score);
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= quiz.questions.length) setFinished(true);
      else setIdx(idx + 1);
    }, 1500);
  };

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="text-7xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}</div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.finishScore}: {score}/{quiz.questions.length}</h2>
        <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-6">{pct}%</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setIdx(0); setScore(0); setFinished(false); }} className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">{l.playAgain}</button>
          <button onClick={onBack} className="px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold">{l.backToEditor}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          {l.back}
        </button>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">{idx + 1} / {quiz.questions.length}</span>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">{q.question}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {q.options.filter(Boolean).map((opt, oi) => {
            let cls = "px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ";
            if (feedback) {
              if (opt === q.correct) cls += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-800 dark:text-emerald-200";
              else if (opt === feedback.selected) cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200";
              else cls += "bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700 opacity-50 text-slate-400";
            } else {
              cls += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer text-slate-700 dark:text-slate-200";
            }
            return <button key={oi} onClick={() => handleAnswer(opt)} disabled={!!feedback} className={cls}><span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>{opt}</button>;
          })}
        </div>
        {feedback && q.explanation && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">💡 {q.explanation}</div>
        )}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [tab, setTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState(() => getLocalQuizzes());
  const [editing, setEditing] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [codes, setCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (!db || !user) return;
    const loadCodes = async () => {
      try {
        const q = query(collection(db, "classroomQuizzes"), where("teacherUid", "==", user.uid));
        const snap = await getDocs(q);
        const loaded = [];
        snap.forEach((d) => loaded.push({ id: d.id, ...d.data() }));
        setCodes(loaded);
      } catch (e) {
        if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to load codes:", e);
      }
    };
    loadCodes();
  }, [user]);

  const handleNew = () => {
    setEditing({ id: "tq_" + Date.now(), title: "", subject: "", gradeLevel: "", questions: [emptyQuestion(), emptyQuestion()], createdAt: new Date().toISOString() });
    setError(null);
  };

  const handleEdit = (quiz) => {
    setEditing({ ...quiz, questions: quiz.questions.map((q) => ({ ...q, options: [...q.options] })) });
    setError(null);
  };

  const handleDelete = (id) => {
    if (!confirm(l.confirmDelete)) return;
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    saveLocalQuizzes(updated);
  };

  const handleSave = () => {
    if (!editing.title.trim()) { setError(l.titleRequired); return; }
    const validQs = editing.questions.filter((q) => q.question.trim() && q.options.filter(Boolean).length >= 2 && q.correct.trim());
    if (validQs.length < 2) { setError(l.minQuestions); return; }
    const toSave = { ...editing, questions: validQs };
    const idx = quizzes.findIndex((q) => q.id === toSave.id);
    let updated;
    if (idx >= 0) { updated = [...quizzes]; updated[idx] = toSave; }
    else { updated = [...quizzes, toSave]; }
    setQuizzes(updated);
    saveLocalQuizzes(updated);
    setEditing(null);
    setError(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGenerateCode = async (quiz) => {
    if (!db || !user) {
      setActionNotice({ type: "error", text: l.codeUnavailableOffline });
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }
    const code = generateCode();
    try {
      await setDoc(doc(db, "classroomQuizzes", code), {
        code,
        quizId: quiz.id,
        quizTitle: quiz.title,
        subject: quiz.subject || "",
        gradeLevel: quiz.gradeLevel || "",
        questions: quiz.questions,
        teacherUid: user.uid,
        teacherName: user.displayName || "",
        createdAt: new Date().toISOString(),
        timesPlayed: 0,
      });
      setCodes((prev) => [...prev, { id: code, code, quizTitle: quiz.title, timesPlayed: 0, createdAt: new Date().toISOString() }]);
      setActionNotice({ type: "success", text: `${l.codeGenerated} ${code}` });
      setCopiedCode(code);
      await navigator.clipboard?.writeText(code).catch(() => {});
      setTab("classroom");
      setTimeout(() => setCopiedCode(null), 3000);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (e) {
      setActionNotice({ type: "error", text: l.codeGenerationFailed });
      setTimeout(() => setActionNotice(null), 3000);
      if (import.meta.env.DEV) console.warn("[TeacherDashboard] Failed to save code:", e);
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {}
  };

  const updateQuestion = (qIdx, field, value) => {
    const qs = [...editing.questions];
    qs[qIdx] = { ...qs[qIdx], [field]: value };
    setEditing({ ...editing, questions: qs });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const qs = [...editing.questions];
    const opts = [...qs[qIdx].options];
    opts[oIdx] = value;
    qs[qIdx] = { ...qs[qIdx], options: opts };
    setEditing({ ...editing, questions: qs });
  };

  const TABS = [
    { key: "quizzes", label: l.tabQuizzes, icon: "📝" },
    { key: "classroom", label: l.tabClassroom, icon: "🏫" },
    { key: "resources", label: l.tabResources, icon: "📚" },
  ];

  if (playing) {
    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="mx-auto max-w-2xl">
            <QuizPlayer quiz={playing} lang={lang} onBack={() => setPlaying(null)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-4xl">
          <button onClick={() => editing ? setEditing(null) : navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            {l.back}
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
            <div className="relative flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h1 className="text-2xl font-bold">{l.title}</h1>
                <p className="text-amber-200 text-sm">{l.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.key
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {saved && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              {l.saved}
            </div>
          )}
          {actionNotice && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
              actionNotice.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d={actionNotice.type === "error" ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} /></svg>
              <span>{actionNotice.text}</span>
            </div>
          )}

          {/* QUIZZES TAB */}
          {tab === "quizzes" && (
            editing ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 space-y-6">
                {error && <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.quizTitle}</label>
                    <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700" placeholder={isEl ? "π.χ. Γεωγραφία Ελλάδας" : "e.g. Greek Geography"} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.subject}</label>
                    <input type="text" value={editing.subject || ""} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-amber-400 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700" placeholder={l.subject} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.gradeLevel}</label>
                  <div className="flex gap-2 flex-wrap">
                    {["elem", "middle", "high", "all"].map((g) => (
                      <button key={g} onClick={() => setEditing({ ...editing, gradeLevel: g })} className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${editing.gradeLevel === g ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-amber-300"}`}>
                        {l[g]}
                      </button>
                    ))}
                  </div>
                </div>

                {editing.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{l.question} #{qIdx + 1}</span>
                      {editing.questions.length > 2 && <button onClick={() => { const qs = editing.questions.filter((_, i) => i !== qIdx); setEditing({ ...editing, questions: qs }); }} className="text-xs text-red-500 hover:text-red-700 font-semibold">{l.removeQuestion}</button>}
                    </div>
                    <input type="text" value={q.question} onChange={(e) => updateQuestion(qIdx, "question", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400" placeholder={l.question} />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 w-5">{String.fromCharCode(65 + oIdx)}</span>
                          <input type="text" value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400" placeholder={`${l.option} ${String.fromCharCode(65 + oIdx)}`} />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.correct}</label>
                        <select value={q.correct} onChange={(e) => updateQuestion(qIdx, "correct", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none">
                          <option value="">—</option>
                          {q.options.filter(Boolean).map((opt, oi) => <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}: {opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.difficulty}</label>
                        <select value={q.difficulty} onChange={(e) => updateQuestion(qIdx, "difficulty", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none">
                          {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{l[d]}</option>)}
                        </select>
                      </div>
                    </div>
                    <input type="text" value={q.explanation} onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-amber-400" placeholder={l.explanation} />
                  </div>
                ))}

                <button onClick={() => setEditing({ ...editing, questions: [...editing.questions, emptyQuestion()] })} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-semibold hover:border-amber-400 hover:text-amber-600 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {l.addQuestion}
                </button>

                <div className="flex gap-3">
                  <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">{l.cancel}</button>
                  <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all">{l.save}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={handleNew} className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {l.createNew}
                </button>

                {quizzes.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 text-center">
                    <span className="text-5xl block mb-4">📝</span>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold mb-2">{l.noQuizzes}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">{isEl ? "Πάτα 'Νέο Quiz' για να ξεκινήσεις!" : "Press 'New Quiz' to get started!"}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">{quiz.title}</h3>
                        {quiz.subject && <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">{quiz.subject}</p>}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{quiz.questions.length} {l.questions} {quiz.gradeLevel ? `· ${l[quiz.gradeLevel] || quiz.gradeLevel}` : ""}</p>
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => setPlaying(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">{l.play}</button>
                          <button onClick={() => handleEdit(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700">{l.edit}</button>
                          <button onClick={() => handleGenerateCode(quiz)} className="px-3 py-2 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">{l.generateCode}</button>
                          <button onClick={() => handleDelete(quiz.id)} className="px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">{l.delete}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* CLASSROOM TAB */}
          {tab === "classroom" && (
            <div className="space-y-4">
              {copiedCode && (
                <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {l.codeCopied}: <span className="font-mono font-bold">{copiedCode}</span>
                </div>
              )}

              {codes.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 text-center">
                  <span className="text-5xl block mb-4">🏫</span>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold mb-2">{l.noCodesYet}</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">{l.shareHint}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {codes.map((c) => (
                    <div key={c.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.quizTitle}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{c.timesPlayed || 0} {l.timesPlayed}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-700 tracking-widest">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title={l.codeCopied}>
                          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESOURCES TAB */}
          {tab === "resources" && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{l.resourcesTitle}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{l.resourcesDesc}</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: "🎯", title: l.tip1Title, desc: l.tip1Desc },
                    { icon: "💡", title: l.tip2Title, desc: l.tip2Desc },
                    { icon: "📊", title: l.tip3Title, desc: l.tip3Desc },
                  ].map((tip, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                      <span className="text-2xl block mb-2">{tip.icon}</span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{tip.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
