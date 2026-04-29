import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { doc, setDoc } from "firebase/firestore";
import { LESSON_PLANS, PLAN_AGES, PLAN_SUBJECTS, filterPlans } from "../config/lessonPlansConfig";

const T = {
  el: {
    title: "Έτοιμα Σχέδια Μαθήματος",
    subtitle: "Πλήρη πακέτα: θεωρία + quiz + ασκήσεις. Διάλεξε και χρησιμοποίησέ τα αμέσως!",
    age: "Ηλικία",
    subject: "Μάθημα",
    duration: "Διάρκεια",
    objectives: "Στόχοι",
    theory: "Θεωρία",
    quiz: "Quiz",
    questions: "ερωτήσεις",
    use: "✨ Χρήση Template",
    saved: "✅ Αποθηκεύτηκε στα μαθήματά μου & quiz!",
    close: "Κλείσιμο",
    preview: "Προεπισκόπηση",
    noResults: "Δεν βρέθηκαν σχέδια.",
    plansCount: "σχέδια",
  },
  en: {
    title: "Ready-Made Lesson Plans",
    subtitle: "Full packages: theory + quiz + worksheets. Pick and use instantly!",
    age: "Age",
    subject: "Subject",
    duration: "Duration",
    objectives: "Objectives",
    theory: "Theory",
    quiz: "Quiz",
    questions: "questions",
    use: "✨ Use Template",
    saved: "✅ Saved to your lessons & quizzes!",
    close: "Close",
    preview: "Preview",
    noResults: "No plans found.",
    plansCount: "plans",
  },
};

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getOptText(opt, lang) {
  if (typeof opt === "string") return opt;
  return lang === "el" ? opt.el : opt.en;
}

export default function TeacherLessonPlans() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;

  const [ageFilter, setAgeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [previewing, setPreviewing] = useState(null);
  const [savedFlash, setSavedFlash] = useState(null);

  const plans = filterPlans(LESSON_PLANS, ageFilter, subjectFilter, lang);

  const useTemplate = async (plan) => {
    const lessonCode = generateCode();
    const quizCode = generateCode();

    const lesson = {
      id: `lesson_${Date.now()}`,
      code: lessonCode,
      title: lang === "el" ? plan.title.el : plan.title.en,
      subject: (plan.subject.en || "general").toLowerCase().replace(/\s+/g, "_"),
      gradeLevel: "elem",
      gradeLabel: plan.age,
      sections: [
        {
          title: lang === "el" ? "Θεωρία" : "Theory",
          content: lang === "el" ? plan.theory.el : plan.theory.en,
          imageUrl: "",
        },
      ],
      attachments: [],
      relatedQuizCode: quizCode,
      createdAt: new Date().toISOString(),
      fromTemplate: plan.id,
    };

    const quiz = {
      id: `quiz_${Date.now() + 1}`,
      code: quizCode,
      title: lang === "el" ? plan.title.el : plan.title.en,
      subject: lesson.subject,
      questions: plan.quiz.map(q => ({
        question: getOptText(q.question, lang),
        options: q.options.map(o => getOptText(o, lang)),
        correct: q.correct,
        difficulty: "medium",
      })),
      createdAt: new Date().toISOString(),
      fromTemplate: plan.id,
    };

    try {
      const lessons = JSON.parse(localStorage.getItem("geo:teacherLessons") || "[]");
      lessons.push(lesson);
      localStorage.setItem("geo:teacherLessons", JSON.stringify(lessons));

      const quizzes = JSON.parse(localStorage.getItem("geo:teacherQuizzes") || "[]");
      quizzes.push(quiz);
      localStorage.setItem("geo:teacherQuizzes", JSON.stringify(quizzes));
    } catch (e) { console.warn("Local save failed", e); }

    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid, "teacherLessons", lesson.id), lesson);
        await setDoc(doc(db, "users", user.uid, "teacherQuizzes", quiz.id), quiz);
      } catch (e) { console.warn("Cloud save failed", e); }
    }

    setSavedFlash(plan.id);
    setTimeout(() => setSavedFlash(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-800">
        <span className="inline-block text-4xl mb-2">📚✨</span>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
        <div className="mt-3 text-xs font-semibold text-teal-600 dark:text-teal-400">
          {plans.length} {l.plansCount}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.age}</label>
          <div className="flex flex-wrap gap-2">
            {PLAN_AGES.map(a => (
              <button
                key={a.id}
                onClick={() => setAgeFilter(a.id)}
                className={`px-3 py-1.5 text-xs rounded-full font-semibold transition ${ageFilter === a.id ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}
              >
                {lang === "el" ? a.label.el : a.label.en}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">{l.subject}</label>
          <div className="flex flex-wrap gap-2">
            {PLAN_SUBJECTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSubjectFilter(s.id)}
                className={`px-3 py-1.5 text-xs rounded-full font-semibold transition ${subjectFilter === s.id ? "bg-purple-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}
              >
                {lang === "el" ? s.label.el : s.label.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plan cards */}
      {plans.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">{l.noResults}</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition">
              <div className={`bg-gradient-to-br ${plan.color} p-4 text-white`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-4xl">{plan.icon}</span>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase opacity-80">{lang === "el" ? plan.subject.el : plan.subject.en}</div>
                    <div className="text-xs font-semibold opacity-90">{lang === "el" ? plan.age.el : plan.age.en}</div>
                  </div>
                </div>
                <h4 className="mt-2 font-extrabold text-lg">{lang === "el" ? plan.title.el : plan.title.en}</h4>
                <div className="mt-1 text-xs opacity-80">⏱️ {lang === "el" ? plan.duration.el : plan.duration.en} • {plan.quiz.length} {l.questions}</div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">🎯 {l.objectives}</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5 pl-4 list-disc">
                    {(lang === "el" ? plan.objectives.el : plan.objectives.en).slice(0, 2).map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewing(plan)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    👁️ {l.preview}
                  </button>
                  <button
                    onClick={() => useTemplate(plan)}
                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg text-white transition shadow-sm ${savedFlash === plan.id ? "bg-emerald-500" : `bg-gradient-to-r ${plan.color} hover:shadow-md`}`}
                  >
                    {savedFlash === plan.id ? "✅ Saved!" : l.use}
                  </button>
                </div>
                {savedFlash === plan.id && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-semibold">{l.saved}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewing(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-br ${previewing.color} p-5 text-white sticky top-0 z-10`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-3xl">{previewing.icon}</span>
                  <h3 className="text-xl font-extrabold mt-1">{lang === "el" ? previewing.title.el : previewing.title.en}</h3>
                  <div className="text-xs opacity-90 mt-1">
                    {lang === "el" ? previewing.subject.el : previewing.subject.en} • {lang === "el" ? previewing.age.el : previewing.age.en} • ⏱️ {lang === "el" ? previewing.duration.el : previewing.duration.en}
                  </div>
                </div>
                <button onClick={() => setPreviewing(null)} className="text-white/80 hover:text-white text-2xl leading-none">×</button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">🎯 {l.objectives}</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 pl-5 list-disc">
                  {(lang === "el" ? previewing.objectives.el : previewing.objectives.en).map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">📖 {l.theory}</h4>
                <pre className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans max-h-64 overflow-y-auto">
                  {lang === "el" ? previewing.theory.el : previewing.theory.en}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">❓ {l.quiz} ({previewing.quiz.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {previewing.quiz.map((q, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2 text-xs">
                      <div className="font-semibold text-slate-700 dark:text-slate-200">{i + 1}. {getOptText(q.question, lang)}</div>
                      <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓ {getOptText(q.options[q.correct], lang)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800 flex gap-2">
              <button onClick={() => setPreviewing(null)} className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                {l.close}
              </button>
              <button
                onClick={() => { useTemplate(previewing); setPreviewing(null); }}
                className={`flex-1 px-4 py-2 rounded-lg bg-gradient-to-r ${previewing.color} text-white font-bold shadow-sm`}
              >
                {l.use}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
