import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { db } from "../auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    loading: "Φόρτωση...",
    notFound: "Δεν βρέθηκε αυτό το μάθημα",
    back: "Πίσω",
    goToQuiz: "Πάμε στο Quiz →",
    section: "Ενότητα",
    teacher: "Δάσκαλος",
    subject: "Μάθημα",
    readTime: "Χρόνος ανάγνωσης",
    minutes: "λεπτά",
    tableOfContents: "Περιεχόμενα",
    completed: "Ολοκληρώθηκε!",
    lessonComplete: "Μπράβο! Ολοκλήρωσες τη θεωρία.",
    nowTakeQuiz: "Τώρα μπορείς να δοκιμάσεις τις γνώσεις σου!",
    backToClass: "Πίσω στην τάξη",
  },
  en: {
    loading: "Loading...",
    notFound: "Lesson not found",
    back: "Back",
    goToQuiz: "Go to Quiz →",
    section: "Section",
    teacher: "Teacher",
    subject: "Subject",
    readTime: "Read time",
    minutes: "minutes",
    tableOfContents: "Contents",
    completed: "Completed!",
    lessonComplete: "Great job! You finished the lesson.",
    nowTakeQuiz: "Now you can test your knowledge!",
    backToClass: "Back to class",
  },
};

export default function LessonViewPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!code || !db) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "classroomLessons", code));
        if (snap.exists()) {
          setLesson({ id: snap.id, ...snap.data() });
        }
      } catch {}
      setLoading(false);
    })();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-400 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <div className="pt-24 text-center">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-slate-500 dark:text-slate-400 font-semibold">{l.notFound}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-sm hover:bg-purple-200">{l.back}</button>
        </div>
      </div>
    );
  }

  const sections = lesson.sections || [];
  const estimatedReadTime = Math.max(1, Math.ceil(sections.reduce((sum, s) => sum + (s.content || "").split(/\s+/).length, 0) / 150));
  const isLastSection = activeSection === sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      setCompleted(true);
    } else {
      setActiveSection(prev => Math.min(prev + 1, sections.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setActiveSection(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const findLinkedQuiz = () => {
    if (!lesson.linkedQuizId || !lesson.classroomCode) return null;
    return `/my-classroom/${lesson.classroomCode}`;
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={lesson.lessonTitle} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-7xl mb-2">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{l.completed}</h2>
            <p className="text-slate-500 dark:text-slate-400">{l.lessonComplete}</p>
            {lesson.linkedQuizId && (
              <>
                <p className="text-sm text-purple-600 dark:text-purple-400">{l.nowTakeQuiz}</p>
                <button
                  onClick={() => { const url = findLinkedQuiz(); if (url) navigate(url); }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {l.goToQuiz}
                </button>
              </>
            )}
            <button
              onClick={() => navigate(-1)}
              className="block mx-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              {l.backToClass}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = sections[activeSection] || {};
  const progress = sections.length > 0 ? ((activeSection + 1) / sections.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={lesson.lessonTitle} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 mb-3 flex items-center gap-1">
              <span>←</span> {l.back}
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-2">{lesson.lessonTitle}</h1>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
              {lesson.teacherName && <span className="flex items-center gap-1"><span>👨‍🏫</span> {lesson.teacherName}</span>}
              {lesson.subject && <span className="flex items-center gap-1"><span>📚</span> {lesson.subject}</span>}
              <span className="flex items-center gap-1"><span>⏱️</span> ~{estimatedReadTime} {l.minutes}</span>
              <span className="flex items-center gap-1"><span>📄</span> {sections.length} {isEl ? "ενότητες" : "sections"}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400">{l.section} {activeSection + 1}/{sections.length}</span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Table of contents (compact) */}
          {sections.length > 1 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{l.tableOfContents}</h3>
              <div className="flex flex-wrap gap-2">
                {sections.map((sec, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveSection(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      i === activeSection
                        ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-2 border-purple-400"
                        : i < activeSection
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    {i < activeSection ? "✓ " : ""}{sec.title || `${l.section} ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current section content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold">{activeSection + 1}</span>
              {currentSection.title}
            </h2>
            {currentSection.imageUrl && (
              <img src={currentSection.imageUrl} alt="" loading="lazy" decoding="async" className="rounded-xl mb-4 max-h-64 object-cover w-full" />
            )}
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
              {currentSection.content}
            </div>
            {(currentSection.attachments || []).length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isEl ? "Συνημμένα" : "Attachments"}</h4>
                {currentSection.attachments.map((att, ai) => {
                  const u = (att.url || "").toLowerCase();
                  const icon = u.includes("drive.google") ? "📁" : u.includes("dropbox") ? "📦" : (u.includes("youtube") || u.includes("youtu.be")) ? "🎬" : u.match(/\.pdf(\?|$)/) ? "📄" : "🔗";
                  return (
                    <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                      <span className="text-xl">{icon}</span>
                      <span className="flex-1 min-w-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline truncate">{att.name}</span>
                      <span className="text-xs text-slate-400">{isEl ? "Άνοιγμα ↗" : "Open ↗"}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={activeSection === 0}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← {isEl ? "Προηγούμενο" : "Previous"}
            </button>
            <button
              onClick={handleNext}
              className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                isLastSection
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg"
              }`}
            >
              {isLastSection
                ? (lesson.linkedQuizId ? l.goToQuiz : (isEl ? "Ολοκλήρωση ✓" : "Complete ✓"))
                : (isEl ? "Επόμενο →" : "Next →")
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
