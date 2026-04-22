import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { SyncService } from "../services/SyncService";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const STORAGE_KEY = "geo:customQuizzes";

function getCustomQuizzes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveCustomQuizzes(quizzes) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes)); } catch { /* quota/private */ }
}

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

const T = {
  el: {
    title: "Δημιουργία Περιεχομένου",
    subtitle: "Φτιάξε δικά σου quiz",
    back: "Πίσω",
    myQuizzes: "Τα quiz μου",
    createNew: "Νέο Quiz",
    noQuizzes: "Δεν έχεις δημιουργήσει quiz ακόμα",
    quizTitle: "Τίτλος quiz",
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
    play: "Παίξε",
    questions: "ερωτήσεις",
    option: "Επιλογή",
    easy: "Εύκολο",
    medium: "Μέτριο",
    hard: "Δύσκολο",
    export: "Εξαγωγή",
    import: "Εισαγωγή",
    confirmDelete: "Σίγουρα θέλεις να διαγράψεις αυτό το quiz;",
    titleRequired: "Ο τίτλος είναι υποχρεωτικός",
    minQuestions: "Χρειάζονται τουλάχιστον 2 ερωτήσεις",
    playing: "Παίζεις",
    finishScore: "Σκορ",
    playAgain: "Ξανά",
    backToEditor: "Πίσω στον editor",
  },
  en: {
    title: "Content Editor",
    subtitle: "Create your own quizzes",
    back: "Back",
    myQuizzes: "My Quizzes",
    createNew: "New Quiz",
    noQuizzes: "You haven't created any quizzes yet",
    quizTitle: "Quiz title",
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
    play: "Play",
    questions: "questions",
    option: "Option",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    export: "Export",
    import: "Import",
    confirmDelete: "Are you sure you want to delete this quiz?",
    titleRequired: "Title is required",
    minQuestions: "At least 2 questions required",
    playing: "Playing",
    finishScore: "Score",
    playAgain: "Again",
    backToEditor: "Back to editor",
  },
};

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

function QuizPlayer({ quiz, lang, onBack }) {
  const isEl = lang === "el";
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
    const newScore = isCorrect ? score + 1 : score;
    setFeedback({ correct: isCorrect, selected: opt });
    setScore(newScore);
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= quiz.questions.length) {
        setFinished(true);
      } else {
        setIdx(idx + 1);
      }
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
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">
          {idx + 1} / {quiz.questions.length}
        </span>
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
              cls += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 cursor-pointer text-slate-700 dark:text-slate-200";
            }
            return (
              <button key={oi} onClick={() => handleAnswer(opt)} disabled={!!feedback} className={cls}>
                <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {feedback && q.explanation && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
            💡 {q.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContentEditorPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const l = T[lang] || T.en;

  const [quizzes, setQuizzes] = useState(() => getCustomQuizzes());
  const [editing, setEditing] = useState(null); // quiz object being edited
  const [playing, setPlaying] = useState(null); // quiz object being played
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const handleNew = () => {
    setEditing({
      id: "quiz_" + Date.now(),
      title: "",
      questions: [emptyQuestion(), emptyQuestion()],
      createdAt: new Date().toISOString(),
    });
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
    saveCustomQuizzes(updated);
    SyncService.syncQuizDelete(id);
  };

  const handleSave = () => {
    if (!editing.title.trim()) { setError(l.titleRequired); return; }
    const validQs = editing.questions.filter((q) => q.question.trim() && q.options.filter(Boolean).length >= 2 && q.correct.trim());
    if (validQs.length < 2) { setError(l.minQuestions); return; }

    const toSave = { ...editing, questions: validQs };
    const idx = quizzes.findIndex((q) => q.id === toSave.id);
    let updated;
    if (idx >= 0) {
      updated = [...quizzes];
      updated[idx] = toSave;
    } else {
      updated = [...quizzes, toSave];
    }
    setQuizzes(updated);
    saveCustomQuizzes(updated);
    SyncService.syncQuiz(toSave);
    setEditing(null);
    setError(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(quizzes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-quizzes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (Array.isArray(data)) {
            const merged = [...quizzes, ...data.filter((d) => d.id && d.questions)];
            setQuizzes(merged);
            saveCustomQuizzes(merged);
          }
        } catch {}
      };
      reader.readAsText(file);
    };
    input.click();
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

  const addQuestion = () => {
    setEditing({ ...editing, questions: [...editing.questions, emptyQuestion()] });
  };

  const removeQuestion = (qIdx) => {
    if (editing.questions.length <= 2) return;
    const qs = editing.questions.filter((_, i) => i !== qIdx);
    setEditing({ ...editing, questions: qs });
  };

  if (playing) {
    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
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
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl">
          {/* Back */}
          <button
            onClick={() => editing ? setEditing(null) : navigate(-1)}
            className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {l.back}
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
            <div className="relative flex items-center gap-3">
              <span className="text-3xl">✏️</span>
              <div>
                <h1 className="text-2xl font-bold">{l.title}</h1>
                <p className="text-cyan-200 text-sm">{l.subtitle}</p>
              </div>
            </div>
          </div>

          {saved && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              {l.saved}
            </div>
          )}

          {/* Editor mode */}
          {editing ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 space-y-6">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.quizTitle}</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/50 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                  placeholder={isEl ? "π.χ. Γεωγραφία Ελλάδας" : "e.g. Greek Geography"}
                />
              </div>

              {editing.questions.map((q, qIdx) => (
                <div key={q.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {l.question} #{qIdx + 1}
                    </span>
                    {editing.questions.length > 2 && (
                      <button onClick={() => removeQuestion(qIdx)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                        {l.removeQuestion}
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-cyan-400"
                    placeholder={l.question}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-5">{String.fromCharCode(65 + oIdx)}</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-cyan-400"
                          placeholder={`${l.option} ${String.fromCharCode(65 + oIdx)}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.correct}</label>
                      <select
                        value={q.correct}
                        onChange={(e) => updateQuestion(qIdx, "correct", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none"
                      >
                        <option value="">—</option>
                        {q.options.filter(Boolean).map((opt, oi) => (
                          <option key={oi} value={opt}>{String.fromCharCode(65 + oi)}: {opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{l.difficulty}</label>
                      <select
                        value={q.difficulty}
                        onChange={(e) => updateQuestion(qIdx, "difficulty", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none"
                      >
                        {DIFFICULTY_OPTIONS.map((d) => (
                          <option key={d} value={d}>{l[d]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-cyan-400"
                    placeholder={l.explanation}
                  />
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-semibold hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {l.addQuestion}
              </button>

              <div className="flex gap-3">
                <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  {l.cancel}
                </button>
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30 transition-all">
                  {l.save}
                </button>
              </div>
            </div>
          ) : (
            /* List mode */
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleNew}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {l.createNew}
                </button>
                {quizzes.length > 0 && (
                  <>
                    <button onClick={handleExport} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      {l.export}
                    </button>
                    <button onClick={handleImport} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      {l.import}
                    </button>
                  </>
                )}
              </div>

              {quizzes.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 text-center">
                  <span className="text-5xl block mb-4">✏️</span>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold mb-2">{l.noQuizzes}</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {isEl ? "Πάτα 'Νέο Quiz' για να ξεκινήσεις!" : "Press 'New Quiz' to get started!"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">{quiz.title}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                        {quiz.questions.length} {l.questions}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPlaying(quiz)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                          {l.play}
                        </button>
                        <button
                          onClick={() => handleEdit(quiz)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          {l.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          {l.delete}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
