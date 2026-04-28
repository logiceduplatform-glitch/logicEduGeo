import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const MILESTONES = {
  el: [
    {
      icon: "🔤",
      title: "Αναγνώριση γραμμάτων & αριθμών",
      desc: "Τα παιδιά μαθαίνουν γράμματα, αριθμούς και σχήματα μέσα από παιχνίδια που αγαπούν.",
      ages: "2-5 ετών",
      color: "from-rose-400 to-pink-500",
    },
    {
      icon: "🧩",
      title: "Λογική σκέψη & επίλυση προβλημάτων",
      desc: "Puzzles, μοτίβα και στρατηγική αναπτύσσουν την κριτική σκέψη βήμα-βήμα.",
      ages: "4-8 ετών",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: "🌍",
      title: "Κατανόηση του κόσμου",
      desc: "Γεωγραφία, φύση και επιστήμη ανοίγουν νέους ορίζοντες γνώσης.",
      ages: "6-10 ετών",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: "💪",
      title: "Αυτοπεποίθηση & επιμονή",
      desc: "Τα badges, XP και πιστοποιητικά κρατούν τα κίνητρα ψηλά. Κάθε παιδί νιώθει νικητής.",
      ages: "Όλες οι ηλικίες",
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: "🤝",
      title: "Συνεργασία & υγιής ανταγωνισμός",
      desc: "Multiplayer, leaderboards και τάξεις δασκάλου φέρνουν τα παιδιά κοντά.",
      ages: "7-12 ετών",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: "📚",
      title: "Αγάπη για τη μάθηση",
      desc: "Το πιο σημαντικό ορόσημο: όταν ένα παιδί ζητάει μόνο του «να μάθει κι άλλο».",
      ages: "Το τελικό ορόσημο",
      color: "from-indigo-400 to-purple-500",
    },
  ],
  en: [
    {
      icon: "🔤",
      title: "Letter & number recognition",
      desc: "Children learn letters, numbers, and shapes through games they love.",
      ages: "Ages 2-5",
      color: "from-rose-400 to-pink-500",
    },
    {
      icon: "🧩",
      title: "Logical thinking & problem solving",
      desc: "Puzzles, patterns, and strategy develop critical thinking step by step.",
      ages: "Ages 4-8",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: "🌍",
      title: "Understanding the world",
      desc: "Geography, nature, and science open new horizons of knowledge.",
      ages: "Ages 6-10",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: "💪",
      title: "Confidence & persistence",
      desc: "Badges, XP, and certificates keep motivation high. Every child feels like a winner.",
      ages: "All ages",
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: "🤝",
      title: "Collaboration & healthy competition",
      desc: "Multiplayer, leaderboards, and teacher classrooms bring kids together.",
      ages: "Ages 7-12",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: "📚",
      title: "A love for learning",
      desc: "The most important milestone: when a child asks to 'learn more' on their own.",
      ages: "The ultimate milestone",
      color: "from-indigo-400 to-purple-500",
    },
  ],
};

export default function MilestonesSection() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const milestones = MILESTONES[isEl ? "el" : "en"];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {isEl ? "Ορόσημα Ανάπτυξης" : "Developmental Milestones"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            {isEl ? "Η μάθηση δεν είναι γραμμική" : "Learning isn't linear"}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isEl
              ? "Κάθε παιδί εξελίσσεται με τον δικό του ρυθμό. Η πλατφόρμα μας γιορτάζει κάθε βήμα προόδου."
              : "Every child grows at their own pace. Our platform celebrates every step of progress."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${m.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xl shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base mb-1.5 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {m.desc}
                  </p>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r ${m.color} text-white`}>
                    {m.ages}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-slate-400 dark:text-slate-500 italic max-w-lg mx-auto">
            {isEl
              ? "\"Το πιο σημαντικό πράγμα που μπορείς να δώσεις σε ένα παιδί δεν είναι γνώσεις — είναι η αγάπη για τη μάθηση.\""
              : "\"The most important thing you can give a child isn't knowledge — it's a love of learning.\""}
          </p>
        </div>
      </div>
    </section>
  );
}
