import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const USE_CASES = {
  el: [
    {
      icon: "🎒",
      title: "Προετοιμασία για το σχολείο",
      desc: "Γράμματα, αριθμοί, σχήματα — όλα όσα χρειάζεται το παιδί πριν το πρώτο κουδούνι.",
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: "🎯",
      title: "Χρήσιμος ελεύθερος χρόνος",
      desc: "Αντί για παθητικές οθόνες, το παιδί μαθαίνει παίζοντας. Screen time που αξίζει.",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: "🧠",
      title: "Ανάπτυξη λογικής σκέψης",
      desc: "Puzzles, μοτίβα και στρατηγική που χτίζουν κριτική σκέψη από μικρή ηλικία.",
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      icon: "📈",
      title: "Βελτίωση σχολικών επιδόσεων",
      desc: "Τα παιδιά που εξασκούνται τακτικά δείχνουν σημαντική βελτίωση στα μαθηματικά και τη γλώσσα.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: "🏆",
      title: "Διαγωνισμοί & Ολυμπιάδες",
      desc: "Ασκήσεις αυξημένης δυσκολίας που προετοιμάζουν για μαθηματικούς διαγωνισμούς.",
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: "👨‍🏫",
      title: "Εργαλείο για εκπαιδευτικούς",
      desc: "Δημιουργήστε τάξεις, αναθέστε quiz, παρακολουθήστε την πρόοδο κάθε μαθητή σε πραγματικό χρόνο.",
      color: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
    },
  ],
  en: [
    {
      icon: "🎒",
      title: "School preparation",
      desc: "Letters, numbers, shapes — everything your child needs before the first bell rings.",
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: "🎯",
      title: "Productive screen time",
      desc: "Instead of passive screens, your child learns by playing. Screen time that's worth it.",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: "🧠",
      title: "Logic & critical thinking",
      desc: "Puzzles, patterns, and strategy that build critical thinking from an early age.",
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      icon: "📈",
      title: "Better school performance",
      desc: "Children who practice regularly show significant improvement in math and language skills.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: "🏆",
      title: "Contests & Olympiads",
      desc: "Advanced difficulty exercises that prepare students for math competitions.",
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: "👨‍🏫",
      title: "Tool for educators",
      desc: "Create classrooms, assign quizzes, and track each student's progress in real time.",
      color: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
    },
  ],
};

export default function UseCasesSection() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const cases = USE_CASES[isEl ? "el" : "en"];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            {isEl ? "Πότε είναι απαραίτητο" : "When it's essential"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            {isEl
              ? "Πότε χρειάζεσαι το Kibloo;"
              : "When do you need Kibloo?"}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {isEl
              ? "Η τέλεια λύση στο «πόση ώρα στην οθόνη είναι υγιής για τα παιδιά»."
              : "The perfect solution to 'how much screen time is healthy for kids'."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl p-6 ${c.bg} border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
