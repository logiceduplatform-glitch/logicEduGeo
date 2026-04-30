import React, { useContext, useRef, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { AIService } from "../services/AIService";

const T = {
  el: {
    title: "🤖 AI Δημιουργός Μαθήματος",
    subtitle: "Δώσε ένα θέμα και η AI θα φτιάξει: θεωρία, παραδείγματα, quiz και φύλλο εργασίας.",
    topic: "Θέμα μαθήματος",
    topicPh: "π.χ. Κλάσματα, Παρόμοια ρήματα, Φωτοσύνθεση",
    subject: "Μάθημα",
    subjectOpts: ["—", "Μαθηματικά", "Ελληνικά", "Αγγλικά", "Φυσική", "Χημεία", "Ιστορία", "Γεωγραφία", "Επιστήμη"],
    age: "Ηλικία",
    ageOpts: ["—", "4-5", "6", "7-8", "9-10", "11-12", "Λύκειο", "Ενήλικες"],
    difficulty: "Δυσκολία",
    easy: "Εύκολο", medium: "Μέτριο", hard: "Δύσκολο",
    generate: "✨ Δημιούργησε το μάθημα",
    generating: "⏳ Δημιουργία...",
    notReady: "Συμπλήρωσε ένα θέμα για να ξεκινήσεις.",
    aiNote: "💡 Αν δεν είναι ρυθμισμένο AI API, χρησιμοποιείται τοπικός generator.",
    print: "🖨️ Εκτύπωση",
    copy: "📋 Αντιγραφή",
    save: "💾 Αποθήκευση ως draft",
    saved: "✓ Αποθηκεύτηκε",
    sectionTheory: "📖 Θεωρία",
    sectionExamples: "💡 Παραδείγματα",
    sectionExercises: "✍️ Ασκήσεις",
    sectionQuiz: "🧪 Quiz",
    sectionWorksheet: "📝 Φύλλο Εργασίας",
    answer: "Απάντηση",
    correctAnswer: "Σωστή",
    why: "Εξήγηση",
    showAnswers: "Εμφάνιση απαντήσεων",
    hideAnswers: "Απόκρυψη",
    drafts: "📚 Πρόχειρα μαθήματα",
    open: "Άνοιγμα",
    delete: "Διαγραφή",
    clear: "🗑️ Καθαρισμός",
  },
  en: {
    title: "🤖 AI Lesson Generator",
    subtitle: "Give a topic and AI will build: theory, examples, quiz and a worksheet.",
    topic: "Lesson topic",
    topicPh: "e.g. Fractions, Verb tenses, Photosynthesis",
    subject: "Subject",
    subjectOpts: ["—", "Math", "Greek", "English", "Physics", "Chemistry", "History", "Geography", "Science"],
    age: "Age",
    ageOpts: ["—", "4-5", "6", "7-8", "9-10", "11-12", "High School", "Adults"],
    difficulty: "Difficulty",
    easy: "Easy", medium: "Medium", hard: "Hard",
    generate: "✨ Generate lesson",
    generating: "⏳ Generating...",
    notReady: "Type a topic to start.",
    aiNote: "💡 If no AI API is configured, a local fallback generator is used.",
    print: "🖨️ Print",
    copy: "📋 Copy",
    save: "💾 Save as draft",
    saved: "✓ Saved",
    sectionTheory: "📖 Theory",
    sectionExamples: "💡 Examples",
    sectionExercises: "✍️ Exercises",
    sectionQuiz: "🧪 Quiz",
    sectionWorksheet: "📝 Worksheet",
    answer: "Answer",
    correctAnswer: "Correct",
    why: "Why",
    showAnswers: "Show answers",
    hideAnswers: "Hide",
    drafts: "📚 Saved drafts",
    open: "Open",
    delete: "Delete",
    clear: "🗑️ Clear",
  },
};

const DRAFTS_KEY = "geo:aiLessonDrafts";

function loadDrafts() {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]"); } catch { return []; }
}
function saveDrafts(arr) {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(arr.slice(0, 30))); } catch {}
}

export default function AILessonGeneratorPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const printRef = useRef(null);

  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [age, setAge] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [busy, setBusy] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);
  const [drafts, setDrafts] = useState(loadDrafts());

  const generate = async () => {
    if (!topic.trim()) return;
    setBusy(true);
    try {
      const result = await AIService.generateLesson({
        topic: topic.trim(),
        subject,
        ageGroup: age,
        difficulty,
        lang,
      });
      setLesson(result);
      setShowAnswers(false);
    } catch (e) {
      alert("Error: " + (e.message || e));
    }
    setBusy(false);
  };

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    if (!lesson) return;
    const text = lessonToText(lesson, l);
    try { await navigator.clipboard.writeText(text); alert(l.saved); } catch {}
  };

  const handleSave = () => {
    if (!lesson) return;
    const draft = {
      id: Date.now(),
      title: lesson.title,
      topic, subject, age, difficulty, lang,
      lesson,
      createdAt: new Date().toISOString(),
    };
    const next = [draft, ...drafts.filter((d) => d.title !== lesson.title)];
    setDrafts(next);
    saveDrafts(next);
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 1800);
  };

  const openDraft = (d) => {
    setLesson(d.lesson);
    setTopic(d.topic || "");
    setSubject(d.subject || "");
    setAge(d.age || "");
    setDifficulty(d.difficulty || "medium");
    setShowAnswers(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDraft = (id) => {
    const next = drafts.filter((d) => d.id !== id);
    setDrafts(next);
    saveDrafts(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4 print:pt-0 print:px-0">
        <div className="mx-auto max-w-4xl">
          {/* ── Header (hidden on print) */}
          <div className="print:hidden text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
          </div>

          {/* ── Form (hidden on print) */}
          <div className="print:hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.topic}</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={l.topicPh}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-400"
                onKeyDown={(e) => { if (e.key === "Enter" && topic.trim()) generate(); }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.subject}</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
                  {l.subjectOpts.map((s) => <option key={s} value={s === "—" ? "" : s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.age}</label>
                <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
                  {l.ageOpts.map((s) => <option key={s} value={s === "—" ? "" : s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{l.difficulty}</label>
                <div className="flex gap-1">
                  {["easy", "medium", "hard"].map((d) => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${difficulty === d ? "bg-violet-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                      {l[d]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={busy || !topic.trim()}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold shadow-md hover:shadow-lg transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? l.generating : l.generate}
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">{l.aiNote}</p>
          </div>

          {/* ── Lesson display */}
          {lesson && (
            <>
              <div className="print:hidden flex flex-wrap gap-2 justify-center mb-4">
                <button onClick={handlePrint} className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">{l.print}</button>
                <button onClick={handleCopy} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{l.copy}</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold">
                  {savedFlag ? l.saved : l.save}
                </button>
                <button onClick={() => setShowAnswers(!showAnswers)} className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold">
                  {showAnswers ? l.hideAnswers : l.showAnswers}
                </button>
              </div>

              <article ref={printRef} className="bg-white dark:bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 print:shadow-none print:border-none print:rounded-none">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-violet-700 mb-4">{lesson.title}</h2>

                <Section title={l.sectionTheory}>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{lesson.theory}</p>
                </Section>

                {lesson.examples?.length > 0 && (
                  <Section title={l.sectionExamples}>
                    <ul className="list-disc pl-6 space-y-1">
                      {lesson.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                  </Section>
                )}

                {lesson.exercises?.length > 0 && (
                  <Section title={l.sectionExercises}>
                    <ol className="list-decimal pl-6 space-y-2">
                      {lesson.exercises.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ol>
                  </Section>
                )}

                {lesson.quiz?.length > 0 && (
                  <Section title={l.sectionQuiz}>
                    <div className="space-y-3">
                      {lesson.quiz.map((q, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                          <p className="font-bold mb-1">{i + 1}. {q.question}</p>
                          <ul className="space-y-0.5 text-sm">
                            {q.options?.map((o, j) => (
                              <li key={j} className={showAnswers && j === q.correctIdx ? "font-bold text-emerald-700" : ""}>
                                {String.fromCharCode(65 + j)}. {o} {showAnswers && j === q.correctIdx && ` ✓ (${l.correctAnswer})`}
                              </li>
                            ))}
                          </ul>
                          {showAnswers && q.explanation && (
                            <p className="mt-1 text-xs text-slate-500 italic">{l.why}: {q.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {lesson.worksheet?.length > 0 && (
                  <Section title={l.sectionWorksheet}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {lesson.worksheet.map((w, i) => (
                        <div key={i} className="border-b border-dotted border-slate-200 py-1.5 text-sm">
                          <span className="font-bold text-slate-400 mr-2">{i + 1}.</span>
                          {w.question}
                          {showAnswers && w.answer && (
                            <span className="ml-2 text-emerald-700 font-semibold">→ {w.answer}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </article>
            </>
          )}

          {/* ── Drafts list */}
          {drafts.length > 0 && (
            <div className="print:hidden mt-8 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{l.drafts} ({drafts.length})</h3>
              <ul className="space-y-2">
                {drafts.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{d.title}</p>
                      <p className="text-[11px] text-slate-400">{new Date(d.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => openDraft(d)} className="text-xs font-bold px-2 py-1 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">{l.open}</button>
                    <button onClick={() => deleteDraft(d.id)} className="text-xs font-bold px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">{l.delete}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body > *:not(#root) { display: none !important; }
          nav, .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="text-lg font-extrabold text-slate-800 mb-2 border-b border-slate-200 pb-1">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function lessonToText(lesson, l) {
  const lines = [];
  lines.push(`# ${lesson.title}\n`);
  lines.push(`## ${l.sectionTheory}\n${lesson.theory}\n`);
  if (lesson.examples?.length) {
    lines.push(`## ${l.sectionExamples}`);
    lesson.examples.forEach((e) => lines.push(`- ${e}`));
    lines.push("");
  }
  if (lesson.exercises?.length) {
    lines.push(`## ${l.sectionExercises}`);
    lesson.exercises.forEach((e, i) => lines.push(`${i + 1}. ${e}`));
    lines.push("");
  }
  if (lesson.quiz?.length) {
    lines.push(`## ${l.sectionQuiz}`);
    lesson.quiz.forEach((q, i) => {
      lines.push(`${i + 1}. ${q.question}`);
      q.options?.forEach((o, j) => lines.push(`   ${String.fromCharCode(65 + j)}. ${o}`));
      lines.push(`   → ${l.correctAnswer}: ${String.fromCharCode(65 + q.correctIdx)}`);
      if (q.explanation) lines.push(`   ${l.why}: ${q.explanation}`);
    });
    lines.push("");
  }
  if (lesson.worksheet?.length) {
    lines.push(`## ${l.sectionWorksheet}`);
    lesson.worksheet.forEach((w, i) => {
      lines.push(`${i + 1}. ${w.question}  → ${w.answer}`);
    });
  }
  return lines.join("\n");
}
