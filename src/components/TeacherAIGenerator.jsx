import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { doc, setDoc } from "firebase/firestore";
import { generateQuiz, SUBJECT_OPTIONS } from "../config/aiQuizTemplates";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const T = {
  el: {
    title: "AI Δημιουργός Quiz",
    subtitle: "Πληκτρολόγησε ένα θέμα και κάνε ένα quiz σε δευτερόλεπτα!",
    topicPlaceholder: "Π.χ. «Μαθηματικά κλάσματα» ή «Πλανήτες»",
    chooseSubject: "Ή επίλεξε θέμα:",
    questionCount: "Πλήθος ερωτήσεων",
    generate: "✨ Δημιουργία",
    generating: "Δημιουργία...",
    preview: "Προεπισκόπηση",
    save: "Αποθήκευση ως Quiz μου",
    saved: "Αποθηκεύτηκε!",
    syncCloud: "Συγχρονισμός Cloud",
    quizTitle: "Τίτλος Quiz",
    correctAnswer: "Σωστή απάντηση",
    regenerate: "🔄 Νέες Ερωτήσεις",
    instructions: "Πώς δουλεύει",
    step1: "Πληκτρολόγησε ένα θέμα ή διάλεξε από τα έτοιμα μαθήματα",
    step2: "Το AI σου δημιουργεί 5-15 ερωτήσεις αυτόματα",
    step3: "Επεξεργάσου τις και αποθήκευσέ τις ως δικό σου quiz",
    aboutAI: "Το σύστημα χρησιμοποιεί προσεκτικά επιμελημένα question banks - δεν χρειάζεσαι API key.",
    needTopic: "Δώσε θέμα ή διάλεξε μάθημα!",
  },
  en: {
    title: "AI Quiz Generator",
    subtitle: "Type a topic and make a quiz in seconds!",
    topicPlaceholder: "E.g. 'Math fractions' or 'Planets'",
    chooseSubject: "Or pick a subject:",
    questionCount: "Number of questions",
    generate: "✨ Generate",
    generating: "Generating...",
    preview: "Preview",
    save: "Save as My Quiz",
    saved: "Saved!",
    syncCloud: "Sync Cloud",
    quizTitle: "Quiz Title",
    correctAnswer: "Correct answer",
    regenerate: "🔄 New Questions",
    instructions: "How it works",
    step1: "Type a topic or pick from ready subjects",
    step2: "AI generates 5-15 questions automatically",
    step3: "Edit them and save as your own quiz",
    aboutAI: "The system uses carefully curated question banks - no API key needed.",
    needTopic: "Enter a topic or pick a subject!",
  },
};

export default function TeacherAIGenerator({ lang, onSaved }) {
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [count, setCount] = useState(10);
  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim() && !selectedSubject) {
      alert(l.needTopic);
      return;
    }
    setGenerating(true);
    setSaved(false);
    setTimeout(() => {
      const questions = generateQuiz({
        topic: topic || (selectedSubject || ""),
        subjectId: selectedSubject,
        count,
        lang,
      });
      setGenerated(questions);
      const subjectLabel = selectedSubject
        ? SUBJECT_OPTIONS.find(s => s.id === selectedSubject)?.label[lang] || ""
        : topic;
      setQuizTitle(topic.trim() || `${subjectLabel} - ${new Date().toLocaleDateString(isEl ? "el-GR" : "en-US")}`);
      setGenerating(false);
    }, 1200);
  };

  const handleSave = async () => {
    if (!generated) return;
    const quiz = {
      id: `quiz_${Date.now()}`,
      code: generateCode(),
      title: quizTitle.trim() || (isEl ? "AI Quiz" : "AI Quiz"),
      subject: selectedSubject || "general",
      questions: generated.map(q => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        difficulty: q.difficulty,
      })),
      createdAt: new Date().toISOString(),
      generatedBy: "ai",
    };

    try {
      const stored = JSON.parse(localStorage.getItem("geo:teacherQuizzes") || "[]");
      stored.push(quiz);
      localStorage.setItem("geo:teacherQuizzes", JSON.stringify(stored));
    } catch {}

    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid, "teacherQuizzes", quiz.id), quiz);
      } catch (e) { console.warn("Cloud save failed:", e); }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (onSaved) onSaved(quiz);
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...generated];
    updated[idx] = { ...updated[idx], [field]: value };
    setGenerated(updated);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...generated];
    const opts = [...updated[qIdx].options];
    opts[oIdx] = value;
    updated[qIdx] = { ...updated[qIdx], options: opts };
    setGenerated(updated);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
        <span className="inline-block text-4xl mb-2">✨🤖</span>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {/* Topic input */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder={l.topicPlaceholder}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400 text-base"
        />

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.chooseSubject}</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {SUBJECT_OPTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(selectedSubject === s.id ? null : s.id)}
                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-bold transition-all ${selectedSubject === s.id ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105 shadow-md" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span>{isEl ? s.label.el : s.label.en}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-500 dark:text-slate-400">{l.questionCount}:</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
            {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-60"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {l.generating}
            </span>
          ) : l.generate}
        </button>
      </div>

      {/* Preview & Edit */}
      {generated && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-slate-800 dark:text-white">{l.preview} ({generated.length} {isEl ? "ερωτήσεις" : "questions"})</h4>
            <button onClick={handleGenerate} className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50">
              {l.regenerate}
            </button>
          </div>

          <input
            type="text"
            value={quizTitle}
            onChange={e => setQuizTitle(e.target.value)}
            placeholder={l.quizTitle}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400 font-semibold"
          />

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {generated.map((q, i) => (
              <div key={q.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Q{i + 1}.</span>
                  <input
                    value={q.question}
                    onChange={e => updateQuestion(i, "question", e.target.value)}
                    className="flex-1 px-2 py-1 rounded text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 ml-6">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-1.5">
                      <input type="radio" checked={q.correct === oi} onChange={() => updateQuestion(i, "correct", oi)} className="text-purple-500" />
                      <input
                        value={opt}
                        onChange={e => updateOption(i, oi, e.target.value)}
                        className={`flex-1 px-2 py-1 rounded text-xs outline-none border ${q.correct === oi ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className={`w-full px-6 py-3 rounded-xl font-bold shadow-md transition-all ${saved ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-[1.01]"}`}
          >
            {saved ? `✅ ${l.saved}` : `💾 ${l.save}`}
          </button>
        </div>
      )}

      {/* Instructions */}
      <details className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <summary className="cursor-pointer font-bold text-sm text-blue-700 dark:text-blue-400">💡 {l.instructions}</summary>
        <ol className="mt-2 space-y-1 text-xs text-blue-600 dark:text-blue-300 list-decimal list-inside">
          <li>{l.step1}</li>
          <li>{l.step2}</li>
          <li>{l.step3}</li>
        </ol>
        <p className="text-[11px] text-blue-500 mt-2 italic">{l.aboutAI}</p>
      </details>
    </div>
  );
}
